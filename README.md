# enviro-dash

**Live:** https://delicate-elf-6fc53e.netlify.app

An Evidence.dev environmental data dashboard. Five pages (Overview, Emissions, Energy, Land, Air Quality)
powered by six Our World in Data indicators. Country filters and year-range sliders are interactive;
charts update instantly via DuckDB-Wasm with no backend.

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

Deployed to **Netlify** — pushes to `main` trigger automatic rebuilds.
A weekly cron job (`.github/workflows/weekly-refresh.yml`) triggers a fresh
build every Monday to pick up new OWID data.

To deploy manually to other hosts:

- **Netlify**: `netlify deploy --prod --dir build`
- **GitHub Pages**: push `build/` to the `gh-pages` branch

## Adding a new indicator

Run `/add-indicator` in Claude Code, or follow the pattern in `spec/README.md` —
the spec directory is the source of truth for all SQL sources and dashboard pages.

## Data freshness

OWID data is cached as Parquet at build time under `.evidence/meta/query-cache/`.
To refresh: delete that directory and re-run `npm run sources`.
