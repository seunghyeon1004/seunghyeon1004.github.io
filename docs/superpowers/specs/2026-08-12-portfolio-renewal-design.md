# Seunghyeon Portfolio Renewal Design

## Purpose

Renew the GitHub Pages homepage so the first impression demonstrates Seunghyeon's technical range before explaining it. The site presents him as an AI product and automation systems builder for collaborators and business partners, while preserving evidence, limitations, and earlier work.

## Approved Direction

The homepage opens with a scroll-controlled 15-second cinematic universe. Scattered stars, project fragments, code, operational nodes, and research evidence are revealed by a continuous camera pullback. Six growth beats connect those fragments. The final network highlights once and resolves into the full `SEUNGHYEON` wordmark.

The video supplies atmosphere and camera movement. Exact project names, metrics, Korean and English copy, links, and the final wordmark are browser-rendered layers so they remain legible, truthful, responsive, and reversible during scrolling.

Generated phones, charts, icons, and code inside the film are conceptual growth imagery, not portfolio evidence. They must be visually subordinate to the browser-rendered layers. No claim may rely on a generated object; all product and research claims are supported below the intro by authentic screenshots, copy, links, or explicitly labeled private-system descriptions.

## Audience And Positioning

Primary audience:

- Product collaborators
- Business partners
- Teams seeking AI product, automation, or operating-system work

Primary positioning:

> AI products, automation systems, and evidence-driven execution.

The homepage must not lead with the former Web3, crypto-content, or profitable-trading identity. Those projects remain part of the archive and their existing pages remain reachable.

## Information Architecture

### 1. Scroll Film Intro

The first viewport is the working experience, not a marketing preface.

- Sticky 15-second film mapped to approximately 600vh of scroll distance
- Six browser-rendered growth beats: Explore, Build, Operate, Systemize, Verify, Connect
- Real PawRelay and F301 evidence fragments appear at the relevant beats
- Anonymized operational and tooling fragments appear as HTML/code layers
- Final `SEUNGHYEON` wordmark reveals from left to right
- Four signal nodes converge beneath the wordmark
- Korean and English language toggle remains available without interrupting scroll state
- Replay returns to the beginning of the film

### 2. Selected Systems

Four primary bodies of work follow the intro as full-width editorial rows rather than nested cards:

1. **PawRelay — AI Product / Household Coordination**
   - Product problem: prevent missed or duplicated household pet-care tasks
   - Show authentic mobile product imagery
   - Revalidate release status before publication

2. **Multi-Mac Operations — Automation System**
   - Show the operating pattern from discovery through review, receipt, and verification
   - Keep private hosts, accounts, identifiers, and credentials anonymized
   - Emphasize guarded failure states rather than unattended automation claims

3. **Claude Skillsets — Public Tooling**
   - Show the skill package structure and verifier-oriented workflow
   - Revalidate the current review and executable status before publication
   - Do not imply production readiness when the evidence only supports technical preview

4. **F301 — Auditable Research Evidence**
   - Present the negative result as evidence of disciplined validation
   - Use the verified 190-trade result, benchmark comparison, and zero material mismatches only after revalidation
   - Never frame the rejected strategy as a profitable or live-trading system

Each row includes: role, problem, approach, outcome or evidence, technologies, and an available project/evidence link. Missing public links are labeled as private systems rather than fabricated.

### 3. Capabilities

An unframed three-part section summarizes the repeatable operating model:

- Build: turn a problem into a usable product
- Operate: turn repeated work into a guarded system
- Verify: retain receipts, tests, and negative results

Copy stays concise. The projects above provide the proof.

### 4. Earlier Experiments

Preserve earlier work without letting it define the first impression:

- Arcana Survivors
- Cookie.fun X Tracker
- Fox After School Lab
- BTC Signal Bot and KRX research dashboards
- Other public experiments already linked from the repository

This is a compact archive list, not another large card grid. Existing standalone pages and URLs remain unchanged.

### 5. Collaboration And Contact

Close with a business-partner-oriented invitation:

- Partner idea
- Product build
- System operation
- Evidence returned

Use verified GitHub and X links. Do not invent an email address. External navigation is explicit and accessible.

## Visual System

### Intro

- Near-black background with warm-white and cool-white stars
- Signal accents: lime, coral, electric blue, and green
- Generated video remains visible but is darkened enough for browser-rendered evidence
- No new decorative gradients, bokeh, generic space ornaments, or generated text
- The wordmark uses a thin dark outline so it remains legible over the central light

### Content Sections

- Shift from the dark intro to a clean off-white evidence surface
- Use black, off-white, signal lime, coral, blue, and green rather than a one-note palette
- Use borders and whitespace instead of floating section cards
- Repeated project rows may use restrained framed media but no cards inside cards
- Corners stay at 0–6px
- Typography uses Pretendard with system fallbacks and zero letter spacing

### Responsive Behavior

- Desktop intro uses `16:9` cover framing
- Mobile intro uses centered cover framing and keeps the wordmark within 90% of viewport width
- Content rows collapse to one column without hiding evidence
- No horizontal scrolling at 320px and wider
- Navigation becomes a compact icon-controlled menu on mobile
- Hover behavior has focus-visible and touch equivalents

## Architecture

The site remains a static GitHub Pages application without a framework or build requirement.

Files are split by responsibility:

- `index.html`: semantic page structure and localized content
- `assets/css/portfolio.css`: visual system and responsive layout
- `assets/js/portfolio.js`: navigation, language, archive, and accessibility behavior
- `assets/js/scroll-film.js`: video preload, scroll-to-time mapping, beat state, replay, and reduced-motion fallback
- `assets/media/portfolio-universe-720p.mp4`: optimized 15-second H.264 source without audio
- `assets/media/portfolio-universe-poster.webp`: first-frame fallback
- `assets/images/pawrelay-product.webp`: authentic product evidence
- `assets/images/f301-evidence.webp`: authentic research evidence

The existing standalone project, dashboard, PawRelay policy, and Fox After School Lab files remain untouched.

## Scroll Film Data Flow

1. The browser loads the poster immediately and preloads video metadata.
2. The film controller determines the scrollable root and the sticky story range.
3. Normalized progress from `0` to `1` maps to video time from `0` to the safe final frame.
4. A `requestAnimationFrame` loop updates only when the target time changes materially.
5. Beat thresholds update copy, evidence layers, status, and progress indicators.
6. The final threshold reveals the wordmark, signal line, and identity descriptor.
7. Reverse scrolling applies the same mapping in reverse with no separate animation timeline.

GitHub Pages byte-range support is used directly. If seeking is unavailable after metadata loads, the controller fetches the video once into a Blob and retries. Failure leaves the poster and all browser-rendered content usable.

## Accessibility And Reduced Motion

- Semantic headings and sections preserve a coherent reading order without JavaScript
- Video is decorative and muted; exact meaning lives in HTML
- `prefers-reduced-motion: reduce` skips scrubbing and shows a stable poster plus all six beats as normal content
- All controls have visible labels or tooltips and keyboard focus
- Color is never the sole carrier of status
- Text and meaningful images meet WCAG AA contrast targets
- Project imagery has useful alternative text; decorative stars do not

## Performance

- Keep the H.264 intro at 720p and target approximately 6–11 MB
- Remove audio and non-primary video streams
- Insert regular keyframes for responsive seeking
- Use a compressed WebP poster and lazy-load below-fold images
- Keep application JavaScript dependency-free; load pinned `lucide@1.27.0` from the documented UMD CDN only for menu, replay, and external-link icons, with text fallbacks
- Do not block the first render on video download

## Error Handling

- Video metadata failure: show poster, keep progress copy and normal page scrolling
- Video seek failure: retry once with Blob-backed media, then fail to the poster
- Missing image: preserve row layout and expose textual evidence
- JavaScript disabled: intro displays the poster and final identity; all later content and links remain readable
- External links use `rel="noopener noreferrer"`

## Verification

Before calling the local renewal complete:

- Validate HTML with `tidy`
- Check JavaScript syntax with `node --check`
- Inspect media metadata with `ffprobe`
- Run a local static server
- Exercise intro progress at origin, all six beats, reveal, final, and reverse scroll
- Test Chromium viewports at 1440x1000, 1024x768, 390x844, and 320x700
- Confirm zero console errors and zero horizontal overflow
- Confirm all internal links return 200 and external links retain their intended URLs
- Capture and inspect final desktop and mobile screenshots
- Test `prefers-reduced-motion: reduce`
- Revalidate every current status or numerical claim before publication

## Publication Boundary

Local implementation, local commits, and local preview are in scope. Pushing, merging, enabling GitHub Pages changes, or publishing the renewed homepage requires separate explicit approval after the user reviews the final local result.
