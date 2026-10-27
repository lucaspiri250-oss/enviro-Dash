import { test, expect, type Page } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'index' },
  { path: '/emissions', name: 'emissions' },
  { path: '/energy', name: 'energy' },
  { path: '/land', name: 'land' },
  { path: '/air', name: 'air' },
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

// Data presence: these tests confirm the country queries returned real rows.
// Evidence renders <Dropdown> as a combobox (button + popover) with a
// virtualised option list, not a native <select>, so we open it with the
// keyboard, search for a known country and check it appears.

async function openDropdown(page: Page) {
  const trigger = page.getByRole('combobox').first();
  await trigger.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('option').first()).toBeVisible();
  return trigger;
}

async function searchOptions(page: Page, text: string) {
  await page.locator('[data-cmdk-input]').fill(text);
  return page.getByRole('option', { name: text });
}

// The option list is virtualised (only a handful of rows are in the DOM), and
// multi-select dropdowns pin their selected countries at the top. So to prove
// the full country list loaded, scroll the list to the end and check the
// alphabetically last country is there.
async function scrollOptionsToEnd(page: Page) {
  await page.evaluate(() => {
    const viewport = document.querySelector('[role="option"]')?.closest('.viewport');
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  });
}

for (const p of [
  { path: '/', name: 'index' },
  { path: '/emissions', name: 'emissions' },
  { path: '/air', name: 'air' },
]) {
  test(`${p.name}: country dropdown is populated with data`, async ({ page }) => {
    await page.goto(p.path);
    await waitForQueriesToResolve(page);
    await openDropdown(page);
    await scrollOptionsToEnd(page);
    await expect(
      page.getByRole('option', { name: 'Zimbabwe' }),
      `country_list on ${p.path} should run from A to Z`,
    ).toBeVisible();
  });
}

test('index: country dropdown selection is interactive', async ({ page }) => {
  await page.goto('/');
  await waitForQueriesToResolve(page);
  const trigger = await openDropdown(page);
  const option = await searchOptions(page, 'United Kingdom');
  await option.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toContainText('United Kingdom');
});
