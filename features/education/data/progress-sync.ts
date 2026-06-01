"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { lessonKey } from "@/features/education/data/education";
import {
  applyCompletion,
  initialProgressData,
  mergeProgress,
  type CompleteArgs,
  type ProgressData,
} from "@/features/education/data/progress";

/**
 * Server-side bridge between Supabase and the client progression store.
 *
 * Reuses the pure reducer in `progress.ts`, so a signed-in user's XP, streaks
 * and badges follow exactly the same rules as an anonymous visitor. Tables and
 * RLS live in supabase/migrations/0002_user_progress.sql.
 */

/** Returns the signed-in user's id, or null when not authenticated/configured. */
async function getUserId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Loads the signed-in user's full progression as a `ProgressData` object.
 * Returns the empty state when not signed in, so callers can use it freely.
 */
export async function loadServerProgress(): Promise<ProgressData> {
  if (!isSupabaseConfigured) return initialProgressData;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return initialProgressData;

  const [{ data: aggregate }, { data: completions }] = await Promise.all([
    supabase
      .from("user_progress")
      .select("xp, streak, last_active, badges")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("lesson_completions")
      .select("module_slug, lesson_slug, correct, total, xp")
      .eq("user_id", user.id),
  ]);

  const lessons: ProgressData["lessons"] = {};
  for (const row of completions ?? []) {
    lessons[lessonKey(row.module_slug, row.lesson_slug)] = {
      correct: row.correct,
      total: row.total,
      xp: row.xp,
    };
  }

  return {
    lessons,
    xp: aggregate?.xp ?? 0,
    streak: aggregate?.streak ?? 0,
    lastActive: aggregate?.last_active ?? null,
    badges: aggregate?.badges ?? [],
  };
}

/**
 * Persists a single lesson completion for the signed-in user: inserts the
 * completion row (idempotently) and updates the aggregate. Recomputes the
 * aggregate with the shared reducer so it can never drift from the client.
 */
export async function persistLessonCompletion(args: CompleteArgs): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;

  const prev = await loadServerProgress();
  const { next, result } = applyCompletion(prev, args);
  if (result.alreadyDone) return;

  const supabase = await createClient();
  const key = lessonKey(args.moduleSlug, args.lessonSlug);
  const lesson = next.lessons[key];

  const { error: completionError } = await supabase
    .from("lesson_completions")
    .upsert(
      {
        user_id: userId,
        module_slug: args.moduleSlug,
        lesson_slug: args.lessonSlug,
        correct: lesson.correct,
        total: lesson.total,
        xp: lesson.xp,
      },
      { onConflict: "user_id,module_slug,lesson_slug", ignoreDuplicates: true },
    );
  if (completionError) throw completionError;

  const { error: aggregateError } = await supabase.from("user_progress").upsert({
    user_id: userId,
    xp: next.xp,
    streak: next.streak,
    last_active: next.lastActive,
    badges: next.badges,
  });
  if (aggregateError) throw aggregateError;
}

/**
 * Merges anonymous localStorage progress into the signed-in account. Called
 * once after login so visitors keep what they earned before signing up.
 * Returns the merged state for the client to adopt.
 */
export async function mergeLocalIntoAccount(
  local: ProgressData,
): Promise<ProgressData> {
  const userId = await getUserId();
  if (!userId) return local;

  const server = await loadServerProgress();
  const merged = mergeProgress(server, local);

  const supabase = await createClient();

  const completionRows = Object.entries(merged.lessons).map(([key, lesson]) => {
    const [module_slug, lesson_slug] = key.split("/");
    return {
      user_id: userId,
      module_slug,
      lesson_slug,
      correct: lesson.correct,
      total: lesson.total,
      xp: lesson.xp,
    };
  });

  if (completionRows.length > 0) {
    const { error } = await supabase
      .from("lesson_completions")
      .upsert(completionRows, {
        onConflict: "user_id,module_slug,lesson_slug",
        ignoreDuplicates: true,
      });
    if (error) throw error;
  }

  const { error: aggregateError } = await supabase.from("user_progress").upsert({
    user_id: userId,
    xp: merged.xp,
    streak: merged.streak,
    last_active: merged.lastActive,
    badges: merged.badges,
  });
  if (aggregateError) throw aggregateError;

  return merged;
}

/** Clears all progression for the signed-in user (used by "Nollställ progress"). */
export async function resetServerProgress(): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;

  const supabase = await createClient();

  const { error: completionsError } = await supabase
    .from("lesson_completions")
    .delete()
    .eq("user_id", userId);
  if (completionsError) throw completionsError;

  const { error: aggregateError } = await supabase
    .from("user_progress")
    .update({ xp: 0, streak: 0, last_active: null, badges: [] })
    .eq("user_id", userId);
  if (aggregateError) throw aggregateError;
}
