---
name: nextjs-bun-dev
description: Development guide and coding standards for adding features, writing database schemas/queries, and debugging in a Next.js project powered by Bun, Drizzle ORM, and bun:sqlite.
---

# Next.js + Bun + Drizzle (`bun:sqlite`) Development Guide

Follow these rules and workflows whenever assisting with feature development, refactoring, or debugging in this repository.

## 1. Core Tech Stack & Strict Constraints

- **Runtime & Package Manager**: Always use `bun`, `bunx`, `bun add`, `bun remove`, and `bun run`. **Never** suggest or execute `npm`, `npx`, `yarn`, or `pnpm`.
- **Database Driver**: Use Bun's native SQLite driver (`bun:sqlite`) paired with `drizzle-orm/bun-sqlite`. **Never** install or import `better-sqlite3`, `sqlite3`, or `@libsql/client`.
- **ORM & Schema**: Use **Drizzle ORM** for all schema definitions, relations, and queries.
  - Infer TypeScript types directly from schemas (`typeof table.$inferSelect`, `typeof table.$inferInsert`) instead of duplicating manual interfaces.
  - Use `bunx drizzle-kit generate` or `bunx drizzle-kit push` for schema changes.
- **Framework (Next.js App Router)**:
  - Default to **Server Components** for data fetching.
  - Only add `"use client"` when interactivity, browser APIs, or React client hooks (`useState`, `useEffect`, etc.) are strictly required.
  - **Server/Client Boundary**: Never import `bun:sqlite` or the Drizzle `db` instance inside Client Components or Edge-only middleware. Keep all DB access strictly on the server (Server Components, Server Actions, or Route Handlers).

## 2. Workflow: Adding New Features

When asked to build or add a new feature:

1. **Inspect Existing Patterns First**:
   - Check the project directory layout (`src/` vs root `app/`), existing Drizzle schema files, `drizzle.config.ts`, and `package.json` before creating new files.
   - Match existing naming conventions, folder organization, and code style.
2. **Implement Bottom-Up**:
   - **Database Layer**: Update or add Drizzle table schemas/relations if persistence is needed.
   - **Data Access / Mutations**: Implement clean server-side query functions, Server Actions, or API Route Handlers with proper input validation and error handling.
   - **UI Layer**: Build or update the Next.js pages and components, connecting them cleanly to the server layer.
3. **Guide the User Clearly**:
   - Briefly explain the architectural choices made and how the pieces connect.
   - Explicitly list any follow-up commands the user needs to run (e.g., `bunx drizzle-kit push` or required `.env` keys).

## 3. Workflow: Debugging & Troubleshooting

When asked to fix a bug or investigate an error:

1. **Identify the Root Cause First**:
   - Inspect the relevant files and full stack trace before editing.
   - Pay special attention to common pitfalls in this stack:
     - `bun:sqlite` or server-only modules leaking into `"use client"` bundles.
     - Next.js async dynamic APIs (`await params`, `await searchParams`, `await cookies()`, `await headers()`).
     - SQLite type mismatches (e.g., storing booleans/timestamps as integers or text) or database lock errors (`SQLITE_BUSY` — suggest WAL mode `PRAGMA journal_mode = WAL;` if relevant).
     - Stale Next.js cache requiring `revalidatePath` or `revalidateTag` after mutations.
2. **Apply Minimal, Targeted Fixes**:
   - Fix the root cause without unnecessarily rewriting unrelated code.
3. **Explain the Fix**:
   - State clearly: **(a)** what caused the bug, **(b)** what was changed to fix it, and **(c)** any tip to prevent similar issues.

## 4. Verification Before Finishing

After writing or modifying code:

- Run `bunx tsc --noEmit` (if shell access is available) to ensure there are no TypeScript errors.
- Ensure no unused imports, broken relative paths, or Node-specific polyfills were introduced.
