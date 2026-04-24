import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DuckDBInstance } from '@duckdb/node-api';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCES_DIR = join(__dirname, '..', 'sources', 'owid');
const CURRENT_YEAR = new Date().getUTCFullYear();
const ISO3_RE = /^[A-Z]{3}$/;

const sqlFiles = (await readdir(SOURCES_DIR))
  .filter((f) => f.endsWith('.sql'))
  .sort();

assert.ok(sqlFiles.length > 0, `No .sql files found in ${SOURCES_DIR}`);

for (const file of sqlFiles) {
  test(`sources/owid/${file}`, { timeout: 60_000 }, async () => {
    const sql = await readFile(join(SOURCES_DIR, file), 'utf8');
    const instance = await DuckDBInstance.create(':memory:');
    const conn = await instance.connect();

    let rows;
    try {
      const reader = await conn.runAndReadAll(sql);
      rows = reader.getRowObjects();
    } finally {
      conn.closeSync();
    }

    assert.ok(rows.length > 0, `${file}: returned 0 rows`);

    const cols = new Set(Object.keys(rows[0]));
    for (const required of ['entity', 'iso3', 'year']) {
      assert.ok(cols.has(required), `${file}: missing required column "${required}" (got: ${[...cols].join(', ')})`);
    }

    const toYear = (v) => {
      if (v == null) return NaN;
      if (typeof v === 'bigint') return Number(v);
      const n = Number(v);
      return Number.isFinite(n) ? n : NaN;
    };
    // Lower bound is 1000 (not 1800) because OWID's forest-area and CO₂
    // datasets include legitimate millennium-scale rows. The check is here to
    // catch regressions (negative, NaN, far-future, non-integer year), not to
    // assert a specific historical window.
    const outOfRange = rows.filter((r) => {
      const y = toYear(r.year);
      return !Number.isInteger(y) || y < 1000 || y > CURRENT_YEAR;
    });
    const sample = outOfRange.slice(0, 3).map((r) => String(r.year));
    assert.equal(
      outOfRange.length,
      0,
      `${file}: ${outOfRange.length} rows have year outside [1000, ${CURRENT_YEAR}] (sample: ${sample.join(', ')})`,
    );

    // Some OWID datasets are global/hemispheric (e.g., temperature anomaly) and
    // legitimately have no country-level iso3 codes. Only enforce the iso3
    // shape check on sources that contain at least one valid 3-letter code.
    // "Valid" includes both real country codes (ISO 3166-1 alpha-3) and OWID's
    // own aggregate codes (OWID_WRL, OWID_EUR, OWID_AFR, low/middle/high
    // income groupings, etc.) — both are intentional values from the source.
    const isLegit = (v) => ISO3_RE.test(v) || v.startsWith('OWID_');
    const isCountryLevel = rows.some((r) => ISO3_RE.test(String(r.iso3 ?? '')));
    if (isCountryLevel) {
      const validCount = rows.filter((r) => isLegit(String(r.iso3 ?? ''))).length;
      const validFraction = validCount / rows.length;
      assert.ok(
        validFraction >= 0.95,
        `${file}: only ${(validFraction * 100).toFixed(1)}% of rows have valid iso3 (3-letter ISO or OWID_ aggregate); need ≥95%`,
      );
    }
  });
}
