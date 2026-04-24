# enviro-dash

An Evidence.dev environmental data dashboard. Four pages (Overview, Emissions, Energy, Land)
powered by five Our World in Data indicators. Country filters are interactive; charts update
instantly via DuckDB-Wasm with no backend.

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

The `build/` output is a plain static site. Deploy to any static host:

- **Cloudflare Pages**: `wrangler pages deploy build`
- **Netlify**: `netlify deploy --prod --dir build`
- **GitHub Pages**: push `build/` to the `gh-pages` branch

## Adding a new indicator

See [`../spec/README.md`](../spec/README.md) — the spec directory is the source of truth
for all SQL sources and dashboard pages.

## Data freshness

OWID data is cached as Parquet at build time under `.evidence/meta/query-cache/`.
To refresh: delete that directory and re-run `npm run sources`.
