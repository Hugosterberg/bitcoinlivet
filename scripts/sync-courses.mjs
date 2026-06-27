// @ts-check
/**
 * Sync Plan ₿ Network course content into the app (build-time, vendored).
 *
 * Pulls a course from PlanB-Network/bitcoin-educational-content (CC BY-SA 4.0),
 * parses its language-neutral structure (parts/chapters keyed by UUID + quizzes)
 * and emits committed data under features/education/data/generated/, plus images
 * under public/courses/<course>/<locale>/.
 *
 * Run: node scripts/sync-courses.mjs
 *
 * Nothing here runs at request time — production reads only the committed output,
 * so an upstream outage can never affect the live site.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, mkdirSync, cpSync, existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { marked } from "marked";

const REPO = "https://github.com/PlanB-Network/bitcoin-educational-content.git";
/** Pinned upstream commit for reproducible syncs. */
const REF = "7be43465c497577f940c5f04945a81b4c4f40b7d";
const COURSES = ["btc101"];
const LOCALES = ["sv", "en"];
/** Fallback locale used when a chapter/quiz lacks the target translation. */
const FALLBACK = "en";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DATA = join(ROOT, "features", "education", "data", "generated");
const OUT_PUBLIC = join(ROOT, "public", "courses");
const ICONS = ["coins", "bitcoin", "stack", "chart", "shield"];
/** Cap quizzes attached to a single lesson (Plan B ships ~10+ per chapter). */
const MAX_QUIZ_PER_LESSON = 4;

/** Slugify a heading into a clean, ASCII URL segment. */
function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritical marks
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Deterministic 32-bit hash for stable quiz-option shuffling. */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Seeded shuffle so option order is stable across syncs. */
function shuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Strip markdown to plain text for summaries. */
function plain(md) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** First sentence (≈ summary), capped. */
function summarize(md) {
  const text = plain(md);
  const sentence = text.split(/(?<=[.!?])\s/)[0] ?? text;
  return (sentence.length > 180 ? `${sentence.slice(0, 177)}…` : sentence).trim();
}

function readingMinutes(md) {
  const words = plain(md).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Split "---\nfrontmatter\n---\nbody" into { data, body }. */
function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  return { data: parseYaml(m[1]) ?? {}, body: m[2] };
}

/**
 * Parse a course markdown file into parts → chapters keyed by UUID.
 * Structure: leading course intro, then `+++`, then `# Part` (+<partId>)
 * blocks each containing `## Chapter` (+<chapterId>) blocks.
 */
function parseCourseMarkdown(src) {
  const { data, body } = frontmatter(src);
  // Drop the course intro that precedes the first `+++`.
  const afterIntro = body.includes("+++") ? body.split("+++").slice(1).join("+++") : body;

  const parts = [];
  // Split on level-1 headings (parts).
  const partChunks = afterIntro.split(/\n(?=# (?!#))/);
  for (const chunk of partChunks) {
    const partMatch = chunk.match(/^#\s+(.+?)\s*\n/);
    const partIdMatch = chunk.match(/<partId>\s*([\w-]+)\s*<\/partId>/);
    if (!partMatch || !partIdMatch) continue;

    const partTitle = partMatch[1].trim();
    const partId = partIdMatch[1];

    const chapters = [];
    const chapterChunks = chunk.split(/\n(?=## (?!#))/);
    for (const cc of chapterChunks) {
      const chMatch = cc.match(/^##\s+(.+?)\s*\n/);
      const chIdMatch = cc.match(/<chapterId>\s*([\w-]+)\s*<\/chapterId>/);
      if (!chMatch || !chIdMatch) continue;

      const body = cc
        .replace(/^##\s+.+?\n/, "")
        .replace(/<chapterId>[\s\S]*?<\/chapterId>/, "")
        .trim();

      chapters.push({
        id: chIdMatch[1],
        title: chMatch[1].trim(),
        markdown: body,
      });
    }

    if (chapters.length === 0) continue;
    parts.push({ id: partId, title: partTitle, chapters });
  }

  return { meta: data, parts };
}

/** Convert chapter markdown → HTML, rewriting asset paths to /courses/<course>/<locale>/. */
function renderHtml(md, course, locale, assetLocales) {
  const rewritten = md.replace(/!\[[^\]]*\]\(assets\/([\w-]+)\/([^)]+)\)/g, (m, assetLoc, file) => {
    // Prefer the requested locale's asset; fall back to en if missing.
    const loc = assetLocales.has(assetLoc) ? assetLoc : FALLBACK;
    return `![](/courses/${course}/${loc}/${file})`;
  });
  return marked.parse(rewritten, { async: false });
}

/** Load all quizzes for a course, indexed by chapterId, for a given locale. */
function loadQuizzes(courseDir, locale) {
  const quizDir = join(courseDir, "quizz");
  if (!existsSync(quizDir)) return new Map();

  const byChapter = new Map();
  for (const entry of readdirSync(quizDir)) {
    const dir = join(quizDir, entry);
    const questionFile = join(dir, "question.yml");
    if (!existsSync(questionFile)) continue;
    const meta = parseYaml(readFileSync(questionFile, "utf8")) ?? {};
    const chapterId = meta.chapterId;
    if (!chapterId) continue;

    const locFile = join(dir, `${locale}.yml`);
    const file = existsSync(locFile) ? locFile : join(dir, `${FALLBACK}.yml`);
    if (!existsSync(file)) continue;
    const q = parseYaml(readFileSync(file, "utf8")) ?? {};
    if (!q.question || !q.answer || !Array.isArray(q.wrong_answers)) continue;

    const options = shuffle([q.answer, ...q.wrong_answers], hash(meta.id ?? entry));
    const list = byChapter.get(chapterId) ?? [];
    list.push({
      id: meta.id ?? `${chapterId}-${entry}`,
      question: String(q.question).trim(),
      options: options.map((o) => String(o).trim()),
      answer: options.indexOf(q.answer),
      explanation: String(q.explanation ?? "").trim(),
    });
    byChapter.set(chapterId, list);
  }
  return byChapter;
}

function buildCourse(courseDir, course, locale, assetLocales) {
  const mdPath = join(courseDir, `${locale}.md`);
  const raw = existsSync(mdPath)
    ? readFileSync(mdPath, "utf8")
    : readFileSync(join(courseDir, `${FALLBACK}.md`), "utf8");
  // Normalize CRLF→LF so heading/frontmatter regexes behave on Windows clones.
  const src = raw.replace(/\r\n/g, "\n");

  const courseMeta = parseYaml(readFileSync(join(courseDir, "course.yml"), "utf8")) ?? {};
  const { meta, parts } = parseCourseMarkdown(src);
  const quizzes = loadQuizzes(courseDir, locale);

  const usedSlugs = new Set();
  const uniqueSlug = (title, fallback) => {
    let base = slugify(title) || fallback;
    let slug = base;
    let n = 2;
    while (usedSlugs.has(slug)) slug = `${base}-${n++}`;
    usedSlugs.add(slug);
    return slug;
  };

  const modules = parts.map((part, i) => {
    const lessonSlugs = new Set();
    const lessons = part.chapters.map((ch) => {
      let base = slugify(ch.title) || ch.id.slice(0, 8);
      let slug = base;
      let n = 2;
      while (lessonSlugs.has(slug)) slug = `${base}-${n++}`;
      lessonSlugs.add(slug);
      return {
        id: ch.id,
        slug,
        title: ch.title,
        summary: summarize(ch.markdown),
        minutes: readingMinutes(ch.markdown),
        html: renderHtml(ch.markdown, course, locale, assetLocales),
        // Plan B ships many quizzes per chapter; cap to keep the lesson quiz focused.
        quiz: (quizzes.get(ch.id) ?? []).slice(0, MAX_QUIZ_PER_LESSON),
      };
    });
    return {
      id: part.id,
      slug: uniqueSlug(part.title, `del-${i + 1}`),
      title: part.title,
      subtitle: "",
      icon: ICONS[i % ICONS.length],
      lessons,
    };
  });

  return {
    courseId: courseMeta.id ?? course,
    name: meta.name ?? course,
    goal: meta.goal ?? "",
    objectives: Array.isArray(meta.objectives) ? meta.objectives : [],
    license: "CC BY-SA 4.0",
    source: `https://github.com/PlanB-Network/bitcoin-educational-content/tree/${REF}/courses/${course}`,
    contributors: Array.isArray(courseMeta.contributor_names) ? courseMeta.contributor_names : [],
    modules,
  };
}

function main() {
  const tmp = mkdtempSync(join(tmpdir(), "planb-"));
  console.log(`Cloning ${REPO} @ ${REF.slice(0, 8)} (sparse)…`);
  try {
    execFileSync("git", ["clone", "--no-checkout", "--depth", "1", "--filter=blob:none", REPO, tmp], { stdio: "inherit" });
    execFileSync("git", ["-C", tmp, "sparse-checkout", "set", ...COURSES.map((c) => `courses/${c}`)], { stdio: "inherit" });
    // Fetch + checkout the pinned commit specifically.
    execFileSync("git", ["-C", tmp, "fetch", "--depth", "1", "origin", REF], { stdio: "inherit" });
    execFileSync("git", ["-C", tmp, "checkout", REF], { stdio: "inherit" });

    mkdirSync(OUT_DATA, { recursive: true });

    for (const course of COURSES) {
      const courseDir = join(tmp, "courses", course);
      const assetsDir = join(courseDir, "assets");
      const assetLocales = new Set(
        existsSync(assetsDir) ? readdirSync(assetsDir).filter((d) => existsSync(join(assetsDir, d))) : [],
      );

      // Vendor images for every locale we publish (plus the fallback).
      for (const loc of new Set([...LOCALES, FALLBACK])) {
        const from = join(assetsDir, loc);
        if (existsSync(from)) {
          const to = join(OUT_PUBLIC, course, loc);
          mkdirSync(to, { recursive: true });
          cpSync(from, to, { recursive: true });
        }
      }

      for (const locale of LOCALES) {
        const data = buildCourse(courseDir, course, locale, assetLocales);
        const file = join(OUT_DATA, `${course}.${locale}.json`);
        writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
        const lessons = data.modules.reduce((n, m) => n + m.lessons.length, 0);
        console.log(`✓ ${course}.${locale}: ${data.modules.length} modules, ${lessons} lessons`);
      }
    }

    writeIndex();
    console.log("Done. Generated data is committed; production never calls Plan B.");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** Emit a typed index that maps each locale to its generated courses. */
function writeIndex() {
  const lines = [
    "// AUTO-GENERATED by scripts/sync-courses.mjs — do not edit by hand.",
    "// Source: PlanB-Network/bitcoin-educational-content (CC BY-SA 4.0).",
    'import type { Locale } from "@/i18n/routing";',
    'import type { GeneratedCourse } from "@/features/education/data/course-types";',
  ];
  for (const course of COURSES) {
    for (const locale of LOCALES) {
      lines.push(`import ${course}_${locale} from "./${course}.${locale}.json";`);
    }
  }
  lines.push("");
  lines.push("export const generatedCourses: Record<Locale, GeneratedCourse[]> = {");
  for (const locale of LOCALES) {
    const items = COURSES.map((c) => `${c}_${locale} as GeneratedCourse`).join(", ");
    lines.push(`  ${locale}: [${items}],`);
  }
  lines.push("};");
  writeFileSync(join(OUT_DATA, "index.ts"), `${lines.join("\n")}\n`, "utf8");
}

main();
