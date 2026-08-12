# Portfolio Product Storytelling Revision

## Decision

Keep the approved cinematic universe intro as the signature opening. Rework the page after it into a quiet, product-led scroll narrative inspired by the pacing and focus of Apple product pages. The intended balance is 30 percent cinematic identity and 70 percent restrained product storytelling.

This revision borrows principles, not brand assets or copy. It uses one-message scenes, large evidence imagery, disciplined typography, generous space, and controlled transitions. It does not reproduce Apple's navigation, logos, proprietary layouts, device renders, or wording.

## Problem With The Current Draft

The intro creates a strong emotional rise, but the current `Selected Systems` section immediately returns to dense editorial rows. Each row presents the project summary, three facts, tags, a link, and a detailed visual at once. The information is accurate, yet the viewer must decide where to look before the work has a chance to land.

The revised page should preserve every useful fact while changing the order in which it appears. Each project gets one dominant idea first. Supporting details arrive only after the viewer has seen the work.

## Experience Arc

### 1. Cinematic Identity

The existing 15-second reversible scroll film remains the opening experience. Its six growth beats and final `SEUNGHYEON` reveal do not change. The final constellation highlight becomes the handoff into the product narrative.

The transition out of the intro must feel intentional:

- The universe reaches its brightest resolved frame.
- The final wordmark holds briefly in scroll space.
- A clean white surface rises into view without a decorative gradient.
- The first content line appears alone: `What the signals became.` / `연결된 신호가 실제로 만든 것.`
- The navigation changes from dark to light only after the white surface occupies most of the viewport.

### 2. Product-Led Proof

Four projects appear in this order:

1. PawRelay
2. Multi-Mac Operations
3. Claude Skillsets
4. F301

Each project uses a three-beat scene instead of one dense row.

**Beat A: Thesis**

A short statement and the project name fill most of the viewport. No tags, fact tables, or long paragraph appear here. The message must explain what changed for a person or operating process.

**Beat B: Evidence**

The real product image, pipeline, registry state, or audit result becomes the largest object on screen. The evidence scales or moves slightly with scroll, but it cannot be hidden behind text or decorative overlays.

**Beat C: Method**

Role, approach, verified result, technology, and link appear in a compact evidence strip below the main scene. This preserves the current factual depth without competing with the first impression.

### 3. Operating Model

`Build. Operate. Verify.` follows the four projects as a quiet summary, not another visual climax. The section uses three unframed columns on desktop and a simple vertical sequence on mobile. Each item points back to specific work above.

### 4. Earlier Work And Contact

The archive remains compact. It should read like a useful index, with project name, year or state, and destination. The closing collaboration section keeps the current business-partner framing and verified GitHub and X links.

## Project Scene Design

### PawRelay: A Shared Day, Kept In Sync

PawRelay is the first and brightest proof point. The thesis focuses on preventing missed or duplicated care between people. Authentic app screens occupy most of the scene.

Desktop behavior:

- The project title and one sentence enter first.
- The existing app-screen composite expands from roughly 70 to 100 percent of the content width.
- A restrained horizontal shift reveals different screens as the page moves, without creating a separate horizontal scroll control.
- The evidence strip follows in normal document flow.

Mobile behavior:

- The title stays above the image.
- The full composite remains inspectable and does not crop important screens.
- No sticky pin lasts longer than one viewport.

### Multi-Mac Operations: Repetition With A Stop Condition

The operating pipeline becomes the main object. Nodes activate in order as the scene enters: Discover, Draft, Review, Act, Verify. The final state is not celebration but the rule `UNKNOWN -> STOP`.

The visual must stay diagrammatic and readable. It cannot imitate a terminal merely for decoration. Private machine names, accounts, credentials, and operating identifiers remain absent.

### Claude Skillsets: A Tool That Can Say Not Yet

This scene centers the current registry state: `20 review-held`, `0 executable now`. Rows enter as reviewed paths, while the executable count stays fixed at zero. The interaction must reinforce restraint, not suggest that installation is available.

The public repository link belongs in the evidence strip. Current status must be refreshed immediately before publication.

### F301: The Result Was No

F301 closes the project sequence with the strongest contrast. The thesis appears first: `The result was no. The evidence still mattered.` The audit visual then resolves into the verified numbers and terminal rejection.

Negative values use a restrained red accent, the positive benchmark uses green, and the final rejection remains plain text. Motion cannot turn the result into a trading-performance spectacle. The scene must keep the no-live-trading boundary visible.

## Layout And Type

The intro remains near-black. Product scenes use clean white and soft neutral surfaces with black type. Color appears only when it carries project meaning:

- PawRelay signal green: `#167A45`
- Operations review amber: `#D76B34`
- Skillsets state blue: `#2F6FED`
- F301 negative red: `#C83F49`
- Body black: `#111111`
- Paper white: `#F7F7F5`
- Pure white stage: `#FFFFFF`

Pretendard remains the only downloaded family. The design gets its character from scale, weight, and spacing rather than another font dependency. Display headings use strong weight and short line lengths. Body text stays compact and readable. Letter spacing remains zero.

Project scenes span the viewport width. Content uses a shared maximum width, but evidence imagery may break out wider. No section becomes a floating card. Framed surfaces are reserved for the product image, pipeline, registry, and audit artifacts themselves.

## Motion Rules

One orchestrated transition belongs to each project. Small elements do not animate independently without purpose.

- Use CSS sticky positioning only where it improves focus.
- Drive scene progress with a small `requestAnimationFrame` controller and normalized section progress.
- Prefer transform and opacity updates. Avoid layout-thrashing properties.
- Limit evidence scaling to a subtle range so text and images remain sharp.
- Reverse scrolling must reverse every state deterministically.
- Hover reactions stay limited to links and archive rows. The main story works without hover.

The existing film controller remains separate. A new `assets/js/product-story.js` controller observes only the four project scenes. It cannot change the film timeline or own navigation and language state.

## Responsive And Reduced Motion

Desktop widths at 1024px and above use sticky scenes with side-by-side title and evidence compositions. Widths below 1024px use normal vertical flow, shorter transitions, and complete images. The layout must not depend on a pointer or wide viewport.

At 390px and 320px:

- No text overlaps evidence.
- No horizontal page overflow appears.
- Project headings fit without viewport-scaled font sizing.
- Links and controls retain at least 44px touch targets.
- Evidence strips become stacked definition lists.

With `prefers-reduced-motion: reduce`, all scenes render in their final readable state, sticky durations collapse, and transforms are removed. The video intro continues to use its approved stable-poster fallback.

## Content Rules

The page keeps the current verified claims and does not add promotional superlatives. Each project scene follows this order:

1. Human or operational problem
2. Visible result
3. Method and verified evidence

Browser-rendered text remains the source of meaning. Generated material in the intro remains atmospheric and cannot serve as proof. Public links are shown only when verified. Private work is labeled private.

## Implementation Boundaries

The site remains a static GitHub Pages project. The revision should primarily touch:

- `index.html` for scene structure and shorter project copy
- `assets/css/portfolio.css` for the stage layout and responsive motion states
- `assets/js/product-story.js` for normalized project-scene progress
- `tests/portfolio.test.mjs` and `tests/e2e/portfolio.spec.mjs` for the revised contracts

The intro media, film controller, standalone dashboards, PawRelay policy pages, and archived project routes remain unchanged unless a verified defect requires a narrow fix.

## Performance Budget

No new video, framework, web font, or large image dependency is added. The existing evidence images are reused.

- New JavaScript should remain under 8 KB minified-equivalent before compression.
- Scroll handlers must schedule visual writes through `requestAnimationFrame`.
- Below-fold evidence remains lazy-loaded where native loading does not interfere with scene readiness.
- The first contentful render must not wait for the intro video download.
- A failed enhancement must leave a complete, readable document.

## Verification

The revision is ready for publication only after these checks pass:

- Existing static, media, and scroll-film tests remain green.
- New tests confirm four project scenes and their thesis, evidence, and method beats.
- Chromium QA passes at 1440x1000, 1024x768, 390x844, and 320x700.
- Forward and reverse scrolling produce stable project states.
- Reduced-motion mode shows every project without sticky transitions.
- No horizontal overflow, text collision, missing evidence, or unexpected layout shift appears.
- Browser console errors remain at zero.
- Live links and time-sensitive claims are refreshed again immediately before publication.
- Final desktop and mobile screenshots are inspected, including each project scene and the intro-to-white transition.

## Publication Boundary

The earlier publication approval applied to the previous reviewed draft. This design revision returns the site to local review. No push, merge, or GitHub Pages publication occurs until the revised implementation is complete, verified, and explicitly approved for publication.
