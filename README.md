# enviro-dash

**Live:** https://delicate-elf-6fc53e.netlify.app

An Evidence.dev environmental data dashboard. Five pages (Overview, Emissions, Energy, Land, Air Quality)
powered by six Our World in Data indicators. Country filters and year-range sliders are interactive;
charts update instantly via DuckDB-Wasm with no backend.

Built in a day (25 April 2026) with Claude Code. A scheduled GitHub Action rebuilds the site every Monday
so the data stays current without anyone touching it. Both the source-query smoke tests and the
Playwright end-to-end suite run in CI on every push (see Test below).

## Data

All data comes from [Our World in Data](https://ourworldindata.org), licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit goes to OWID and its original sources;
this repo only queries and visualises it.

## Dev

```bash
npm run sources   # fetch OWID CSVs and cache as Parquet
npm run dev       # dev server at http://localhost:3000
```

## Test

```bash
npm run test:sources   # validate SQL queries against live OWID data
npm run test:e2e:ci    # sources + build + Playwright e2e (requires built app)
```

## Build

```bash
npm run build          # static output → build/
npx serve build -l 3030   # preview the production build locally
```

## Deploy

Deployed to **Netlify** — live at https://delicate-elf-6fc53e.netlify.app. Pushes to `main` trigger automatic rebuilds via `netlify.toml`.

To deploy manually to other hosts:

- **Netlify**: `netlify deploy --prod --dir build`
- **GitHub Pages**: push `build/` to the `gh-pages` branch

> Note: Cloudflare Pages is not supported — Evidence's DuckDB-Wasm bundle exceeds the 25 MiB file size limit.

## Adding a new indicator

Run `/add-indicator` in Claude Code, or follow the workflow in [`CONTRIBUTING.md`](CONTRIBUTING.md).

## CSS customisation

Custom global CSS goes in `app.css` at this directory's root. Evidence's CLI copies it
over the framework template on every build. The file must include the full framework CSS
(it is seeded from `node_modules/@evidence-dev/evidence/template/src/app.css`).

## Data freshness

OWID data is cached as Parquet at build time under `.evidence/meta/query-cache/`.
To refresh: delete that directory and re-run `npm run sources`.
