# Mobile Scrollworld Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable a condensed, reversible project scrollytelling sequence on phones without changing the existing intro, tablet flow, or desktop story.

**Architecture:** Extend the existing product-story controller with an explicit phone/desktop scrubbing policy. Add a phone-only progressive-enhancement CSS layer and verify it in a touch-enabled Chromium context using native CDP touch events.

**Tech Stack:** Static HTML, CSS, JavaScript ES modules, Node test runner, Playwright Chromium

## Global Constraints

- Phone scrollytelling applies only at widths up to `640px` with `prefers-reduced-motion: no-preference`.
- Each phone scroll container is exactly `180svh`; its stage is sticky at `top: 64px` and `height: calc(100svh - 64px)`.
- Widths from `641px` through `1023px` keep the current normal document flow.
- Widths at `1024px` and above keep the current desktop `240vh` behavior.
- State thresholds remain thesis below `0.22`, evidence from `0.22` through `0.71999`, and method from `0.72` onward.
- Phone progress is measured from `.project-scene__scroll`, not from method-copy height.
- Do not use scroll snapping, nested scrolling, touch interception, or `preventDefault()`.
- Reduced motion and JavaScript failure keep every layer readable in normal document order.
- Do not add dependencies, media, HTML structure, or content changes.
- Do not push, merge, open a pull request, or deploy without a separate explicit approval.

---

### Task 1: Controller Scrubbing Policy

**Files:**
- Modify: `tests/product-story.test.mjs:1-30`
- Modify: `assets/js/product-story.js:1-75`

**Interfaces:**
- Consumes: `window.matchMedia()`, the existing four `[data-product-scene]` elements, and each phone scene's `.project-scene__scroll` element.
- Produces: `shouldScrubProductStory({ reducedMotion, desktop, phone }): boolean`; phone and desktop progress updates through the existing `--scene-progress` and `data-scene-state` interfaces.

- [ ] **Step 1: Write the failing scrubbing-policy unit test**

Update the import and add the following test so the missing policy fails with an assertion rather than a module-load error:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import * as productStory from '../assets/js/product-story.js';

const { clamp, getSceneProgress, getSceneState } = productStory;

test('scene scrubbing runs only on phones and desktops without reduced motion', () => {
  const shouldScrub = productStory.shouldScrubProductStory;

  assert.equal(shouldScrub?.({ reducedMotion: false, desktop: false, phone: true }), true);
  assert.equal(shouldScrub?.({ reducedMotion: false, desktop: true, phone: false }), true);
  assert.equal(shouldScrub?.({ reducedMotion: false, desktop: false, phone: false }), false);
  assert.equal(shouldScrub?.({ reducedMotion: true, desktop: false, phone: true }), false);
  assert.equal(shouldScrub?.({ reducedMotion: true, desktop: true, phone: false }), false);
});
```

Keep the two existing progress and state tests unchanged below it.

- [ ] **Step 2: Run the focused unit test and verify RED**

Run:

```bash
node --test tests/product-story.test.mjs
```

Expected: one assertion failure where the optional call returns `undefined` instead of `true`; the two existing tests pass.

- [ ] **Step 3: Implement the minimal phone/desktop policy**

Add the exported policy after `getSceneState()`:

```js
export function shouldScrubProductStory({ reducedMotion, desktop, phone }) {
  return !reducedMotion && (desktop || phone);
}
```

Inside `initProductStory()`, create the phone query next to the existing queries:

```js
const motionQuery = view.matchMedia('(prefers-reduced-motion: reduce)');
const desktopQuery = view.matchMedia('(min-width: 1024px)');
const phoneQuery = view.matchMedia('(max-width: 640px)');
```

Replace the current readable-state condition and progress target with:

```js
const shouldScrub = shouldScrubProductStory({
  reducedMotion: motionQuery.matches,
  desktop: desktopQuery.matches,
  phone: phoneQuery.matches,
});

if (!shouldScrub) {
  scenes.forEach(setReadableState);
  return;
}

scenes.forEach(scene => {
  const progressElement = phoneQuery.matches
    ? scene.querySelector('.project-scene__scroll')
    : scene;
  const progress = getSceneProgress(progressElement.getBoundingClientRect(), view.innerHeight);
  scene.style.setProperty('--scene-progress', progress.toFixed(5));
  scene.dataset.sceneState = getSceneState(progress);
});
```

Register and remove the phone media-query listener alongside the existing listeners:

```js
phoneQuery.addEventListener?.('change', requestRender);
```

```js
phoneQuery.removeEventListener?.('change', requestRender);
```

- [ ] **Step 4: Run the focused unit test and verify GREEN**

Run:

```bash
node --test tests/product-story.test.mjs
```

Expected: 3 tests pass, 0 fail.

- [ ] **Step 5: Commit the controller policy**

```bash
git add assets/js/product-story.js tests/product-story.test.mjs
git commit -m "feat: enable product story scrubbing on phones"
```

---

### Task 2: Phone Stage And Native Touch Behavior

**Files:**
- Create: `tests/e2e/mobile-scrollworld.spec.mjs`
- Modify: `tests/e2e/portfolio.spec.mjs:155-166`
- Modify: `assets/css/portfolio.css:2415-2456`

**Interfaces:**
- Consumes: controller-provided `html[data-product-story-ready="true"]`, `data-scene-state`, and `--scene-progress`.
- Produces: a `180svh` phone scroll container, a sticky `calc(100svh - 64px)` stage, reversible thesis/evidence states, and a normal-flow method handoff.

- [ ] **Step 1: Replace the obsolete mobile fallback assertion with the tablet contract**

Replace the existing `mobile product scenes use readable normal flow` test in `tests/e2e/portfolio.spec.mjs` with:

```js
test('mid-width product scenes keep readable normal flow', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');

  for (const project of ['pawrelay', 'operations', 'skillsets', 'f301']) {
    const scene = page.locator(`[data-project="${project}"]`);
    await expect(scene.locator('[data-scene-layer="thesis"]')).toBeVisible();
    await expect(scene.locator('[data-scene-layer="evidence"]')).toBeVisible();
    await expect(scene.locator('[data-scene-layer="method"]')).toBeVisible();
    await expect(scene.locator('.project-scene__stage')).toHaveCSS('position', 'relative');
  }
});
```

- [ ] **Step 2: Write the failing phone layout, touch, and fallback E2E tests**

Create `tests/e2e/mobile-scrollworld.spec.mjs` with:

```js
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
  const initialY = await page.evaluate(() => scrollY);
  await expect(scene).toHaveAttribute('data-scene-state', 'thesis');

  await swipe(page, { fromY: 680, toY: 420 });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialY + 150);
  await expect(scene).toHaveAttribute('data-scene-state', 'evidence');

  const forwardY = await page.evaluate(() => scrollY);
  await swipe(page, { fromY: 420, toY: 680 });
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
```

- [ ] **Step 3: Run the focused browser tests and verify RED**

Run:

```bash
npx playwright test tests/e2e/mobile-scrollworld.spec.mjs tests/e2e/portfolio.spec.mjs --grep "phone scenes|mid-width"
```

Expected: the mid-width test passes; the phone test fails because the stage is still `position: relative` and the scroll container is not `180svh`.

- [ ] **Step 4: Add the phone-only progressive-enhancement CSS**

Add this block after the existing `@media (max-width: 640px)` block and before the reduced-motion block:

```css
@media (max-width: 640px) and (prefers-reduced-motion: no-preference) {
  html[data-product-story-ready="true"] .project-scene__scroll {
    height: 180svh;
  }

  html[data-product-story-ready="true"] .project-scene__stage {
    position: sticky;
    top: 64px;
    display: grid;
    place-items: center;
    height: calc(100svh - 64px);
    min-height: 0;
    overflow: hidden;
    padding: 32px 18px;
  }

  html[data-product-story-ready="true"] .project-scene__thesis,
  html[data-product-story-ready="true"] .project-scene__evidence {
    position: absolute;
    width: calc(100% - 36px);
    max-width: none;
    margin: 0;
    transition: opacity 300ms ease, transform 520ms cubic-bezier(0.2, 0.72, 0.2, 1);
  }

  html[data-product-story-ready="true"] .project-scene__thesis {
    text-align: left;
  }

  html[data-product-story-ready="true"] .project-scene__evidence,
  html[data-product-story-ready="true"] .project-scene--pawrelay .project-scene__evidence {
    width: calc(100% - 36px);
    margin-top: 0;
    opacity: 0;
    transform: translateY(8svh) scale(0.9);
  }

  html[data-product-story-ready="true"] .project-scene[data-scene-state="thesis"] .project-scene__thesis {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  html[data-product-story-ready="true"] .project-scene[data-scene-state="thesis"] .project-scene__evidence {
    opacity: 0;
    transform: translateY(8svh) scale(0.9);
  }

  html[data-product-story-ready="true"] .project-scene[data-scene-state="evidence"] .project-scene__thesis,
  html[data-product-story-ready="true"] .project-scene[data-scene-state="method"] .project-scene__thesis {
    opacity: 0;
    transform: translateY(-6svh) scale(0.96);
  }

  html[data-product-story-ready="true"] .project-scene[data-scene-state="evidence"] .project-scene__evidence,
  html[data-product-story-ready="true"] .project-scene[data-scene-state="method"] .project-scene__evidence {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  html[data-product-story-ready="true"] .project-scene--pawrelay .product-frame img {
    transform: none;
  }
}
```

- [ ] **Step 5: Run the complete phone and product-story browser tests and verify GREEN**

Run:

```bash
npx playwright test tests/e2e/mobile-scrollworld.spec.mjs tests/e2e/portfolio.spec.mjs
```

Expected: 24 tests pass, 0 fail. If native swipe momentum crosses a state boundary, first confirm actual `scrollY` and scene progress; adjust only the test gesture distance, not the approved state thresholds or native-scroll behavior.

- [ ] **Step 6: Commit the mobile stage and touch contracts**

```bash
git add assets/css/portfolio.css tests/e2e/portfolio.spec.mjs tests/e2e/mobile-scrollworld.spec.mjs
git commit -m "feat: add condensed mobile scrollworld"
```

---

### Task 3: Regression And Visual Verification

**Files:**
- Verify: `assets/js/product-story.js`
- Verify: `assets/css/portfolio.css`
- Verify: `tests/product-story.test.mjs`
- Verify: `tests/e2e/mobile-scrollworld.spec.mjs`
- Verify: `tests/e2e/portfolio.spec.mjs`

**Interfaces:**
- Consumes: the complete local branch after Tasks 1 and 2.
- Produces: fresh automated, visual, and working-tree evidence for review; no remote side effects.

- [ ] **Step 1: Run whitespace and scope checks**

```bash
git diff --check origin/main...HEAD
git status --short --branch
git diff --stat origin/main...HEAD
```

Expected: no whitespace errors; only the approved design, plan, controller, CSS, and test files differ from `origin/main`.

- [ ] **Step 2: Run the full regression suite**

```bash
npm test
```

Expected: 11 static tests and 24 Playwright tests pass, 0 fail. Python's development server may log `BrokenPipeError` when Chromium cancels the large intro-video response; this is acceptable only when Playwright reports zero browser console/page errors and all tests pass.

- [ ] **Step 3: Start a review server on an unused port**

```bash
python3 -m http.server 4174 --bind 127.0.0.1
```

Expected: the server remains available at `http://127.0.0.1:4174/` for user review.

- [ ] **Step 4: Capture the thesis and evidence states at both phone widths**

Use Playwright Chromium against port `4174` to capture `/tmp/mobile-scrollworld-390.png` at `390x844` and `/tmp/mobile-scrollworld-320.png` at `320x700`. For each width, scroll PawRelay's `.project-scene__scroll` to `50%` progress before capture.

Expected visual checks:

- The evidence fills the stage without clipping important PawRelay screens.
- No thesis text remains visibly over the evidence state.
- Headings and evidence stay inside the viewport at `320px`.
- The next method block does not overlap the sticky stage.
- Horizontal overflow remains zero.

- [ ] **Step 5: Inspect the final commits and report the publication boundary**

```bash
git log --oneline origin/main..HEAD
git status --short --branch
```

Expected: four local commits exist for the design, implementation plan, controller policy, and mobile stage, with no uncommitted files. Report the local review URL and verification totals. Do not push, merge, open a pull request, or deploy.
