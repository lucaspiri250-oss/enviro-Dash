import { test, expect, type Page } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'index' },
  { path: '/emissions', name: 'emissions' },
  { path: '/energy', name: 'energy' },
  { path: '/land', name: 'land' },
];

async function waitForQueriesToResolve(page: Page) {
  await expect(page.getByText('loading...')).toHaveCount(0, { timeout: 90_000 });
}

function captureQueryErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const txt = msg.text();
    if (txt.includes('Error in Query') || txt.includes('Catalog Error') || txt.includes('Binder Error')) {
      errors.push(txt);
    }
  });
  return errors;
}

for (const p of PAGES) {
  test(`${p.name}: loads without DuckDB query errors`, async ({ page }) => {
    const queryErrors = captureQueryErrors(page);
    await page.goto(p.path);
    await waitForQueriesToResolve(page);
    expect(queryErrors, `Query errors on ${p.path}:\n${queryErrors.join('\n---\n')}`).toEqual([]);
  });
}

// Cross-query SQL regressions (the bug this suite was added for) surface as
// "Catalog Error" or "Binder Error" in the console. The four page tests above
// catch those regardless of which chart they appear in. We deliberately don't
// assert on individual chart-element presence — Evidence renders charts via
// IntersectionObserver after queries resolve, which is timing-sensitive in
// headless Chromium and produces flaky failures unrelated to the dashboard's
// correctness.
