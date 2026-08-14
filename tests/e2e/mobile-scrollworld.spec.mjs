import { expect, test } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
  screen: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

async function settleFrame(page) {
  await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
}

async function setPhoneSceneProgress(page, project, progress) {
  await page.evaluate(({ project, progress }) => {
    const scrollContainer = document.querySelector(
      `[data-project="${project}"] .project-scene__scroll`,
    );
    const top = scrollContainer.getBoundingClientRect().top + scrollY;
    const travel = scrollContainer.offsetHeight - innerHeight;
    scrollTo(0, top + travel * progress);
  }, { project, progress });
  await settleFrame(page);
}

async function swipe(page, { fromY, toY, x = 195 }) {
  const client = await page.context().newCDPSession(page);
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x, y: fromY }],
  });

  const steps = 12;
  for (let step = 1; step <= steps; step += 1) {
    const y = fromY + ((toY - fromY) * step) / steps;
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y }],
    });
    await page.waitForTimeout(16);
  }

  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await page.waitForTimeout(100);
  await settleFrame(page);
  await client.detach();
}

test('phone scenes use the condensed sticky layout and deterministic states', async ({ page }) => {
  await page.goto('/');
  const scene = page.locator('[data-project="pawrelay"]');
  const stage = scene.locator('.project-scene__stage');

  await expect(stage).toHaveCSS('position', 'sticky');
  await expect(stage).toHaveCSS('top', '64px');

  const metrics = await scene.evaluate(element => {
    const scrollContainer = element.querySelector('.project-scene__scroll').getBoundingClientRect();
    const stageRect = element.querySelector('.project-scene__stage').getBoundingClientRect();
    const methodRect = element.querySelector('.project-scene__method').getBoundingClientRect();
    return {
      viewportHeight: innerHeight,
      scrollHeight: scrollContainer.height,
      stageHeight: stageRect.height,
      methodAfterScroll: methodRect.top >= scrollContainer.bottom,
    };
  });

  expect(Math.abs(metrics.scrollHeight - metrics.viewportHeight * 1.8)).toBeLessThanOrEqual(2);
  expect(Math.abs(metrics.stageHeight - (metrics.viewportHeight - 64))).toBeLessThanOrEqual(2);
  expect(metrics.methodAfterScroll).toBe(true);

  await setPhoneSceneProgress(page, 'pawrelay', 0.1);
  await expect(scene).toHaveAttribute('data-scene-state', 'thesis');
  await setPhoneSceneProgress(page, 'pawrelay', 0.5);
  await expect(scene).toHaveAttribute('data-scene-state', 'evidence');
  await setPhoneSceneProgress(page, 'pawrelay', 0.82);
  await expect(scene).toHaveAttribute('data-scene-state', 'method');
  await setPhoneSceneProgress(page, 'pawrelay', 0.12);
  await expect(scene).toHaveAttribute('data-scene-state', 'thesis');
});

test('native phone swipes advance and reverse a project scene', async ({ page }) => {
  const errors = [];
  page.on('console', message => message.type() === 'error' && errors.push(message.text()));
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');

  const scene = page.locator('[data-project="pawrelay"]');
  await setPhoneSceneProgress(page, 'pawrelay', 0);
  await page.waitForTimeout(1000);
  await settleFrame(page);
  const initialY = await page.evaluate(() => scrollY);
  await expect(scene).toHaveAttribute('data-scene-state', 'thesis');

  await swipe(page, { fromY: 680, toY: 200 });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialY + 150);
  await expect(scene).toHaveAttribute('data-scene-state', 'evidence');

  const forwardY = await page.evaluate(() => scrollY);
  await swipe(page, { fromY: 200, toY: 680 });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(forwardY - 150);
  await expect(scene).toHaveAttribute('data-scene-state', 'thesis');
  expect(errors).toEqual([]);
});

test('native phone scrolling exits the final scene without lock or overflow', async ({ page }) => {
  await page.goto('/');
  await setPhoneSceneProgress(page, 'f301', 0.72);
  const startingY = await page.evaluate(() => scrollY);

  for (let index = 0; index < 6; index += 1) {
    await swipe(page, { fromY: 700, toY: 260 });
  }

  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(startingY + 1200);
  await expect.poll(() => page.locator('#outcomes').evaluate(element => {
    return element.getBoundingClientRect().top < innerHeight;
  })).toBe(true);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('reduced motion and script failure preserve native readable flow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const reducedStage = page.locator('[data-project="pawrelay"] .project-scene__stage');
  await expect(reducedStage).toHaveCSS('position', 'relative');
  for (const layer of await page.locator('[data-scene-layer]').all()) {
    await expect(layer).toBeVisible();
  }

  const startY = await page.evaluate(() => scrollY);
  await swipe(page, { fromY: 700, toY: 300 });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(startY);

  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await page.route('**/assets/js/product-story.js', route => route.abort());
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-product-story-ready', 'true');
  await expect(page.locator('[data-project="pawrelay"] .project-scene__stage')).toHaveCSS('position', 'relative');
  for (const layer of await page.locator('[data-scene-layer]').all()) {
    await expect(layer).toBeVisible();
  }
});
