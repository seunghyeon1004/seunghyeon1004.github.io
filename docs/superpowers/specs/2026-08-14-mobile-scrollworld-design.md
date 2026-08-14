# Mobile Scrollworld Extension

## Decision

Keep the existing 15-second cinematic intro unchanged and enable a condensed project scrollytelling experience on phones. At widths up to `640px`, each of the four project scenes becomes a short, reversible sticky sequence. Wider tablets from `641px` through `1023px` keep the current readable document flow, while desktop behavior at `1024px` and above remains unchanged.

This is the approved middle option: it adds a clear mobile narrative without copying the desktop section's longer `240vh` pacing.

## Experience

Each phone scene uses a `180svh` scroll container and a sticky stage positioned below the `64px` navigation. At a `390x844` viewport, the stage is approximately `780px` tall and travels approximately `739px` before releasing back into the document.

The sequence is:

1. Thesis from `0%` through `22%` progress.
2. Evidence from `22%` through `72%` progress.
3. Method handoff from `72%` through `100%` progress.
4. The complete method block follows in normal document flow.

The existing state thresholds remain shared with desktop so forward and reverse scrolling stay deterministic. The evidence layer fades and scales into place while the thesis exits upward. The method content never overlays the sticky stage and remains fully readable after the stage releases.

The experience must not use scroll snapping, intercept touch events, call `preventDefault()`, or create a nested scroll container. Native vertical scrolling remains in control at all times.

## Architecture

The existing `assets/js/product-story.js` controller remains the single owner of project-scene progress. It continues to use passive `scroll` and `resize` listeners with `requestAnimationFrame` scheduling. Phone and desktop scenes use the same `getSceneProgress()` and `getSceneState()` functions; only reduced-motion mode forces the terminal readable state.

No new runtime script, dependency, media asset, or HTML structure is required. The current `data-product-scene`, `data-scene-layer`, `data-scene-state`, and `--scene-progress` interfaces remain unchanged.

Mobile pinning is a progressive enhancement. CSS applies only when all three conditions are true:

- `html[data-product-story-ready="true"]` is present.
- The viewport is at most `640px` wide.
- `prefers-reduced-motion` is `no-preference`.

If JavaScript fails or reduced motion is enabled, the existing normal-flow layout remains the fallback.

## Responsive Layout

At phone widths:

- `.project-scene__scroll` is `180svh`.
- `.project-scene__stage` is sticky at `top: 64px` with `height: calc(100svh - 64px)`.
- The stage uses stable dimensions and clips only the transitioning thesis and evidence layers.
- Thesis and evidence occupy the same stage area during the transition.
- The PawRelay image remains fully inspectable and may not crop important screens.
- Project headings fit at `320px` without viewport-scaled typography.
- The page must have no horizontal overflow.

At `641px` through `1023px`, the current expanded vertical flow remains unchanged. At `1024px` and above, the current desktop `240vh` scene behavior remains unchanged.

## Accessibility And Failure Handling

With `prefers-reduced-motion: reduce`, project scenes remain unpinned, all thesis and evidence content stays visible, transforms are removed, and the method block stays in document order. The existing stable-poster behavior for the cinematic intro is unchanged.

Without `product-story.js`, the readiness attribute is absent, so no mobile sticky rules activate. All twelve project layers remain visible and usable. Links and controls retain their existing touch targets and keyboard behavior.

## Verification

Implementation follows test-driven development. Verification must cover:

- Unit contracts for deterministic progress and state thresholds.
- A real touch-enabled Playwright context at `390x844` using `isMobile: true` and `hasTouch: true`.
- An upward swipe that advances both `scrollY` and the active scene state.
- A downward swipe that reverses both `scrollY` and the active scene state.
- Repeated native swipes that pass from the project story into the following section without scroll lock.
- Zero horizontal overflow at `390x844` and `320x700`.
- Normal readable flow for reduced motion and for a failed enhancement script.
- No regression in the existing desktop forward/reverse project scenes or cinematic intro tests.
- Zero browser console errors during the scoped mobile journey.

Chromium touch emulation can validate the automated contract. Dynamic Safari browser chrome and inertial scrolling require a later physical-iPhone check before publication if a device is available.

## Change Boundary

Expected implementation files:

- `assets/js/product-story.js`
- `assets/css/portfolio.css`
- `tests/product-story.test.mjs`
- `tests/e2e/portfolio.spec.mjs` or a focused mobile E2E spec if isolation improves clarity

Do not change the intro video, film controller, project copy, page structure, outcomes, game archive, policy pages, or unrelated project assets.

This approval covers local implementation and verification only. It does not authorize push, merge, pull-request publication, or GitHub Pages deployment.
