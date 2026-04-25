# Contributing to enviro-Dash

Thanks for your interest in contributing. This guide covers the main workflows you'll need.

---

## Prerequisites

- Node.js 20 or later
- npm 7 or later

```bash
cd app
npm install
```

---

## Adding a new OWID indicator

The fastest path is the `/add-indicator` Claude Code agent:

```
/add-indicator <description of indicator>
```

It will find the OWID chart slug, write the SQL source, add page content, and validate the column names against the live CSV — all in one shot.

To do it manually, follow the step-by-step guide in [`spec/README.md`](spec/README.md).

**Before opening a PR that adds or changes a source**, run:

```
/owid-check <source-name>
```

This validates that every quoted column name in the SQL and page files matches the live OWID CSV. OWID renames columns silently; this check catches that before it reaches production.

---

## The spec → app pattern

The `spec/` directory is the source of truth for all SQL sources and dashboard pages. The `app/` directory is a managed copy — never edit `app/sources/` or `app/pages/` directly.

After changing anything in `spec/`, sync the changes to `app/`:

```
/spec-sync
```

This command diffs `spec/` against `app/sources/` and `app/pages/`, reports any drift, and copies changes across. Run it before pushing.

---

## Running tests locally

**Source validation** — checks that every SQL query returns rows and has the expected columns:

```bash
npm run test:sources
```

Takes about 3 seconds. Hits live OWID CSVs over the network — requires internet access.

**End-to-end tests** — builds the app and runs Playwright against the static output:

```bash
npm run test:e2e:ci   # sources + build + Playwright
```

Takes a few minutes on first run (Chromium download). Subsequent runs are faster.

---

## CI jobs

Every push and PR runs two jobs:

| Job | Trigger | What it does |
|-----|---------|-------------|
| `test-sources` | push / PR | Runs `npm run test:sources` — catches SQL regressions |
| `build-and-e2e` | after `test-sources` passes | Full build + Playwright E2E — catches render errors |

A third job (`weekly-refresh`) runs every Monday at 06:00 UTC and triggers a Netlify rebuild to pick up fresh OWID data without committing Parquet files to git.

Both CI jobs must be green on `main` before the v1.0 release.

---

## Repo layout

```
sources/owid/   ← SQL source files (edit here)
pages/          ← Evidence Markdown pages (edit here)
scripts/        ← source validation test runner
tests/          ← Playwright E2E tests
.claude/        ← /owid-check, /add-indicator, /spec-sync agents
```
