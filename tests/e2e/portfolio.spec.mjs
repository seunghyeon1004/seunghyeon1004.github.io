import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'small-mobile', width: 320, height: 700 },
];

async function settleFrame(page) {
  await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
}

for (const viewport of viewports) {
  test(`${viewport.name} has no overflow or console errors`, async ({ page }) => {
    const errors = [];
    page.on('console', message => message.type() === 'error' && errors.push(message.text()));
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.locator('#selected-work')).toBeAttached();
    await settleFrame(page);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBe(0);
    expect(errors).toEqual([]);
  });
}

test('film reaches all beats, finale, and reverses', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.waitForFunction(() => document.querySelector('#scroll-film').readyState >= 1);

  const setProgress = async progress => {
    await page.evaluate(value => {
      const story = document.querySelector('#scroll-story');
      const distance = story.offsetHeight - innerHeight;
      scrollTo(0, story.offsetTop + distance * value);
    }, progress);
    await settleFrame(page);
  };

  await setProgress(0.75);
  await expect(page.locator('[data-beat="5"]')).toHaveClass(/is-active/);
  await expect.poll(() => page.locator('#scroll-film').evaluate(video => video.currentTime)).toBeGreaterThan(10);
  await setProgress(1);
  await expect(page.locator('#scroll-story')).toHaveAttribute('data-wordmark-visible', '');
  await expect(page.locator('#final-wordmark')).toHaveCSS('opacity', '1');
  await setProgress(0.23);
  await expect(page.locator('[data-beat="1"]')).toHaveClass(/is-active/);
  await expect(page.locator('[data-beat="5"]')).not.toHaveClass(/is-active/);
  await expect.poll(() => page.locator('#scroll-film').evaluate(video => video.currentTime)).toBeLessThan(4);
});

test('language switch preserves position and updates copy', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-lang="ko"]').click();
  await expect(page.locator('#selected-work-title')).toContainText('과정');
  await page.evaluate(() => scrollTo(0, document.querySelector('#selected-work').offsetTop));
  const before = await page.evaluate(() => scrollY);
  await page.locator('[data-lang="en"]').click();
  await expect(page.locator('#selected-work-title')).toContainText('process');
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('mobile menu exposes navigation and closes after selection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  const menu = page.locator('#mobile-menu');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();
  await menu.locator('a[href="#capabilities"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();
});

test('reduced motion exposes readable content without scrubbing', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#scroll-story')).toHaveAttribute('data-film-state', 'reduced-motion');
  await expect(page.locator('[data-beat]')).toHaveCount(6);
  await expect(page.locator('[data-beat="0"]')).toBeVisible();
  const initialTime = await page.locator('#scroll-film').evaluate(video => video.currentTime);
  await page.evaluate(() => scrollTo(0, document.querySelector('#selected-work').offsetTop));
  await settleFrame(page);
  expect(await page.locator('#scroll-film').evaluate(video => video.currentTime)).toBe(initialTime);
});
