<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.

Before implementing Next.js features:
- Check the installed Next.js version.
- Consult local documentation when available.
- Prefer current App Router patterns.
- Follow deprecation warnings.
- Do not assume APIs from older Next.js versions.
<!-- END:nextjs-agent-rules -->

# General Engineering Rules

- Use clean and maintainable code.
- Prefer readability over cleverness.
- Use strict TypeScript.
- Favor composition over inheritance.
- Keep components focused and reusable.
- Avoid unnecessary dependencies.
- Use semantic HTML and accessibility best practices.
- Optimize for performance and SEO.

# Architecture

Use pragmatic Vertical Slice Architecture.

Organize by feature/domain first.

Shared code belongs in:
- components/ui
- components/layout
- components/shared
- lib

Feature-specific code should stay inside the feature.

# React

- Prefer Server Components.
- Use Client Components only when necessary.
- Keep state local when possible.
- Avoid unnecessary global state.

# Next.js

- Use App Router.
- Keep route files thin.
- Prefer static generation where possible.
- Prioritize SEO.

# Workflow

Before major changes:
1. Analyze existing code.
2. Explain architecture decisions.
3. Implement incrementally.
4. Avoid modifying unrelated files.
# BAI Digital company context

bitcoinlivet is a BAI Digital product. Company-level rules (the feature loop:
feat/<slug> branches, human-reviewed PRs, definition of done) live in
[Hugosterberg/bai-digital-office](https://github.com/Hugosterberg/bai-digital-office) — read `ai/PLAYBOOK.md` there first.
Product context for agents is indexed in [ai/](./ai/README.md).

Definition of done here: `npm run lint` + `npm run build` green, change
observed in `next dev`, ai/-docs updated when architecture or decisions change.
