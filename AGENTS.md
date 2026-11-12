<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# project_sppd

Next.js App Router + Better Auth + SQLite/Drizzle app. Bun is the required runtime.

## Commands

- `bun dev` (port 3000), `bun run build`, `bun run lint` (script is bare `eslint`, no auto-fix)
- Typecheck: `bunx tsc --noEmit` (there is no script for it)
- No test runner, test files, or CI are configured. Do not invent a test command.
- Bun is mandatory: `db/index.ts` imports `bun:sqlite` and code reads `Bun.env`. Node/npm execution will fail.

## Toolchain quirks

- Next 16.4.3 with breaking changes — read `node_modules/next/dist/docs/` before coding. `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and experimental `agentFeedback`; layouts already use generated types such as `LayoutProps<"/">`.
- Drizzle ORM and drizzle-kit are v1 RC, not stable v0. Relations use `defineRelations()` (`db/relations.ts`) and the client is created with `drizzle({ client, relations })`; verify against installed v1 types before copying v0 examples.
- `eslint` also lints generated `drizzle/` files and currently reports unused-variable warnings there. Do not "fix" generated files.

## Data layer

- Schema: `db/schema.ts`. Relations: `db/relations.ts`. Client: `db/index.ts` (`drizzle-orm/bun-sqlite`).
- The SQLite path comes from `DB_FILE_NAME=db/mydb.sqlite` in `.env`, loaded via `dotenv/config`. Required env vars: `DB_FILE_NAME`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_URL`. `.env` is gitignored.
- `drizzle/` is drizzle-kit output (generated `schema.ts`/`relations.ts`, snapshots, migrations). The existing `drizzle/20261105151113_wise_nicolaos/migration.sql` is empty, yet the tables already exist in `db/mydb.sqlite`; do not assume `drizzle-kit migrate` rebuilds the schema.
- Run migrations from the repo root with `bunx drizzle-kit generate|migrate|push|studio` — there are no package.json scripts for them.

## Architecture

- `app/api/auth/[...all]/route.ts` mounts Better Auth through `toNextJsHandler(auth)`. Server config is `lib/auth.ts` (Drizzle adapter, email/password, `nextCookies()`); browser client is `lib/auth-client.ts`.
- Interactive auth logic lives in `"use client"` hooks under `hooks/` (see `hooks/use-sign-in.ts`); auth pages live in the `app/(auth)` route group.
- Auth pages are still stubs: `sign-in/page.tsx` is empty and `sign-up/page.tsx` exports named `SignUpPage` instead of a default export, so it is not yet a valid route.
- UI uses shadcn style `base-nova` built on `@base-ui/react`, not Radix. Add components via `bunx shadcn add ...`. Import `cn` directly from the `cn` package (`lib/utils.ts` only re-exports it).
- Path alias: `@/*` maps to the repo root.

## Conventions

- User-facing auth copy and related comments are in Indonesian; keep that language when extending auth UI.

## Response

- setiap ingin eksekusi beri tahu saya terlebih dahulu
