# Portfolio Outcomes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a truthful, bilingual `OUTCOMES / 02` section that presents the submitted research paper, the live Kmong research service, and the AI education program under review with a direct inquiry path.

**Architecture:** Keep the cinematic intro, four `data-product-scene` elements, and `product-story.js` unchanged. Insert two semantic, full-width outcome bands in normal document flow between `#selected-work` and `#capabilities`; implement all behavior with HTML anchors and responsive CSS, then extend the existing static and Playwright contracts.

**Tech Stack:** Static HTML5, existing CSS custom properties and responsive breakpoints, Node.js test runner, Playwright 1.62.1, Lucide icons already loaded by the page.

## Global Constraints

- Preserve `SELECTED SYSTEMS / 04`, the four-signal intro metaphor, and all existing intro media and controllers.
- Add exactly two outcome bands in this order: `research`, then `business`.
- The paper status is `Submission received · Technical check as of 10 Aug 2026`; never claim accepted, published, peer reviewed, or under peer review.
- The public paper action links only to `https://github.com/seunghyeon1004/stock-ai-negative-results-reproducibility`.
- `입찰/지원사업 맞춤 리서치` is the only Kmong offer labeled live and links to `https://kmong.com/gig/789934`.
- `AI로 직접 만드는 실전 바이브 코딩 1:1/단체 강의` is labeled `크몽 심사 중` and has no marketplace purchase URL.
- The AI program action is `강의·워크숍 문의` and points to `#contact`.
- Do not expose the paper submission ID, private tracker, email, AI course review ID, unredacted screenshots, sales, students, reviews, revenue, or outcome guarantees.
- Do not add JavaScript, frameworks, video, fonts, third-party widgets, marketplace embeds, or large media assets.
- Korean and English variants must contain the same claims and state boundaries.
- The implementation stays local; push, PR, merge, and GitHub Pages deployment require separate approval.

## File Map

- Modify `index.html`: add `#outcomes`, both outcome bands, truthful external links, the AI inquiry anchor, and updated collaboration paths.
- Modify `assets/css/portfolio.css`: style the editorial bands, publication evidence, service rows, state accents, focus/hover states, and 1023px/640px layouts.
- Modify `tests/static-contract.test.mjs`: lock section presence, outcome order, bilingual content, accurate statuses, allowed links, and forbidden AI purchase behavior.
- Modify `tests/e2e/portfolio.spec.mjs`: verify responsive visibility, language switching, inquiry navigation, state/link distinctions, and layout order.

---

### Task 1: Outcome Content And Static Contract

**Files:**
- Modify: `tests/static-contract.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `data-ko` and `data-en` translation contract from `assets/js/portfolio.js`; existing `.text-link` and `#contact` anchors.
- Produces: `#outcomes`, `[data-outcome="research"]`, `[data-outcome="business"]`, `[data-offer-status="live"]`, and `[data-offer-status="under-review"]` selectors for CSS and Playwright.

- [ ] **Step 1: Write the failing static contract**

Extend the approved-section list and add the following test to `tests/static-contract.test.mjs`:

```js
test('homepage exposes two truthful research and business outcomes', () => {
  const outcomes = [...html.matchAll(/<article[^>]+data-outcome=["']([^"']+)["']/g)]
    .map(match => match[1]);

  assert.deepEqual(outcomes, ['research', 'business']);
  assert.match(html, /id=["']outcomes["']/);
  assert.match(html, /OUTCOMES \/ 02/);
  assert.match(html, /Submission received · Technical check as of 10 Aug 2026/);
  assert.match(html, /stock-ai-negative-results-reproducibility/);
  assert.match(html, /data-offer-status=["']live["']/);
  assert.match(html, /https:\/\/kmong\.com\/gig\/789934/);
  assert.match(html, /data-offer-status=["']under-review["']/);
  assert.match(html, /크몽 심사 중/);
  assert.match(html, /href=["']#contact["']/);
  assert.doesNotMatch(html, /kmong\.com\/gig\/795856/);
});
```

Change the first test's section loop to:

```js
for (const id of ['scroll-story', 'scroll-film', 'selected-work', 'outcomes', 'capabilities', 'archive', 'contact']) {
```

- [ ] **Step 2: Run the static contract and confirm the intended failure**

Run:

```bash
npm run test:static
```

Expected: FAIL because `#outcomes` and the two `data-outcome` elements do not exist. Existing tests should continue to pass.

- [ ] **Step 3: Add the semantic outcomes section**

Insert the following markup after `</section>` for `#selected-work` and before `<section id="capabilities"` in `index.html`:

```html
    <section id="outcomes" class="section section--outcomes" aria-labelledby="outcomes-title">
      <header class="outcomes-heading">
        <p class="section-kicker">OUTCOMES / 02</p>
        <div>
          <h2 id="outcomes-title" data-ko="증거는 논문으로, 경험은 서비스로 이어졌습니다." data-en="Evidence became a paper. Experience became a service.">증거는 논문으로, 경험은 서비스로 이어졌습니다.</h2>
          <p data-ko="연구와 운영, 실제 AI 프로젝트 경험을 다른 사람이 검토하고 선택하고 문의할 수 있는 형태로 만들었습니다." data-en="Research, operations, and hands-on AI work became outcomes others can inspect, choose, and ask about.">연구와 운영, 실제 AI 프로젝트 경험을 다른 사람이 검토하고 선택하고 문의할 수 있는 형태로 만들었습니다.</p>
        </div>
      </header>

      <article class="outcome-band outcome-band--research" data-outcome="research">
        <header class="outcome-band__story">
          <p class="outcome-band__status">RESEARCH / SUBMISSION RECEIVED</p>
          <span class="outcome-band__number">01</span>
          <h3 data-ko="실패한 결과도, 다시 검증할 수 있는 논문으로 남겼습니다." data-en="A failed result, preserved as research others can inspect.">실패한 결과도, 다시 검증할 수 있는 논문으로 남겼습니다.</h3>
        </header>
        <div class="outcome-band__body">
          <p class="outcome-paper__title">Counting Research Attempts and Reporting Negative Results in AI-Assisted Quantitative Strategy Research: An Auditable Case Study</p>
          <dl class="outcome-proof">
            <div><dt data-ko="저널" data-en="Journal">저널</dt><dd>Computational Economics</dd></div>
            <div><dt data-ko="유형" data-en="Type">유형</dt><dd>Research article</dd></div>
            <div><dt data-ko="상태" data-en="Status">상태</dt><dd>Submission received · Technical check as of 10 Aug 2026</dd></div>
            <div><dt data-ko="공개 근거" data-en="Public evidence">공개 근거</dt><dd data-ko="코드 · 파생 데이터 · 체크섬 · 그림" data-en="Code · Derived data · Checksums · Figures">코드 · 파생 데이터 · 체크섬 · 그림</dd></div>
          </dl>
          <a class="text-link outcome-band__link" href="https://github.com/seunghyeon1004/stock-ai-negative-results-reproducibility" target="_blank" rel="noopener noreferrer"><span data-ko="공개 재현 패키지" data-en="Public reproducibility package">공개 재현 패키지</span> <i data-lucide="arrow-up-right" aria-hidden="true"></i></a>
        </div>
      </article>

      <article class="outcome-band outcome-band--business" data-outcome="business">
        <header class="outcome-band__story">
          <p class="outcome-band__status">BUSINESS / SERVICES &amp; EDUCATION</p>
          <span class="outcome-band__number">02</span>
          <h3 data-ko="판단과 실행 경험을, 필요한 사람이 선택할 수 있는 형태로 만들었습니다." data-en="Operational judgment, shaped into services people can choose.">판단과 실행 경험을, 필요한 사람이 선택할 수 있는 형태로 만들었습니다.</h3>
        </header>
        <div class="outcome-offers">
          <section class="outcome-offer outcome-offer--live" data-offer-status="live" aria-labelledby="kmong-research-title">
            <p class="outcome-offer__status"><span aria-hidden="true"></span> LIVE ON KMONG</p>
            <div class="outcome-offer__copy">
              <h4 id="kmong-research-title">입찰/지원사업 맞춤 리서치</h4>
              <p data-ko="공고를 수집하는 데서 끝내지 않고 적합도, 난이도, 진입장벽, 다음 행동으로 구조화한 3단계 유료 리서치 서비스입니다." data-en="A three-tier paid research service that structures opportunities by fit, difficulty, entry barriers, and next actions.">공고를 수집하는 데서 끝내지 않고 적합도, 난이도, 진입장벽, 다음 행동으로 구조화한 3단계 유료 리서치 서비스입니다.</p>
              <small data-ko="공고 5-15건 · 2-5일 · 3개 패키지" data-en="5-15 opportunities · 2-5 days · 3 packages">공고 5-15건 · 2-5일 · 3개 패키지</small>
            </div>
            <a class="text-link outcome-offer__link" href="https://kmong.com/gig/789934" target="_blank" rel="noopener noreferrer"><span data-ko="서비스 보기" data-en="View service">서비스 보기</span> <i data-lucide="arrow-up-right" aria-hidden="true"></i></a>
          </section>

          <section class="outcome-offer outcome-offer--review" data-offer-status="under-review" aria-labelledby="kmong-ai-title">
            <p class="outcome-offer__status"><span aria-hidden="true"></span> <span data-ko="크몽 심사 중" data-en="KMONG REVIEW IN PROGRESS">크몽 심사 중</span></p>
            <div class="outcome-offer__copy">
              <h4 id="kmong-ai-title">AI로 직접 만드는 실전 바이브 코딩 1:1/단체 강의</h4>
              <p data-ko="12개 이상의 실제 AI 프로젝트 경험을 초급 1:1, 프로젝트 완성 지원, 조직 맞춤 실습의 세 가지 교육 과정으로 구조화했습니다." data-en="More than 12 hands-on AI projects shaped into beginner 1:1, project completion support, and tailored team training.">12개 이상의 실제 AI 프로젝트 경험을 초급 1:1, 프로젝트 완성 지원, 조직 맞춤 실습의 세 가지 교육 과정으로 구조화했습니다.</p>
              <small data-ko="초급 1:1 · 프로젝트 완성 지원 · 조직 맞춤 교육" data-en="Beginner 1:1 · Project completion support · Tailored team training">초급 1:1 · 프로젝트 완성 지원 · 조직 맞춤 교육</small>
            </div>
            <a class="text-link outcome-offer__link" href="#contact"><span data-ko="강의·워크숍 문의" data-en="Ask about training">강의·워크숍 문의</span> <i data-lucide="arrow-down" aria-hidden="true"></i></a>
          </section>
        </div>
      </article>
    </section>
```

Replace the content inside `.contact-paths` with:

```html
          <span data-ko="파트너 아이디어" data-en="Partner idea">파트너 아이디어</span><i aria-hidden="true"></i>
          <span data-ko="제품·운영 시스템" data-en="Product · operating system">제품·운영 시스템</span><i aria-hidden="true"></i>
          <span data-ko="AI 강의·팀 워크숍" data-en="AI training · team workshop">AI 강의·팀 워크숍</span><i aria-hidden="true"></i>
          <span data-ko="증거·검증" data-en="Evidence · verification">증거·검증</span>
```

Update the contact paragraph to:

```html
        <p data-ko="아이디어를 제품으로 만들고, 반복 업무를 운영 시스템으로 바꾸고, AI 강의와 팀 워크숍으로 실행 경험을 나누고, 이미 만든 것의 근거를 다시 검증하는 일." data-en="Turn ideas into products, repeated work into operating systems, share hands-on practice through AI training and team workshops, or test existing claims again.">아이디어를 제품으로 만들고, 반복 업무를 운영 시스템으로 바꾸고, AI 강의와 팀 워크숍으로 실행 경험을 나누고, 이미 만든 것의 근거를 다시 검증하는 일.</p>
```

- [ ] **Step 4: Run the static contract and verify it passes**

Run:

```bash
npm run test:static
```

Expected: all static tests PASS, including the new two-outcome contract and the unchanged four-scene contract.

- [ ] **Step 5: Commit the semantic content**

```bash
git add index.html tests/static-contract.test.mjs
git commit -m "feat: add research and business outcomes"
```

Expected: one commit containing only the semantic markup, bilingual copy, and static contract.

---

### Task 2: Responsive Outcome Presentation And Browser Contract

**Files:**
- Modify: `tests/e2e/portfolio.spec.mjs`
- Modify: `assets/css/portfolio.css`

**Interfaces:**
- Consumes: outcome selectors created by Task 1; existing `--paper-bright`, `--ink`, `--muted`, `--line`, `--green`, `--coral`, and `--research-red` custom properties.
- Produces: a two-column desktop editorial layout, one-column mobile layout, visible state distinctions, and a 44px minimum action target without JavaScript.

- [ ] **Step 1: Write failing browser behavior tests**

Append these tests to `tests/e2e/portfolio.spec.mjs`:

```js
test('outcomes distinguish public artifacts, a live service, and an inquiry-only program', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

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
```

- [ ] **Step 2: Run the new browser tests and confirm presentation failures**

Run:

```bash
npx playwright test tests/e2e/portfolio.spec.mjs --grep "outcomes|AI education"
```

Expected: the semantic assertions from Task 1 may pass, while the mobile order or 44px target assertion fails because outcome-specific CSS does not exist yet.

- [ ] **Step 3: Add the desktop editorial layout**

Insert this block before `.section--capabilities` in `assets/css/portfolio.css`:

```css
.section--outcomes {
  padding-top: 150px;
  padding-bottom: 0;
  background: var(--paper-bright);
}

.outcomes-heading {
  display: grid;
  grid-template-columns: 0.36fr 1.65fr;
  gap: 48px;
  padding-bottom: 78px;
  border-bottom: 1px solid var(--ink);
}

.outcomes-heading h2 {
  max-width: 920px;
  margin: 0;
  font-size: 58px;
  line-height: 1.08;
  text-wrap: balance;
}

.outcomes-heading div > p {
  max-width: 680px;
  margin: 24px 0 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.75;
}

.outcome-band {
  display: grid;
  grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(48px, 7vw, 112px);
  padding: 104px 0 112px;
  border-bottom: 1px solid var(--line);
}

.outcome-band__story {
  min-width: 0;
}

.outcome-band__status,
.outcome-offer__status {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  font-weight: 720;
  line-height: 1.5;
}

.outcome-band--research .outcome-band__status {
  color: var(--research-red);
}

.outcome-band--business .outcome-band__status {
  color: var(--blue);
}

.outcome-band__number {
  display: block;
  margin-top: 62px;
  color: var(--muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
}

.outcome-band h3 {
  max-width: 520px;
  margin: 22px 0 0;
  font-size: 42px;
  line-height: 1.13;
  text-wrap: balance;
}

.outcome-band__body,
.outcome-offers {
  min-width: 0;
}

.outcome-paper__title {
  max-width: 820px;
  margin: 0;
  font-size: 25px;
  font-weight: 680;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.outcome-proof {
  margin: 48px 0 0;
  border-top: 1px solid var(--line);
}

.outcome-proof div {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr);
  gap: 22px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}

.outcome-proof dt,
.outcome-proof dd {
  margin: 0;
}

.outcome-proof dt {
  color: var(--muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
}

.outcome-proof dd {
  font-size: 14px;
  font-weight: 640;
  overflow-wrap: anywhere;
}

.outcome-band__link {
  margin-top: 32px;
}

.outcome-offer {
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr) auto;
  gap: 28px;
  align-items: start;
  padding: 34px 0 38px;
  border-top: 1px solid var(--line);
}

.outcome-offer:last-child {
  border-bottom: 1px solid var(--line);
}

.outcome-offer__status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 5px;
}

.outcome-offer__status > span[aria-hidden="true"] {
  flex: 0 0 auto;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.outcome-offer--live .outcome-offer__status {
  color: var(--green);
}

.outcome-offer--review .outcome-offer__status {
  color: var(--coral);
}

.outcome-offer__copy {
  min-width: 0;
}

.outcome-offer h4 {
  margin: 0;
  font-size: 24px;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.outcome-offer__copy p {
  max-width: 640px;
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.72;
}

.outcome-offer__copy small {
  display: block;
  margin-top: 18px;
  color: var(--ink);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  line-height: 1.6;
}

.outcome-offer__link {
  min-height: 44px;
  margin-top: -8px;
  white-space: nowrap;
}
```

Add outcome link hover behavior inside the existing `@media (hover: hover)` block:

```css
  .outcome-band a:hover {
    color: var(--blue);
  }
```

- [ ] **Step 4: Add tablet and mobile layouts**

Add to the existing `@media (max-width: 1023px)` block:

```css
  .section--outcomes {
    padding: 112px 24px 0;
  }

  .outcomes-heading,
  .outcome-band {
    grid-template-columns: 1fr;
  }

  .outcomes-heading {
    gap: 26px;
  }

  .outcomes-heading h2 {
    font-size: 48px;
  }

  .outcome-band {
    gap: 54px;
    padding: 88px 0 96px;
  }

  .outcome-band__number {
    margin-top: 38px;
  }

  .outcome-band h3 {
    max-width: 720px;
  }
```

Add to the existing `@media (max-width: 640px)` block:

```css
  .section--outcomes {
    padding: 96px 20px 0;
  }

  .outcomes-heading {
    display: block;
    padding-bottom: 58px;
  }

  .outcomes-heading > div {
    margin-top: 22px;
  }

  .outcomes-heading h2 {
    font-size: 36px;
  }

  .outcomes-heading div > p {
    margin-top: 20px;
    font-size: 14px;
  }

  .outcome-band {
    display: block;
    padding: 70px 0 76px;
  }

  .outcome-band__number {
    margin-top: 30px;
  }

  .outcome-band h3 {
    margin-top: 18px;
    font-size: 32px;
  }

  .outcome-band__body,
  .outcome-offers {
    margin-top: 42px;
  }

  .outcome-paper__title {
    font-size: 19px;
  }

  .outcome-proof {
    margin-top: 34px;
  }

  .outcome-proof div {
    grid-template-columns: 78px minmax(0, 1fr);
    gap: 12px;
  }

  .outcome-proof dd {
    font-size: 12px;
  }

  .outcome-offer {
    display: block;
    padding: 30px 0 34px;
  }

  .outcome-offer__copy {
    margin-top: 22px;
  }

  .outcome-offer h4 {
    font-size: 21px;
  }

  .outcome-offer__link {
    width: fit-content;
    margin-top: 24px;
  }

  .contact-paths {
    grid-template-columns: 1fr 1fr;
  }

  .contact-paths i {
    display: none;
  }
```

- [ ] **Step 5: Run focused browser and static tests**

Run:

```bash
npm run test:static
npx playwright test tests/e2e/portfolio.spec.mjs --grep "outcomes|AI education"
```

Expected: static suite PASS; four focused Playwright cases PASS, including both mobile widths.

- [ ] **Step 6: Commit presentation and browser coverage**

```bash
git add assets/css/portfolio.css tests/e2e/portfolio.spec.mjs
git commit -m "feat: present portfolio outcomes responsively"
```

Expected: one commit containing only CSS and browser behavior coverage.

---

### Task 3: Full Regression And Visual Verification

**Files:**
- Verify only: `index.html`
- Verify only: `assets/css/portfolio.css`
- Verify only: `tests/static-contract.test.mjs`
- Verify only: `tests/e2e/portfolio.spec.mjs`
- Temporary screenshots: `/tmp/portfolio-outcomes-desktop.png`, `/tmp/portfolio-outcomes-mobile.png`

**Interfaces:**
- Consumes: the completed semantic and presentation commits from Tasks 1 and 2.
- Produces: fresh regression, screenshot, responsive-overflow, link-state, and repository-state evidence for local review.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
npm test
```

Expected: all Node static tests and all Playwright tests PASS with zero failures.

- [ ] **Step 2: Start a local review server**

Run in a persistent terminal:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Expected: server listens at `http://127.0.0.1:4173/`. If port 4173 is occupied by this checkout's Playwright server, reuse it; if occupied by an unrelated process, use port 4174 for the following screenshot commands.

- [ ] **Step 3: Capture desktop and mobile screenshots**

Run with the active port:

```bash
npx playwright screenshot --browser chromium --viewport-size="1440,1000" --full-page http://127.0.0.1:4173/#outcomes /tmp/portfolio-outcomes-desktop.png
npx playwright screenshot --browser chromium --viewport-size="390,844" --full-page http://127.0.0.1:4173/#outcomes /tmp/portfolio-outcomes-mobile.png
```

Expected: both PNG files exist and show the complete outcome section. Inspect both files with the image viewer; verify no clipped title, false sale implication, nested-card appearance, status ambiguity, overlap, or incoherent blank space.

- [ ] **Step 4: Verify exact live-link and inquiry behavior in Chromium**

Run:

```bash
npx playwright test tests/e2e/portfolio.spec.mjs --grep "outcomes distinguish|routes to collaboration"
```

Expected: PASS. The live service has the external Kmong URL; the under-review program stays on-site and reaches `#contact`.

- [ ] **Step 5: Audit the final diff and worktree**

Run:

```bash
git diff --check origin/main...HEAD
git status --short --branch
git log --oneline --decorate -5
```

Expected: no whitespace errors, no uncommitted implementation files, and the branch is ahead of `origin/main` only by the approved design, content, and presentation commits. Do not push or deploy.

- [ ] **Step 6: Stop at the publication gate**

Report the local URL, changed files, exact test counts, screenshots inspected, and current branch commits. Ask for explicit publication approval before any push, pull request, merge, or GitHub Pages deployment.
