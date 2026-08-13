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

async function setSceneProgress(page, project, progress) {
  await page.evaluate(({ project, progress }) => {
    const scene = document.querySelector(`[data-project="${project}"]`);
    const top = scene.getBoundingClientRect().top + scrollY;
    const travel = scene.offsetHeight - innerHeight;
    scrollTo(0, top + travel * progress);
  }, { project, progress });
  await settleFrame(page);
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
  await expect(page.locator('#selected-work-title')).toContainText('신호');
  await page.evaluate(() => scrollTo(0, document.querySelector('#selected-work').offsetTop));
  const before = await page.evaluate(() => scrollY);
  await page.locator('[data-lang="en"]').click();
  await expect(page.locator('#selected-work-title')).toContainText('signals');
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('language switch keeps the active label legible on dark and light backgrounds', async ({ page }) => {
  await page.goto('/');
  const activeLanguage = page.locator('[data-lang][aria-pressed="true"]');
  const colors = () => activeLanguage.evaluate(element => {
    const style = getComputedStyle(element);
    return [style.color, style.backgroundColor];
  });

  let [color, background] = await colors();
  expect(color).not.toBe(background);

  await page.evaluate(() => scrollTo(0, document.querySelector('#selected-work').offsetTop));
  await settleFrame(page);
  await expect(page.locator('#site-nav')).toHaveAttribute('data-on-dark', 'false');
  [color, background] = await colors();
  expect(color).not.toBe(background);
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

test('desktop product scenes advance and reverse deterministically', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  for (const project of ['pawrelay', 'operations', 'skillsets', 'f301']) {
    const scene = page.locator(`[data-project="${project}"]`);
    await setSceneProgress(page, project, 0.1);
    await expect(scene).toHaveAttribute('data-scene-state', 'thesis');
    await setSceneProgress(page, project, 0.5);
    await expect(scene).toHaveAttribute('data-scene-state', 'evidence');
    await setSceneProgress(page, project, 0.82);
    await expect(scene).toHaveAttribute('data-scene-state', 'method');
    await setSceneProgress(page, project, 0.12);
    await expect(scene).toHaveAttribute('data-scene-state', 'thesis');
  }
});

test('mobile product scenes use readable normal flow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  for (const project of ['pawrelay', 'operations', 'skillsets', 'f301']) {
    const scene = page.locator(`[data-project="${project}"]`);
    await expect(scene.locator('[data-scene-layer="thesis"]')).toBeVisible();
    await expect(scene.locator('[data-scene-layer="evidence"]')).toBeVisible();
    await expect(scene.locator('[data-scene-layer="method"]')).toBeVisible();
    await expect(scene.locator('.project-scene__stage')).toHaveCSS('position', 'relative');
  }
});

test('reduced motion removes product scene pinning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('[data-project="pawrelay"] .project-scene__stage')).toHaveCSS('position', 'relative');
  await expect(page.locator('[data-project="pawrelay"] [data-scene-layer="thesis"]')).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-project="pawrelay"] [data-scene-layer="thesis"]')).toHaveCSS('transform', 'none');
  await expect(page.locator('[data-project="pawrelay"] [data-scene-layer="evidence"]')).toBeVisible();
  await expect(page.locator('[data-project="f301"] [data-scene-layer="method"]')).toBeVisible();
});

test('product scenes remain readable when the enhancement script is unavailable', async ({ page }) => {
  await page.route('**/assets/js/product-story.js', route => route.abort());
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  await expect(page.locator('[data-product-scene]')).toHaveCount(4);
  await expect(page.locator('[data-scene-layer]')).toHaveCount(12);
  await expect(page.locator('html')).not.toHaveAttribute('data-product-story-ready', 'true');

  for (const layer of await page.locator('[data-scene-layer]').all()) {
    await expect(layer).toBeVisible();
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('outcomes distinguish public artifacts, a live service, and an inquiry-only program', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.locator('[data-lang="ko"]').click();

  await expect(page.locator('[data-outcome]')).toHaveCount(2);
  await expect(page.locator('[data-outcome="research"]')).toContainText('Technical check as of 10 Aug 2026');
  await expect(page.locator('[data-outcome="research"] a')).toHaveAttribute('href', /stock-ai-negative-results-reproducibility/);

  const liveOffer = page.locator('[data-offer-status="live"]');
  await expect(liveOffer).toContainText('LIVE ON KMONG');
  await expect(liveOffer.locator('a')).toHaveAttribute('href', 'https://kmong.com/gig/789934');

  const reviewOffer = page.locator('[data-offer-status="under-review"]');
  await expect(reviewOffer).toContainText('크몽 심사 중');
  await expect(reviewOffer.locator('a')).toHaveAttribute('href', '#contact');
  await expect(reviewOffer.locator('a')).not.toHaveAttribute('target', '_blank');

  const desktopLayout = await page.locator('[data-outcome="research"]').evaluate(element => {
    const story = element.querySelector('.outcome-band__story').getBoundingClientRect();
    const body = element.querySelector('.outcome-band__body').getBoundingClientRect();
    return { storyRight: story.right, bodyLeft: body.left };
  });
  expect(desktopLayout.bodyLeft).toBeGreaterThan(desktopLayout.storyRight);
});

test('AI education promotion switches language and routes to collaboration', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-lang="en"]').click();
  await expect(page.locator('#outcomes-title')).toContainText('Evidence became a paper');
  await expect(page.locator('[data-offer-status="under-review"]')).toContainText('KMONG REVIEW IN PROGRESS');
  await expect(page.locator('[data-offer-status="under-review"] a')).toContainText('Ask about training');

  await page.locator('[data-offer-status="under-review"] a').click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('#contact')).toBeVisible();
  await expect(page.locator('#contact')).toContainText('AI training');
});

for (const viewport of [
  { name: 'outcomes-mobile', width: 390, height: 844 },
  { name: 'outcomes-small-mobile', width: 320, height: 700 },
]) {
  test(`${viewport.name} keeps every outcome in readable document order`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    for (const selector of ['[data-outcome="research"]', '[data-offer-status="live"]', '[data-offer-status="under-review"]']) {
      await expect(page.locator(selector)).toBeVisible();
    }

    const layout = await page.locator('[data-outcome="research"]').evaluate(element => {
      const story = element.querySelector('.outcome-band__story').getBoundingClientRect();
      const body = element.querySelector('.outcome-band__body').getBoundingClientRect();
      return { storyBottom: story.bottom, bodyTop: body.top };
    });
    expect(layout.bodyTop).toBeGreaterThanOrEqual(layout.storyBottom);

    const inquiryHeight = await page.locator('[data-offer-status="under-review"] a').evaluate(element => element.getBoundingClientRect().height);
    expect(inquiryHeight).toBeGreaterThanOrEqual(44);
  });
}
