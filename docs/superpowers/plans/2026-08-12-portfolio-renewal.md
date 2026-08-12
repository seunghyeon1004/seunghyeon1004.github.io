# Seunghyeon Portfolio Renewal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the outdated GitHub Pages homepage with a responsive, bilingual, scroll-controlled portfolio that presents Seunghyeon as an AI product and automation systems builder using authentic evidence.

**Architecture:** Keep the site static and framework-free. `index.html` owns semantic content, one CSS file owns the responsive visual system, one interaction module owns language/navigation, and one scroll-film module maps normalized scroll progress to a 15-second H.264 video while preserving a poster/reduced-motion fallback.

**Tech Stack:** HTML5, CSS, ES modules, H.264/WebP media, pinned `lucide@1.27.0` UMD icons, Node.js built-in test runner, `@playwright/test@1.62.1`, Python static server, FFmpeg, WebP tools.

## Global Constraints

- The runtime remains static GitHub Pages with no build requirement.
- Generated film objects are conceptual imagery and never count as portfolio evidence.
- Feature PawRelay, Multi-Mac Operations, Claude Skillsets, and F301 as the four selected systems.
- Revalidate current claims before publication; label unavailable links as private systems.
- Preserve all existing standalone dashboards, policy pages, and Fox After School Lab files.
- Keep the 720p H.264 intro between 6 MB and 11 MB, without audio or extra streams.
- Support Korean and English without losing scroll state.
- `prefers-reduced-motion: reduce` must produce a complete, non-scrubbed reading experience.
- No horizontal overflow at 320px and wider.
- Do not push, merge, or publish without separate explicit approval.

## Spec Traceability

| Design requirement | Implementation task |
| --- | --- |
| Scroll Film Intro | Tasks 1, 3, 4, and 5 |
| Selected Systems | Tasks 1, 2, 4, and 6 |
| Capabilities | Tasks 2 and 4 |
| Earlier Experiments | Tasks 2 and 4 |
| Collaboration And Contact | Tasks 2, 4, and 6 |
| Responsive Visual System | Tasks 4 and 5 |
| Reduced Motion | Tasks 3, 4, and 5 |
| Performance | Tasks 1, 3, 5, and 6 |
| Error Handling | Tasks 3, 4, and 5 |
| Verification | Tasks 1 through 6 |
| Publication Boundary | Task 6 stop condition |

---

### Task 1: Evidence Ledger And Production Media

**Files:**
- Create: `docs/portfolio-evidence.md`
- Create: `tests/media-contract.sh`
- Create: `assets/media/portfolio-universe-720p.mp4`
- Create: `assets/media/portfolio-universe-poster.webp`
- Create: `assets/images/pawrelay-product.webp`
- Create: `assets/images/f301-evidence.webp`

**Interfaces:**
- Consumes: `/Users/m4pro-2/Downloads/grok-de1eae95-67d0-4012-bffe-bba96f3a4d22-720p.mp4`, `/Users/m4pro-2/pet-routine-app`, `/Users/m4pro-2/claude-code-skillsets-public-v12-release`, and `/Users/m4pro-2/stock-ai-bot/data/reports/strategy_research_reset/us_source_breadth_upro_spxu_v2/independent_audit.json`.
- Produces: optimized media at the exact paths above and a source-backed claim ledger used by `index.html`.

- [ ] **Step 1: Write the failing media contract**

```bash
#!/usr/bin/env bash
set -euo pipefail

video="assets/media/portfolio-universe-720p.mp4"
poster="assets/media/portfolio-universe-poster.webp"
pawrelay="assets/images/pawrelay-product.webp"
research="assets/images/f301-evidence.webp"

test -s "$video"
test -s "$poster"
test -s "$pawrelay"
test -s "$research"

width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$video")
height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$video")
duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video")
audio_count=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$video" | wc -l | tr -d ' ')
size=$(stat -f %z "$video")

test "$width" = "1280"
test "$height" = "720"
awk -v value="$duration" 'BEGIN { exit !(value >= 15 && value < 15.2) }'
test "$audio_count" = "0"
test "$size" -ge 6000000
test "$size" -le 11000000
```

- [ ] **Step 2: Run the contract and verify it fails because production assets do not exist**

Run: `bash tests/media-contract.sh`

Expected: non-zero exit at `test -s assets/media/portfolio-universe-720p.mp4`.

- [ ] **Step 3: Create optimized production assets**

```bash
mkdir -p assets/media assets/images
ffmpeg -i /Users/m4pro-2/Downloads/grok-de1eae95-67d0-4012-bffe-bba96f3a4d22-720p.mp4 \
  -map 0:v:0 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 12 -keyint_min 12 -sc_threshold 0 -movflags +faststart -an \
  assets/media/portfolio-universe-720p.mp4
ffmpeg -ss 0.2 -i assets/media/portfolio-universe-720p.mp4 -frames:v 1 -vf scale=1280:720 /tmp/portfolio-poster.png
cwebp -quiet -q 82 /tmp/portfolio-poster.png -o assets/media/portfolio-universe-poster.webp
cwebp -quiet -q 86 /Users/m4pro-2/seunghyeon1004.github.io/.superpowers/brainstorm/64054-1786502277/content/pawrelay-mobile.png -o assets/images/pawrelay-product.webp
cwebp -quiet -q 88 /Users/m4pro-2/seunghyeon1004.github.io/.superpowers/brainstorm/64054-1786502277/content/research-ledger.png -o assets/images/f301-evidence.webp
```

- [ ] **Step 4: Write the evidence ledger with explicit source boundaries**

```markdown
# Portfolio Evidence Ledger

## PawRelay
- Source: `/Users/m4pro-2/pet-routine-app`
- Public claim: household pet-care coordination product for medication, feeding, walking, litter, handoff, and symptom-history continuity.
- Publication claim: revalidate immediately before publication.

## Multi-Mac Operations
- Source: private local operating repositories and receipts.
- Public claim: guarded multi-device workflows with review, receipt, verification, and fail-closed unknown states.
- Redaction: no hostnames, account identifiers, credentials, or private volumes.

## Claude Skillsets
- Source: `/Users/m4pro-2/claude-code-skillsets-public-v12-release`.
- Public claim: verifier-oriented public tooling; exact status revalidated before publication.

## F301
- Source: `/Users/m4pro-2/stock-ai-bot/data/reports/strategy_research_reset/us_source_breadth_upro_spxu_v2/independent_audit.json`.
- Public claim: 190 trades, base -24.2443%, benchmark +26.3952%, material mismatch count 0, terminally rejected.
- Boundary: evidence of disciplined negative-result research, not profitable strategy discovery.
```

- [ ] **Step 5: Run the media contract**

Run: `bash tests/media-contract.sh`

Expected: exit 0 with no output.

- [ ] **Step 6: Commit**

```bash
git add assets docs/portfolio-evidence.md tests/media-contract.sh
git commit -m "feat: add portfolio evidence media"
```

### Task 2: Static Test Harness And Semantic Shell

**Files:**
- Modify: `.gitignore`
- Create: `package.json`
- Create: `playwright.config.mjs`
- Create: `tests/static-contract.test.mjs`
- Replace: `index.html`
- Create: `assets/css/portfolio.css`
- Create: `assets/js/portfolio.js`
- Create: `assets/js/scroll-film.js`

**Interfaces:**
- Consumes: media paths from Task 1.
- Produces: stable DOM IDs `site-nav`, `scroll-story`, `scroll-stage`, `scroll-film`, `growth-beats`, `selected-work`, `capabilities`, `archive`, and `contact`; ES modules importable by Node tests.

- [ ] **Step 1: Add reproducible test tooling**

```json
{
  "name": "seunghyeon-portfolio",
  "private": true,
  "type": "module",
  "scripts": {
    "test:static": "node --test tests/*.test.mjs",
    "test:e2e": "playwright test",
    "test": "npm run test:static && npm run test:e2e"
  },
  "devDependencies": {
    "@playwright/test": "1.62.1"
  }
}
```

```javascript
// playwright.config.mjs
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 20_000,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    port: 4173,
    reuseExistingServer: true
  }
});
```

Add `node_modules/`, `test-results/`, and `playwright-report/` to `.gitignore` without changing existing ignore rules.

- [ ] **Step 2: Write the failing semantic contract**

```javascript
// tests/static-contract.test.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('homepage exposes the approved sections and media', () => {
  for (const id of ['scroll-story', 'scroll-film', 'selected-work', 'capabilities', 'archive', 'contact']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /assets\/media\/portfolio-universe-720p\.mp4/);
  assert.match(html, /SEUNGHYEON/);
});

test('homepage keeps four selected systems and two languages', () => {
  for (const name of ['PawRelay', 'Multi-Mac Operations', 'Claude Skillsets', 'F301']) {
    assert.match(html, new RegExp(name));
  }
  assert.match(html, /data-ko=/);
  assert.match(html, /data-en=/);
});
```

- [ ] **Step 3: Run the static test and verify it fails against the old homepage**

Run: `npm install && npm run test:static`

Expected: FAIL because `scroll-story` and the approved project names are absent.

- [ ] **Step 4: Replace the homepage with the semantic no-JavaScript shell**

The document must contain this top-level order and exact IDs:

```html
<body>
  <a class="skip-link" href="#selected-work">Skip to selected work</a>
  <header id="site-nav" class="site-nav">
    <a class="site-nav__brand" href="#scroll-story">SEUNGHYEON</a>
    <nav aria-label="Primary navigation">
      <a href="#selected-work" data-ko="선택한 작업" data-en="Selected work">Selected work</a>
      <a href="#capabilities" data-ko="역량" data-en="Capabilities">Capabilities</a>
      <a href="#contact" data-ko="협업" data-en="Collaborate">Collaborate</a>
    </nav>
    <button type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu">Menu</button>
  </header>
  <main>
    <section id="scroll-story" class="scroll-story" aria-labelledby="intro-title">
      <div id="scroll-stage" class="scroll-stage">
        <video id="scroll-film" muted playsinline preload="metadata" poster="assets/media/portfolio-universe-poster.webp">
          <source src="assets/media/portfolio-universe-720p.mp4" type="video/mp4">
        </video>
        <h1 id="intro-title" class="visually-hidden">Seunghyeon portfolio</h1>
        <div id="growth-beats">
          <article data-beat="0"><b>Explore</b><span data-ko="질문에서 시작했습니다." data-en="It started with questions.">It started with questions.</span></article>
          <article data-beat="1"><b>Build</b><span data-ko="아이디어를 제품으로." data-en="Ideas into products.">Ideas into products.</span></article>
          <article data-beat="2"><b>Operate</b><span data-ko="한 번을 시스템으로." data-en="One run into a system.">One run into a system.</span></article>
          <article data-beat="3"><b>Systemize</b><span data-ko="노하우를 도구로." data-en="Practice into tooling.">Practice into tooling.</span></article>
          <article data-beat="4"><b>Verify</b><span data-ko="실패도 증거로 남겼습니다." data-en="Failures remain as evidence.">Failures remain as evidence.</span></article>
          <article data-beat="5"><b>Connect</b><span data-ko="이제 더 큰 문제를 함께." data-en="Now, larger problems together.">Now, larger problems together.</span></article>
        </div>
        <div id="final-wordmark" aria-label="SEUNGHYEON">
          <span class="wordmark-name">SEUNGHYEON</span>
          <span class="wordmark-signal" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        </div>
      </div>
    </section>
    <section id="selected-work" aria-labelledby="selected-work-title">
      <h2 id="selected-work-title">Selected systems</h2>
      <article><h3>PawRelay</h3><p>Household care coordination product.</p></article>
      <article><h3>Multi-Mac Operations</h3><p>Guarded automation with receipts.</p></article>
      <article><h3>Claude Skillsets</h3><p>Verifier-oriented public tooling.</p></article>
      <article><h3>F301</h3><p>Auditable negative-result research.</p></article>
    </section>
    <section id="capabilities" aria-labelledby="capabilities-title"><h2 id="capabilities-title">Build. Operate. Verify.</h2></section>
    <section id="archive" aria-labelledby="archive-title"><h2 id="archive-title">Earlier experiments</h2></section>
    <section id="contact" aria-labelledby="contact-title"><h2 id="contact-title">Build the next system together.</h2></section>
  </main>
  <noscript><style>.film-layer{display:none}.final-wordmark{opacity:1}</style></noscript>
  <script src="https://unpkg.com/lucide@1.27.0/dist/umd/lucide.js" defer></script>
  <script type="module" src="assets/js/portfolio.js"></script>
  <script type="module" src="assets/js/scroll-film.js"></script>
</body>
```

Use authentic asset paths, verified GitHub/X URLs, `data-ko`/`data-en` copy, and the four selected-system rows defined in the design spec. Existing standalone page URLs remain unchanged.

- [ ] **Step 5: Create importable module placeholders and run the static test**

```javascript
// assets/js/portfolio.js
export function initPortfolio() {}
if (typeof document !== 'undefined') initPortfolio();
```

```javascript
// assets/js/scroll-film.js
export const clamp = value => Math.max(0, Math.min(1, value));
```

Run: `npm run test:static`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add .gitignore package.json package-lock.json playwright.config.mjs tests index.html assets/css assets/js
git commit -m "feat: add portfolio semantic shell"
```

### Task 3: Scroll Film Controller

**Files:**
- Modify: `assets/js/scroll-film.js`
- Create: `tests/scroll-film.test.mjs`

**Interfaces:**
- Produces: `clamp(value)`, `progressToTime(progress, duration, endPadding)`, `getBeatIndex(progress, thresholds, finaleStart)`, and `initScrollFilm(root = document)`.
- Updates: `data-film-state`, `--story-progress`, active beat classes, video `currentTime`, wordmark CSS variables, and replay behavior.

- [ ] **Step 1: Write failing timeline unit tests**

```javascript
import assert from 'node:assert/strict';
import test from 'node:test';
import { clamp, getBeatIndex, progressToTime } from '../assets/js/scroll-film.js';

test('progress maps reversibly to the safe video range', () => {
  assert.equal(clamp(-1), 0);
  assert.equal(clamp(2), 1);
  assert.equal(progressToTime(0.5, 15.041667, 0.045), 7.4983335);
  assert.equal(progressToTime(1, 15.041667, 0.045), 14.996667);
});

test('beat index follows six thresholds and clears for the finale', () => {
  const thresholds = [0.075, 0.205, 0.335, 0.465, 0.595, 0.725];
  assert.equal(getBeatIndex(0.06, thresholds, 0.86), -1);
  assert.equal(getBeatIndex(0.34, thresholds, 0.86), 2);
  assert.equal(getBeatIndex(0.75, thresholds, 0.86), 5);
  assert.equal(getBeatIndex(0.9, thresholds, 0.86), -1);
});
```

- [ ] **Step 2: Run the unit tests and verify failure**

Run: `npm run test:static`

Expected: FAIL because `getBeatIndex` and `progressToTime` are not exported.

- [ ] **Step 3: Implement pure timeline functions**

```javascript
export const clamp = value => Math.max(0, Math.min(1, value));

export function progressToTime(progress, duration, endPadding = 0.045) {
  return clamp(progress) * Math.max(0, duration - endPadding);
}

export function getBeatIndex(progress, thresholds, finaleStart = 0.86) {
  if (progress >= finaleStart) return -1;
  let active = -1;
  thresholds.forEach((threshold, index) => {
    if (progress >= threshold) active = index;
  });
  return active;
}
```

- [ ] **Step 4: Implement the browser controller**

`initScrollFilm()` must:

- find the story, stage, video, beats, status, progress, replay, and wordmark elements;
- derive normalized progress from the story and sticky-stage rectangles;
- set `currentTime` only when metadata is ready, the video is not seeking, and delta exceeds `0.018` seconds;
- use `requestAnimationFrame` and preserve reverse scrolling;
- reveal the final wordmark from progress `0.958` and the descriptor at `0.972`;
- show the poster and add `data-film-state="fallback"` after direct seek and one Blob-backed retry fail;
- revoke the Blob URL on `pagehide`;
- skip video scrubbing for reduced motion and expose all beats as normal content;
- replay with `window.scrollTo()` to the story start.

- [ ] **Step 5: Run timeline tests**

Run: `npm run test:static`

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add assets/js/scroll-film.js tests/scroll-film.test.mjs
git commit -m "feat: add reversible scroll film controller"
```

### Task 4: Responsive Visual System And Interactions

**Files:**
- Modify: `assets/css/portfolio.css`
- Modify: `assets/js/portfolio.js`
- Modify: `index.html`
- Create: `tests/portfolio.test.mjs`

**Interfaces:**
- Produces: `setLanguage(language, root)`, `initNavigation(root)`, and `initPortfolio(root)`.
- Consumes: elements with `data-ko`, `data-en`, `data-lang`, `data-menu-toggle`, and anchor links to known section IDs.

- [ ] **Step 1: Write failing language tests**

```javascript
import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeLanguage } from '../assets/js/portfolio.js';

test('language normalization supports Korean and English only', () => {
  assert.equal(normalizeLanguage('ko-KR'), 'ko');
  assert.equal(normalizeLanguage('en-US'), 'en');
  assert.equal(normalizeLanguage('ja-JP'), 'en');
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm run test:static`

Expected: FAIL because `normalizeLanguage` is not exported.

- [ ] **Step 3: Implement localization and navigation**

```javascript
export function normalizeLanguage(value = '') {
  return value.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

export function setLanguage(language, root = document) {
  const normalized = normalizeLanguage(language);
  root.documentElement.lang = normalized;
  root.querySelectorAll('[data-ko][data-en]').forEach(element => {
    element.textContent = element.dataset[normalized];
  });
  root.querySelectorAll('[data-lang]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === normalized));
  });
  localStorage.setItem('portfolio-language', normalized);
  return normalized;
}
```

`initNavigation()` must close the menu after navigation or Escape, maintain `aria-expanded`, use `IntersectionObserver` for the active section, and initialize Lucide icons when the CDN is available. Text labels remain visible if the CDN fails.

- [ ] **Step 4: Implement the complete CSS visual system**

The CSS must implement:

- a full-bleed dark sticky intro with 600vh story height;
- film scrim, browser-rendered artifacts, six non-overlapping growth beats, status strip, progress line, and final wordmark;
- an off-white content surface using full-width evidence rows, not floating section cards;
- stable media aspect ratios and no nested cards;
- four signal accents without purple-dominant or single-hue styling;
- breakpoints at 960px and 640px;
- 44px minimum interactive targets;
- `:focus-visible`, reduced motion, print, and no-JavaScript styles;
- fixed font sizes per breakpoint rather than viewport-scaled typography;
- zero letter spacing across the site.

- [ ] **Step 5: Run static tests and HTML validation**

Run: `npm run test:static && tidy -errors -quiet index.html`

Expected: tests PASS; `tidy` reports no structural errors. HTML5 custom-data warnings may be reviewed but not ignored if they indicate malformed markup.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/portfolio.css assets/js/portfolio.js tests/portfolio.test.mjs
git commit -m "feat: style responsive portfolio experience"
```

### Task 5: Browser QA And Accessibility Contracts

**Files:**
- Create: `tests/e2e/portfolio.spec.mjs`
- Modify: `playwright.config.mjs`

**Interfaces:**
- Consumes: stable selectors and state attributes from Tasks 2–4.
- Produces: repeatable Chromium QA across desktop, tablet, mobile, and reduced-motion configurations.

- [ ] **Step 1: Write the end-to-end contracts**

```javascript
import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'small-mobile', width: 320, height: 700 }
];

for (const viewport of viewports) {
  test(`${viewport.name} has no overflow or console errors`, async ({ page }) => {
    const errors = [];
    page.on('console', message => message.type() === 'error' && errors.push(message.text()));
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.locator('#selected-work')).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors).toEqual([]);
  });
}

test('film reaches all beats, finale, and reverses', async ({ page }) => {
  await page.goto('/');
  const story = page.locator('#scroll-story');
  const stage = page.locator('#scroll-stage');
  await page.waitForFunction(() => document.querySelector('#scroll-film').readyState >= 1);
  const setProgress = progress => page.evaluate(value => {
    const storyElement = document.querySelector('#scroll-story');
    const stageElement = document.querySelector('#scroll-stage');
    const distance = storyElement.offsetHeight - stageElement.offsetHeight;
    scrollTo(0, storyElement.offsetTop + distance * value);
  }, progress);
  await setProgress(0.75);
  await expect(page.locator('[data-beat="5"]')).toHaveClass(/is-active/);
  await setProgress(1);
  await expect(page.locator('#final-wordmark')).toHaveCSS('opacity', '1');
  await setProgress(0.23);
  await expect(page.locator('[data-beat="1"]')).toHaveClass(/is-active/);
});

test('reduced motion exposes readable content without scrubbing', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#scroll-stage')).toHaveAttribute('data-film-state', 'reduced');
  await expect(page.locator('[data-beat]')).toHaveCount(6);
});
```

- [ ] **Step 2: Install Chromium and run the tests to expose current browser issues**

Run: `npx playwright install chromium && npm run test:e2e`

Expected: any failures identify exact layout, timing, or accessibility gaps. Do not weaken assertions to make failures disappear.

- [ ] **Step 3: Fix only failures demonstrated by the contracts**

Keep changes within `index.html`, `assets/css/portfolio.css`, `assets/js/portfolio.js`, or `assets/js/scroll-film.js`. Add regression assertions for each behavioral bug fixed.

- [ ] **Step 4: Run the complete suite**

Run: `npm test`

Expected: all static and end-to-end tests PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e playwright.config.mjs index.html assets/css assets/js
git commit -m "test: cover portfolio responsive experience"
```

### Task 6: Final Claim Review, Visual QA, And Local Preview

**Files:**
- Modify: `docs/portfolio-evidence.md`
- Modify if evidence requires: `index.html`
- Create locally but do not commit: `artifacts/portfolio-desktop.png`, `artifacts/portfolio-mobile.png`

**Interfaces:**
- Consumes: all implementation files and current local evidence.
- Produces: a clean local branch, verified screenshots, and a local preview URL ready for user review.

- [ ] **Step 1: Revalidate claims against current evidence**

Run:

```bash
git -C /Users/m4pro-2/pet-routine-app status --short --branch
git -C /Users/m4pro-2/claude-code-skillsets-public-v12-release status --short --branch
jq '{material_mismatch_count, summary, metrics}' /Users/m4pro-2/stock-ai-bot/data/reports/strategy_research_reset/us_source_breadth_upro_spxu_v2/independent_audit.json
rg -n "versionCode|production|worldwide|technical-preview|review_pending|executable" \
  /Users/m4pro-2/pet-routine-app \
  /Users/m4pro-2/claude-code-skillsets-public-v12-release \
  -g '!node_modules' -g '!*.lock'
```

Update the evidence ledger with the verification date and exact source paths. Remove or soften homepage claims that current evidence does not support.

- [ ] **Step 2: Run mechanical verification**

```bash
bash tests/media-contract.sh
npm test
node --check assets/js/portfolio.js
node --check assets/js/scroll-film.js
tidy -errors -quiet index.html
git diff --check
```

Expected: all commands pass or only reviewed non-structural `tidy` warnings remain documented.

- [ ] **Step 3: Capture final screenshots**

Use Playwright to capture the intro origin, Build, Verify, final wordmark, selected work, archive, and contact at desktop and mobile sizes. Store screenshots under ignored `artifacts/`.

- [ ] **Step 4: Inspect screenshots and canvas/video pixels**

Verify:

- video is nonblank at origin and final;
- central flare does not erase the wordmark;
- growth copy does not overlap evidence layers;
- project imagery is authentic and legible;
- no text is truncated at 320px;
- the next content section is visible after the film completes;
- the palette does not read as monochrome green, purple, beige, or dark-blue slate.

- [ ] **Step 5: Start the final local server**

Run: `python3 -m http.server 4173 --bind 127.0.0.1`

Expected preview: `http://127.0.0.1:4173/`.

- [ ] **Step 6: Commit final local corrections**

```bash
git add index.html assets docs/portfolio-evidence.md tests package.json package-lock.json playwright.config.mjs .gitignore
git commit -m "fix: polish portfolio renewal"
```

- [ ] **Step 7: Stop before publication**

Report the local branch, commits, test results, media size, screenshot findings, and preview URL. Do not push, merge, or publish until the user explicitly approves the live change.
