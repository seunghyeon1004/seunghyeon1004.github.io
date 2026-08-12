# Portfolio Product Storytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the cinematic universe intro and rebuild the four selected projects as focused, product-led scroll scenes with large evidence, concise claims, and accessible detail.

**Architecture:** Keep the site static and framework-free. `index.html` owns the three-beat scene structure, `portfolio.css` owns visual states and responsive fallbacks, and a new `product-story.js` module maps each desktop scene's normalized progress to `thesis`, `evidence`, and `method` states. The existing film, language, navigation, archive, and contact controllers remain separate.

**Tech Stack:** HTML5, CSS, ES modules, Node.js built-in test runner, `@playwright/test@1.62.1`, Python static server, existing H.264 and WebP evidence assets.

## Global Constraints

- Preserve the approved 15-second scroll film, all six growth beats, and final `SEUNGHYEON` reveal.
- Keep the design balance at 30 percent cinematic identity and 70 percent restrained product storytelling.
- Borrow one-message pacing, large evidence, typography, and whitespace principles without copying Apple assets, logos, copy, navigation, or proprietary layouts.
- Keep PawRelay, Multi-Mac Operations, Claude Skillsets, and F301 in that order.
- Keep current source-backed claims and label private work as private.
- Do not add video, framework, web font, or large image dependencies.
- Keep new JavaScript under 8 KB before compression.
- Use sticky project scenes at widths of 1024px and above; use normal document flow below 1024px.
- `prefers-reduced-motion: reduce` must show every project layer in normal flow with no sticky transition.
- Preserve readable content when JavaScript or the enhancement controller fails.
- Preserve all standalone dashboards, PawRelay policy pages, and archived project routes.
- Do not push, merge, or publish until the revised local result receives a new explicit publication approval.

## File Map

- Modify `index.html`: add the intro handoff and convert four dense rows into thesis, evidence, and method layers.
- Modify `assets/css/portfolio.css`: add project-story tokens, desktop stages, project-specific motion, mobile flow, no-JavaScript behavior, and reduced-motion behavior.
- Create `assets/js/product-story.js`: calculate scene progress and expose enhancement state without owning the film, navigation, or language.
- Create `tests/product-story.test.mjs`: unit-test progress and state boundaries.
- Modify `tests/static-contract.test.mjs`: lock the semantic scene contract and script entrypoint.
- Modify `tests/e2e/portfolio.spec.mjs`: lock desktop progression, reverse behavior, mobile flow, reduced motion, overflow, and console health.

## Spec Traceability

| Design requirement | Implementation task |
| --- | --- |
| Intro-to-white handoff | Tasks 1 and 3 |
| Three beats for four projects | Tasks 1, 2, and 3 |
| Large authentic evidence | Tasks 1 and 3 |
| Separate product-story controller | Task 2 |
| Desktop sticky scenes | Tasks 2, 3, and 4 |
| Mobile normal flow | Tasks 3 and 4 |
| Reduced motion and failure fallback | Tasks 2, 3, and 4 |
| Performance budget | Tasks 2 and 5 |
| Link and claim revalidation | Task 5 |
| Publication boundary | Task 5 stop condition |

---

### Task 1: Semantic Product Scenes

**Files:**
- Modify: `tests/static-contract.test.mjs`
- Modify: `index.html:130-245`

**Interfaces:**
- Consumes: the existing selected-system copy and visuals inside `.work-row--pawrelay`, `.work-row--operations`, `.work-row--skillsets`, and `.work-row--research`.
- Produces: one `[data-story-handoff]`, four `[data-product-scene]` articles, and exactly three `[data-scene-layer]` regions per article.
- Produces scene keys: `pawrelay`, `operations`, `skillsets`, and `f301`.

- [ ] **Step 1: Write the failing semantic contract**

Append these tests to `tests/static-contract.test.mjs`:

```javascript
test('selected work exposes a handoff and four three-beat product scenes', () => {
  assert.match(html, /data-story-handoff/);

  const scenes = [...html.matchAll(/<article[^>]+data-product-scene[^>]+data-project=["']([^"']+)["']/g)]
    .map(match => match[1]);
  assert.deepEqual(scenes, ['pawrelay', 'operations', 'skillsets', 'f301']);

  for (const project of scenes) {
    const start = html.indexOf(`data-project="${project}"`);
    const end = html.indexOf('</article>', start);
    const scene = html.slice(start, end);
    assert.match(scene, /data-scene-layer="thesis"/);
    assert.match(scene, /data-scene-layer="evidence"/);
    assert.match(scene, /data-scene-layer="method"/);
  }
});

test('homepage loads the isolated product story enhancement', () => {
  assert.match(html, /<script type="module" src="assets\/js\/product-story\.js"><\/script>/);
});
```

- [ ] **Step 2: Run the semantic contract and verify failure**

Run: `node --test tests/static-contract.test.mjs`

Expected: FAIL because `data-story-handoff`, `data-product-scene`, and `product-story.js` are absent.

- [ ] **Step 3: Replace the selected-work heading with the narrative handoff**

Replace the current `.section-heading` at the start of `#selected-work` with:

```html
<header class="story-handoff" data-story-handoff>
  <p class="section-kicker">SELECTED SYSTEMS / 04</p>
  <h2 id="selected-work-title"
      data-ko="연결된 신호가 실제로 만든 것."
      data-en="What the signals became.">연결된 신호가 실제로 만든 것.</h2>
  <p data-ko="하나의 문제, 실제 결과물, 그리고 검증 가능한 과정."
     data-en="One problem, a visible result, and a process that can be verified.">하나의 문제, 실제 결과물, 그리고 검증 가능한 과정.</p>
</header>
```

- [ ] **Step 4: Restructure each project into the exact three-layer shell**

Every article uses the parent-child order `article > .project-scene__scroll > .project-scene__stage > thesis + evidence`, followed by `method` as the article's second child. Initialize every scene with `data-scene-state="thesis"`.

Apply these exact values:

| Scene key | Number | Category | Name | Korean statement | English statement |
| --- | --- | --- | --- | --- | --- |
| `pawrelay` | `01` | `AI PRODUCT / RELEASED` | `PawRelay` | `돌봄이 빠지거나 겹치지 않도록, 함께 사는 하루를 하나의 흐름으로 만들었습니다.` | `One shared day, without missed or duplicated care.` |
| `operations` | `02` | `AUTOMATION / PRIVATE` | `Multi-Mac Operations` | `반복은 자동화했지만, 멈춰야 할 순간까지 시스템에 넣었습니다.` | `Repetition automated, including the moment it must stop.` |
| `skillsets` | `03` | `PUBLIC TOOLING / PREVIEW` | `Claude Skillsets` | `더 많은 도구보다, 지금 실행해도 되는지를 먼저 답하게 했습니다.` | `A tool that answers whether it should run now.` |
| `f301` | `04` | `AUDITABLE RESEARCH / REJECTED` | `F301` | `결과는 아니었습니다. 그래도 증거는 남았습니다.` | `The result was no. The evidence still mattered.` |

The PawRelay thesis must be written exactly as:

```html
<header class="project-scene__thesis" data-scene-layer="thesis">
  <span class="project-scene__number">01</span>
  <p class="project-scene__category">AI PRODUCT / RELEASED</p>
  <h3>PawRelay</h3>
  <p class="project-scene__statement"
     data-ko="돌봄이 빠지거나 겹치지 않도록, 함께 사는 하루를 하나의 흐름으로 만들었습니다."
     data-en="One shared day, without missed or duplicated care.">돌봄이 빠지거나 겹치지 않도록, 함께 사는 하루를 하나의 흐름으로 만들었습니다.</p>
</header>
```

Write the other three thesis headers with the exact values in the table. Their opening tags are:

```html
<article class="project-scene project-scene--operations" data-product-scene data-project="operations" data-scene-state="thesis">
<article class="project-scene project-scene--skillsets" data-product-scene data-project="skillsets" data-scene-state="thesis">
<article class="project-scene project-scene--f301" data-product-scene data-project="f301" data-scene-state="thesis">
```

The PawRelay opening tag is:

```html
<article class="project-scene project-scene--pawrelay" data-product-scene data-project="pawrelay" data-scene-state="thesis">
```

Move the existing evidence nodes without changing their factual content:

- PawRelay: move `.product-frame` from current `index.html:151-154` into the `evidence` layer.
- Operations: move `.pipeline-visual` from current `index.html:171-180` into the `evidence` layer.
- Skillsets: move `.registry-visual` from current `index.html:197-209` into the `evidence` layer.
- F301: move `.audit-visual` from current `index.html:226-243` into the `evidence` layer.

For each `method` layer, move the existing `.work-row__facts`, `.work-row__tags`, and `.text-link` nodes unchanged. Add a method heading before the facts:

```html
<div class="project-scene__method-heading">
  <span data-ko="만든 방식" data-en="How it was built">만든 방식</span>
  <strong>BUILD · OPERATE · VERIFY</strong>
</div>
```

- [ ] **Step 5: Add the product story entrypoint**

Add this after `scroll-film.js` at the end of `index.html`:

```html
<script type="module" src="assets/js/product-story.js"></script>
```

- [ ] **Step 6: Run the semantic contract**

Run: `node --test tests/static-contract.test.mjs`

Expected: all static contract tests PASS.

- [ ] **Step 7: Commit the semantic scene structure**

```bash
git add index.html tests/static-contract.test.mjs
git commit -m "feat: structure portfolio product scenes"
```

### Task 2: Deterministic Product Story Controller

**Files:**
- Create: `tests/product-story.test.mjs`
- Create: `assets/js/product-story.js`

**Interfaces:**
- Produces: `clamp(value: number): number`.
- Produces: `getSceneProgress(rect: {top: number, height: number}, viewportHeight: number): number`.
- Produces: `getSceneState(progress: number): 'thesis' | 'evidence' | 'method'`.
- Produces: `initProductStory(root = document, view = window): { render(): void, destroy(): void } | null`.
- Updates: each scene's `--scene-progress` property and `data-scene-state` attribute.
- Updates: `documentElement.dataset.productStoryReady` only after finding all four scenes.

- [ ] **Step 1: Write failing pure-function tests**

Create `tests/product-story.test.mjs`:

```javascript
import assert from 'node:assert/strict';
import test from 'node:test';
import { clamp, getSceneProgress, getSceneState } from '../assets/js/product-story.js';

test('scene progress maps the sticky travel distance to zero through one', () => {
  assert.equal(clamp(-0.2), 0);
  assert.equal(clamp(1.2), 1);
  assert.equal(getSceneProgress({ top: 100, height: 3000 }, 1000), 0);
  assert.equal(getSceneProgress({ top: -1000, height: 3000 }, 1000), 0.5);
  assert.equal(getSceneProgress({ top: -2500, height: 3000 }, 1000), 1);
});

test('scene state has deterministic forward and reverse boundaries', () => {
  assert.equal(getSceneState(0), 'thesis');
  assert.equal(getSceneState(0.2199), 'thesis');
  assert.equal(getSceneState(0.22), 'evidence');
  assert.equal(getSceneState(0.7199), 'evidence');
  assert.equal(getSceneState(0.72), 'method');
  assert.equal(getSceneState(1), 'method');
  assert.equal(getSceneState(0.4), 'evidence');
});
```

- [ ] **Step 2: Run the unit test and verify failure**

Run: `node --test tests/product-story.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `assets/js/product-story.js`.

- [ ] **Step 3: Implement pure calculations and the enhancement controller**

Create `assets/js/product-story.js` with this implementation:

```javascript
export const clamp = value => Math.max(0, Math.min(1, value));

export function getSceneProgress(rect, viewportHeight) {
  const travel = Math.max(1, rect.height - viewportHeight);
  return clamp(-rect.top / travel);
}

export function getSceneState(progress) {
  if (progress < 0.22) return 'thesis';
  if (progress < 0.72) return 'evidence';
  return 'method';
}

export function initProductStory(root = globalThis.document, view = globalThis.window) {
  if (!root || !view) return null;
  const scenes = [...root.querySelectorAll('[data-product-scene]')];
  if (scenes.length !== 4) return null;

  const motionQuery = view.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopQuery = view.matchMedia('(min-width: 1024px)');
  let frameRequested = false;
  let destroyed = false;

  const setReadableState = scene => {
    scene.style.setProperty('--scene-progress', '1');
    scene.dataset.sceneState = 'method';
  };

  const render = () => {
    frameRequested = false;
    if (destroyed) return;

    if (motionQuery.matches || !desktopQuery.matches) {
      scenes.forEach(setReadableState);
      return;
    }

    scenes.forEach(scene => {
      const progress = getSceneProgress(scene.getBoundingClientRect(), view.innerHeight);
      scene.style.setProperty('--scene-progress', progress.toFixed(5));
      scene.dataset.sceneState = getSceneState(progress);
    });
  };

  const requestRender = () => {
    if (frameRequested || destroyed) return;
    frameRequested = true;
    view.requestAnimationFrame(render);
  };

  const destroy = () => {
    destroyed = true;
    view.removeEventListener('scroll', requestRender);
    view.removeEventListener('resize', requestRender);
    motionQuery.removeEventListener?.('change', requestRender);
    desktopQuery.removeEventListener?.('change', requestRender);
  };

  root.documentElement.dataset.productStoryReady = 'true';
  view.addEventListener('scroll', requestRender, { passive: true });
  view.addEventListener('resize', requestRender, { passive: true });
  view.addEventListener('pagehide', destroy, { once: true });
  motionQuery.addEventListener?.('change', requestRender);
  desktopQuery.addEventListener?.('change', requestRender);
  render();

  return { render: requestRender, destroy };
}

if (typeof document !== 'undefined') initProductStory();
```

- [ ] **Step 4: Run all static tests and check the size budget**

Run:

```bash
npm run test:static
node --check assets/js/product-story.js
test "$(wc -c < assets/js/product-story.js | tr -d ' ')" -lt 8192
```

Expected: all static tests PASS, syntax check exits 0, and the byte-size check exits 0.

- [ ] **Step 5: Commit the controller**

```bash
git add assets/js/product-story.js tests/product-story.test.mjs
git commit -m "feat: add reversible product story controller"
```

### Task 3: Product-Led Visual System

**Files:**
- Modify: `assets/css/portfolio.css:1-17`
- Modify: `assets/css/portfolio.css:684-1137`
- Modify: `assets/css/portfolio.css:1372-1896`

**Interfaces:**
- Consumes: `data-product-story-ready`, `data-scene-state`, `--scene-progress`, and the three semantic layers from Tasks 1 and 2.
- Produces: a white intro handoff, desktop sticky stages, one dominant evidence object per scene, and method strips in normal flow.
- Preserves: existing visual classes `.product-frame`, `.pipeline-visual`, `.registry-visual`, and `.audit-visual` as the evidence artifacts.

- [ ] **Step 1: Add the approved project-story tokens**

Add these variables to `:root` without replacing the intro signal colors:

```css
--stage-white: #ffffff;
--stage-paper: #f7f7f5;
--stage-ink: #111111;
--stage-muted: #6e6e73;
--stage-line: #d2d2d7;
--pawrelay-green: #167a45;
--operations-amber: #d76b34;
--skillsets-blue: #2f6fed;
--research-red: #c83f49;
```

- [ ] **Step 2: Replace dense work-row layout rules with stage rules**

Remove selectors whose only owner is `.work-row`, `.work-row__number`, `.work-row__content`, `.work-row__lead`, `.work-row__facts`, `.work-row__tags`, and `.work-row__media`. Keep and retarget the shared artifact selectors.

Add this stage foundation:

```css
.section--work {
  padding: 0;
  background: var(--stage-white);
  color: var(--stage-ink);
}

.story-handoff {
  display: grid;
  place-content: center;
  min-height: 82svh;
  padding: 120px max(28px, calc((100vw - var(--content-width)) / 2));
  text-align: center;
}

.story-handoff h2 {
  max-width: 980px;
  margin: 24px auto 0;
  font-size: 96px;
  line-height: 1.02;
  text-wrap: balance;
}

.story-handoff > p:last-child {
  max-width: 620px;
  margin: 28px auto 0;
  color: var(--stage-muted);
  font-size: 19px;
}

.project-scene {
  --project-accent: var(--stage-ink);
  --scene-progress: 0;
  position: relative;
  border-top: 1px solid var(--stage-line);
  background: var(--stage-white);
}

.project-scene--pawrelay { --project-accent: var(--pawrelay-green); }
.project-scene--operations { --project-accent: var(--operations-amber); }
.project-scene--skillsets { --project-accent: var(--skillsets-blue); }
.project-scene--f301 { --project-accent: var(--research-red); }

.project-scene__scroll {
  position: relative;
  height: auto;
}

.project-scene__stage {
  position: relative;
  display: block;
  min-height: 0;
  padding: 100px max(28px, calc((100vw - var(--content-width)) / 2)) 64px;
  isolation: isolate;
}

.project-scene__thesis,
.project-scene__evidence {
  position: relative;
  width: min(var(--content-width), calc(100vw - 56px));
  margin-right: auto;
  margin-left: auto;
  opacity: 1;
  transform: none;
}

.project-scene__thesis {
  z-index: 2;
  max-width: 1080px;
  text-align: center;
}

.project-scene__number,
.project-scene__category {
  color: var(--project-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  font-weight: 750;
}

.project-scene__thesis h3 {
  margin: 20px 0 0;
  font-size: 112px;
  line-height: .92;
  text-wrap: balance;
}

.project-scene__statement {
  max-width: 820px;
  margin: 30px auto 0;
  color: var(--stage-muted);
  font-size: 36px;
  font-weight: 620;
  line-height: 1.28;
  text-wrap: balance;
}

.project-scene__evidence {
  z-index: 1;
  margin-top: 56px;
}

@media (min-width: 1024px) {
  html[data-product-story-ready="true"] .project-scene__scroll {
    height: 240vh;
  }

  html[data-product-story-ready="true"] .project-scene__stage {
    position: sticky;
    top: 72px;
    display: grid;
    place-items: center;
    height: calc(100svh - 72px);
    min-height: 620px;
    overflow: hidden;
    padding: 48px max(28px, calc((100vw - var(--content-width)) / 2));
  }

  html[data-product-story-ready="true"] .project-scene__thesis,
  html[data-product-story-ready="true"] .project-scene__evidence {
    position: absolute;
    margin: 0;
    transition: opacity 360ms ease, transform 620ms cubic-bezier(.2,.72,.2,1);
  }

  html[data-product-story-ready="true"] .project-scene__evidence {
    opacity: 0;
    transform: translateY(10vh) scale(.78);
  }

  html[data-product-story-ready="true"] .project-scene[data-scene-state="thesis"] .project-scene__thesis {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  html[data-product-story-ready="true"] .project-scene[data-scene-state="thesis"] .project-scene__evidence {
    opacity: 0;
    transform: translateY(10vh) scale(.78);
  }

  html[data-product-story-ready="true"] .project-scene[data-scene-state="evidence"] .project-scene__thesis,
  html[data-product-story-ready="true"] .project-scene[data-scene-state="method"] .project-scene__thesis {
    opacity: 0;
    transform: translateY(-8vh) scale(.94);
  }

  html[data-product-story-ready="true"] .project-scene[data-scene-state="evidence"] .project-scene__evidence,
  html[data-product-story-ready="true"] .project-scene[data-scene-state="method"] .project-scene__evidence {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

- [ ] **Step 3: Add evidence and method composition**

```css
.project-scene__evidence > .product-frame,
.project-scene__evidence > .pipeline-visual,
.project-scene__evidence > .registry-visual,
.project-scene__evidence > .audit-visual {
  width: 100%;
  margin: 0;
  border-radius: 4px;
  box-shadow: 0 28px 80px rgba(0, 0, 0, .13);
}

.project-scene--pawrelay .project-scene__evidence {
  width: min(1480px, calc(100vw - 32px));
}

.project-scene--pawrelay .product-frame img {
  aspect-ratio: 16 / 8.4;
  object-fit: cover;
  transform: translateX(calc((var(--scene-progress) - .5) * -3%));
}

.project-scene--operations .pipeline-visual li,
.project-scene--skillsets .registry-visual li,
.project-scene--f301 .audit-visual__metrics div {
  opacity: .28;
  transition: opacity 240ms ease, transform 240ms ease;
}

.project-scene--operations .pipeline-visual li:nth-child(2),
.project-scene--skillsets .registry-visual li:nth-child(2),
.project-scene--f301 .audit-visual__metrics div:nth-child(2) { transition-delay: 60ms; }

.project-scene--operations .pipeline-visual li:nth-child(3),
.project-scene--skillsets .registry-visual li:nth-child(3),
.project-scene--f301 .audit-visual__metrics div:nth-child(3) { transition-delay: 120ms; }

.project-scene--operations .pipeline-visual li:nth-child(4),
.project-scene--skillsets .registry-visual li:nth-child(4),
.project-scene--f301 .audit-visual__metrics div:nth-child(4) { transition-delay: 180ms; }

.project-scene--operations .pipeline-visual li:nth-child(5),
.project-scene--f301 .audit-visual__metrics div:nth-child(5) { transition-delay: 240ms; }

.project-scene[data-scene-state="evidence"] .pipeline-visual li,
.project-scene[data-scene-state="evidence"] .registry-visual li,
.project-scene[data-scene-state="evidence"] .audit-visual__metrics div,
.project-scene[data-scene-state="method"] .pipeline-visual li,
.project-scene[data-scene-state="method"] .registry-visual li,
.project-scene[data-scene-state="method"] .audit-visual__metrics div {
  opacity: 1;
}

.project-scene--f301 .audit-visual__verdict strong,
.project-scene--f301 .audit-visual__metrics div:nth-child(2) dd,
.project-scene--f301 .audit-visual__metrics div:nth-child(3) dd {
  color: var(--research-red);
}

.project-scene__method {
  display: grid;
  grid-template-columns: minmax(190px, .3fr) minmax(0, 1fr) auto;
  gap: 48px;
  align-items: start;
  padding: 76px max(28px, calc((100vw - var(--content-width)) / 2)) 120px;
  border-top: 1px solid var(--stage-line);
  background: var(--stage-paper);
}

.project-scene__method-heading span,
.project-scene__method-heading strong {
  display: block;
}

.project-scene__method-heading span {
  font-size: 18px;
  font-weight: 720;
}

.project-scene__method-heading strong {
  margin-top: 10px;
  color: var(--project-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
}

.project-scene__method .work-row__facts {
  margin: 0;
  border-top: 1px solid var(--stage-line);
}

.project-scene__method .work-row__facts div {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid var(--stage-line);
}

.project-scene__method .work-row__facts dt,
.project-scene__method .work-row__facts dd {
  margin: 0;
  font-size: 13px;
}

.project-scene__method .work-row__facts dt {
  color: var(--stage-muted);
}

.project-scene__method .work-row__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 20px;
}
```

- [ ] **Step 4: Run static tests and inspect the desktop composition**

Run:

```bash
npm run test:static
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/` at 1440x1000. Expected: the intro ends on the unchanged wordmark, the white handoff follows, and each desktop project shows a thesis before its evidence and method strip.

- [ ] **Step 5: Commit the desktop visual system**

```bash
git add assets/css/portfolio.css
git commit -m "feat: style product-led portfolio scenes"
```

### Task 4: Responsive, Reverse, And Reduced-Motion Contracts

**Files:**
- Modify: `tests/e2e/portfolio.spec.mjs`
- Modify: `assets/css/portfolio.css`

**Interfaces:**
- Consumes: the scene contract and controller from Tasks 1 through 3.
- Produces: deterministic forward and reverse desktop states, normal flow below 1024px, complete reduced-motion content, 44px targets, and zero overflow.

- [ ] **Step 1: Add failing desktop scene progression tests**

Append to `tests/e2e/portfolio.spec.mjs`:

```javascript
async function setSceneProgress(page, project, progress) {
  await page.evaluate(({ project, progress }) => {
    const scene = document.querySelector(`[data-project="${project}"]`);
    const travel = scene.offsetHeight - innerHeight;
    scrollTo(0, scene.offsetTop + travel * progress);
  }, { project, progress });
  await settleFrame(page);
}

test('desktop product scenes advance and reverse deterministically', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  for (const project of ['pawrelay', 'operations', 'skillsets', 'f301']) {
    await setSceneProgress(page, project, 0.1);
    await expect(page.locator(`[data-project="${project}"]`)).toHaveAttribute('data-scene-state', 'thesis');
    await setSceneProgress(page, project, 0.5);
    await expect(page.locator(`[data-project="${project}"]`)).toHaveAttribute('data-scene-state', 'evidence');
    await setSceneProgress(page, project, 0.82);
    await expect(page.locator(`[data-project="${project}"]`)).toHaveAttribute('data-scene-state', 'method');
    await setSceneProgress(page, project, 0.12);
    await expect(page.locator(`[data-project="${project}"]`)).toHaveAttribute('data-scene-state', 'thesis');
  }
});
```

- [ ] **Step 2: Add failing mobile and reduced-motion layout tests**

```javascript
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
  await expect(page.locator('[data-project="pawrelay"] [data-scene-layer="evidence"]')).toBeVisible();
  await expect(page.locator('[data-project="f301"] [data-scene-layer="method"]')).toBeVisible();
});
```

- [ ] **Step 3: Run the new browser contracts and verify failure**

Run: `npx playwright test -g "product scenes|mobile product|reduced motion removes"`

Expected: at least the mobile and reduced-motion tests FAIL while desktop-only CSS is still active.

- [ ] **Step 4: Add the exact mobile and reduced-motion fallback**

Add these rules after the desktop scene rules:

```css
@media (max-width: 1023px) {
  .story-handoff {
    min-height: 70svh;
    padding: 104px 24px 72px;
  }

  .story-handoff h2 {
    font-size: 52px;
  }

  .project-scene__scroll {
    height: auto;
  }

  .project-scene__stage {
    position: relative;
    top: auto;
    display: block;
    height: auto;
    min-height: 0;
    overflow: visible;
    padding: 92px 24px 56px;
  }

  .project-scene__thesis,
  .project-scene__evidence {
    position: relative;
    width: 100%;
    max-width: none;
    opacity: 1;
    transform: none;
  }

  .project-scene__thesis {
    text-align: left;
  }

  .project-scene__thesis h3 {
    font-size: 56px;
  }

  .project-scene__statement {
    max-width: 680px;
    margin: 22px 0 0;
    font-size: 27px;
  }

  .project-scene__evidence {
    margin-top: 52px;
  }

  .project-scene--pawrelay .project-scene__evidence {
    width: 100%;
  }

  .project-scene--pawrelay .product-frame img {
    transform: none;
  }

  .project-scene__method {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 48px 24px 84px;
  }
}

@media (max-width: 640px) {
  .story-handoff {
    padding-right: 18px;
    padding-left: 18px;
  }

  .story-handoff h2 {
    font-size: 40px;
  }

  .story-handoff > p:last-child {
    font-size: 16px;
  }

  .project-scene__stage {
    padding: 80px 18px 42px;
  }

  .project-scene__thesis h3 {
    font-size: 44px;
  }

  .project-scene__statement {
    font-size: 23px;
  }

  .project-scene__method {
    padding: 40px 18px 72px;
  }

  .project-scene__method .work-row__facts div {
    grid-template-columns: 76px minmax(0, 1fr);
    gap: 12px;
  }

  .pipeline-visual,
  .registry-visual,
  .audit-visual {
    min-height: 410px;
    aspect-ratio: auto;
    padding: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-scene__scroll {
    height: auto;
  }

  .project-scene__stage {
    position: relative;
    top: auto;
    display: block;
    height: auto;
    min-height: 0;
    overflow: visible;
    padding-top: 100px;
    padding-bottom: 64px;
  }

  .project-scene__thesis,
  .project-scene__evidence {
    position: relative;
    width: 100%;
    max-width: var(--content-width);
    margin-right: auto;
    margin-left: auto;
    opacity: 1;
    transform: none;
    transition: none;
  }

  .project-scene__evidence {
    margin-top: 56px;
  }

  .project-scene--pawrelay .product-frame img {
    transform: none;
  }
}
```

- [ ] **Step 5: Run the complete browser suite**

Run: `npm run test:e2e`

Expected: all Playwright tests PASS at 1440x1000, 1024x768, 390x844, and 320x700 with zero captured console errors and zero horizontal overflow.

- [ ] **Step 6: Commit responsive and accessibility behavior**

```bash
git add assets/css/portfolio.css tests/e2e/portfolio.spec.mjs
git commit -m "test: cover responsive product storytelling"
```

### Task 5: Visual QA, Evidence Refresh, And Publication Stop

**Files:**
- Modify only if a verified defect is found: `index.html`, `assets/css/portfolio.css`, `assets/js/product-story.js`, and related tests.
- Generate but do not commit: `artifacts/product-story-*.png`.

**Interfaces:**
- Consumes: all implementation tasks and the existing evidence ledger.
- Produces: a clean local branch, final desktop/mobile screenshots, fresh tests, fresh claim checks, and a local preview for user review.
- Stop condition: no remote push, PR, merge, or GitHub Pages publication.

- [ ] **Step 1: Run syntax, static, media, and browser verification**

Run:

```bash
git diff --check
node --check assets/js/portfolio.js
node --check assets/js/scroll-film.js
node --check assets/js/product-story.js
bash tests/media-contract.sh
npm test
```

Expected: every command exits 0; static tests include the new semantic and controller contracts; Playwright covers the four viewports and reduced motion.

- [ ] **Step 2: Verify progressive enhancement without the controller**

In Playwright, block `**/assets/js/product-story.js`, reload at 1440x1000, and assert all twelve scene layers are visible:

```javascript
await page.route('**/assets/js/product-story.js', route => route.abort());
await page.goto('/');
await expect(page.locator('[data-product-scene]')).toHaveCount(4);
await expect(page.locator('[data-scene-layer]')).toHaveCount(12);
for (const layer of await page.locator('[data-scene-layer]').all()) {
  await expect(layer).toBeVisible();
}
```

Expected: the controller request is aborted, all twelve layers remain visible in normal document flow, and the page has no horizontal overflow.

- [ ] **Step 3: Capture and inspect the required screenshots**

Use Playwright against the local server and save:

```text
artifacts/product-story-handoff-desktop.png
artifacts/product-story-pawrelay-desktop.png
artifacts/product-story-operations-desktop.png
artifacts/product-story-skillsets-desktop.png
artifacts/product-story-f301-desktop.png
artifacts/product-story-mobile-390.png
artifacts/product-story-mobile-320.png
artifacts/product-story-reduced-motion.png
```

Inspect every image for: one dominant message, complete evidence, no text collision, no image clipping that hides meaning, stable navigation contrast, and a visible hint of the next section.

- [ ] **Step 4: Recheck live destinations and time-sensitive claims**

Run:

```bash
curl -fsSI https://github.com/seunghyeon1004/claude-code-skillsets
curl -fsSI https://play.google.com/store/apps/details?id=com.pawrelay.app
curl -fsSI https://x.com/baegseungh7061
```

Then confirm the current Claude Skillsets README still reports `20/20` review-held and `0/20` executable. Recompute F301 from its independent audit source and confirm 190 trades, base `-24.24%`, UPRO hold `+26.40%`, and zero material mismatches. If a source changed, update the copy and its static assertion before continuing.

- [ ] **Step 5: Fix only verified visual or contract defects and rerun the full suite**

For each defect, add or tighten a Playwright assertion first, reproduce the failure, make the narrow CSS/HTML/JS change, and rerun `npm test`. Do not refactor the film controller, navigation module, standalone pages, or media assets during this step.

- [ ] **Step 6: Commit final verified polish**

```bash
git add index.html assets/css/portfolio.css assets/js/product-story.js tests
git diff --cached --check
git commit -m "fix: polish product-led portfolio experience"
```

If Step 5 required no tracked changes, skip this empty commit.

- [ ] **Step 7: Present the local result and stop at the publication gate**

Report the local preview URL, exact passing test counts, changed files, screenshot paths, current branch and commit, and any claim that could not be freshly verified. Request a new explicit approval before push, PR creation, merge, or GitHub Pages deployment.
