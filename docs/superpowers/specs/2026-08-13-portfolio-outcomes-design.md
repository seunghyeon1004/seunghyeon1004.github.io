# Portfolio Research And Business Outcomes

## Decision

Keep the approved cinematic intro and the four `Selected Systems` scenes unchanged. Add a new `OUTCOMES / 02` section between F301 and `Build. Operate. Verify.` to show how the work reached the outside world through research publication and paid-service design.

The two outcomes are:

1. A research paper submitted to *Computational Economics*
2. A Kmong business track containing one live research service and one AI education program under review

The AI education program should be promoted clearly enough to generate direct inquiries from portfolio visitors. It must not appear to be approved or on sale. Its primary action is an inquiry path, not a marketplace purchase link.

## Experience Role

The existing page answers what was built and how it was verified. The new section answers what the work became after that:

- F301 became an auditable negative-results paper and public reproducibility package.
- Operating and AI project experience became service and education offers for outside clients and teams.

This is an outcome layer, not two more system scenes. Preserving `Selected Systems / 04` avoids lengthening the sticky product sequence, changing the four-signal intro metaphor, or weakening the distinction between software systems and real-world outcomes.

## Section Structure

The new section appears after the F301 method strip and before `OPERATING MODEL / 03`.

Section introduction:

- Kicker: `OUTCOMES / 02`
- Korean heading: `증거는 논문으로, 경험은 서비스로 이어졌습니다.`
- English heading: `Evidence became a paper. Experience became a service.`
- Supporting copy should state that research, operations, and AI project experience were turned into forms other people can inspect, select, or ask about.

The section uses two full-width editorial bands rather than a card grid. Each band contains one dominant statement, compact evidence, a truthful status label, and one primary action. It remains in normal document flow and does not add another long sticky sequence.

## Outcome 01: Research Paper

### Message

- Eyebrow: `RESEARCH / SUBMISSION RECEIVED`
- Korean headline: `실패한 결과도, 다시 검증할 수 있는 논문으로 남겼습니다.`
- English headline: `A failed result, preserved as research others can inspect.`
- Paper title: `Counting Research Attempts and Reporting Negative Results in AI-Assisted Quantitative Strategy Research: An Auditable Case Study`

The narrative connects directly from F301 without repeating the full trading metrics already shown above. It emphasizes the attempt taxonomy, fixed evaluation contract, negative-result reporting, and reproducibility package.

### Evidence And Status

Display the following compactly:

- Journal: *Computational Economics*
- Article type: Research article
- Status: `Submission received · Technical check as of 10 Aug 2026`
- Public artifact: reproducibility code, derived data, checksums, figures, and citation metadata

Primary action:

- Label: `공개 재현 패키지` / `Public reproducibility package`
- URL: `https://github.com/seunghyeon1004/stock-ai-negative-results-reproducibility`
- Open in a new tab with `rel="noopener noreferrer"`

### Claim Boundary

Do not describe the paper as accepted, published, peer reviewed, or currently under peer review. Do not expose the private submission tracker, submission ID, account email, unredacted screenshots, licensed raw minute data, credentials, or private API responses. The public repository is a reproducibility package, not a public manuscript or preprint.

## Outcome 02: Kmong Business

### Message

- Eyebrow: `BUSINESS / SERVICES & EDUCATION`
- Korean headline: `판단과 실행 경험을, 필요한 사람이 선택할 수 있는 형태로 만들었습니다.`
- English headline: `Operational judgment, shaped into services people can choose.`

The band contains two unframed offer rows. Their status labels must be adjacent to their titles so a visitor cannot mistake one state for the other.

### Live Research Service

- Status: `LIVE ON KMONG` / `크몽 판매 중`
- Name: `입찰/지원사업 맞춤 리서치`
- Public description: `공고를 수집하는 데서 끝내지 않고 적합도, 난이도, 진입장벽, 다음 행동으로 구조화한 3단계 유료 리서치 서비스.`
- Scope cue: `공고 5-15건 · 2-5일 · 3개 패키지`
- Primary action: `서비스 보기` / `View service`
- URL: `https://kmong.com/gig/789934`

Do not claim revenue, customer count, reviews, successful bids, selection, acceptance, or guaranteed outcomes. Do not imply that the service logs into procurement accounts, submits bids, or includes proposal writing.

### AI Education Program Under Review

- Status: `PROGRAM / UNDER REVIEW` / `크몽 심사 중`
- Name: `AI로 직접 만드는 실전 바이브 코딩 1:1/단체 강의`
- Promotional description: `12개 이상의 실제 AI 프로젝트 경험을 초급 1:1, 프로젝트 완성 지원, 조직 맞춤 실습의 세 가지 교육 과정으로 구조화했습니다.`
- Format cue: `초급 1:1 · 프로젝트 완성 지원 · 조직 맞춤 교육`
- Primary action: `강의·워크숍 문의` / `Ask about training`
- Destination: `#contact`

The inquiry action is deliberately available while marketplace review is pending. It invites independent lecture, workshop, team-training, and collaboration inquiries from portfolio visitors without implying a completed Kmong approval or transaction.

Do not add a Kmong purchase URL for this program while its public route returns 404. Do not show its internal review ID, package prices, sales, students, reviews, revenue, or approval-complete language. `프로젝트 완성 지원` must never become `완성 보장`.

## Inquiry Path

The AI education action scrolls to the existing collaboration section. The contact copy should add teaching and team workshops to the existing product, automation, and verification work without turning the close into a sales landing page.

The contact paths become:

- Partner idea
- Product or operating system
- AI lecture or team workshop
- Evidence and verification

The existing GitHub and X links remain the public contact methods. No private email address is added without a separately confirmed public address.

## Visual Direction

The section continues the page's white, restrained product-story surface and uses color only for meaning:

- Research: near-black type with a restrained publication red accent
- Live service: green status accent
- Under-review program: amber status accent

The paper band may use an HTML/CSS evidence composition based on the audit figure and submission state. It must not use an unredacted portal screenshot. The Kmong band should use structured typography and service metadata rather than imitating or embedding the marketplace interface.

Neither band is a floating card. Thin rules, strong type hierarchy, and generous vertical spacing separate the outcomes. Status labels are compact evidence text, not decorative pills. Hover behavior is limited to links and must not carry essential meaning.

## Responsive And Accessibility

At desktop widths, each outcome uses a two-column editorial layout with the statement on one side and evidence or offers on the other. At widths below 1024px, content becomes a single readable flow.

At 390px and 320px:

- Status appears before or beside the corresponding title.
- The full paper title wraps naturally without clipping or viewport-scaled text.
- Offer rows stack as status, name, description, scope, and action.
- All actions have at least a 44px touch target.
- No horizontal overflow or text overlap is allowed.

Korean and English content must both remain complete. Reduced-motion mode shows the same content without entrance transforms. Links have visible focus styles, and status is expressed in text rather than color alone.

## Implementation Boundaries

Expected implementation files:

- `index.html`: new outcome section and revised collaboration paths
- `assets/css/portfolio.css`: outcome bands, offer rows, responsive rules, and focus states
- `tests/static-contract.test.mjs`: structure, copy, statuses, link, and target contracts
- `tests/e2e/portfolio.spec.mjs`: desktop/mobile visibility, language switching, inquiry navigation, and overflow checks

No new JavaScript controller, framework, video, font, third-party widget, or large media asset is required. `assets/js/product-story.js`, the intro film, the four selected scenes, archived routes, dashboards, and PawRelay pages remain unchanged.

## Verification

The implementation is ready for review only when:

- Existing static and Playwright suites remain green.
- Exactly four selected system scenes and exactly two outcome bands are present.
- Outcome order is paper, then Kmong business.
- The live service links to public gig `789934` in a new tab.
- The AI education program has `UNDER REVIEW` text and no purchase link.
- The AI education inquiry action reaches `#contact`.
- Korean and English states show accurate status and complete copy.
- Chromium checks pass at 1440x1000, 1024x768, 390x844, and 320x700.
- No horizontal overflow, text collision, missing focus state, console error, or unexpected layout shift appears.
- Reduced-motion rendering remains complete and readable.
- Time-sensitive paper and marketplace states are refreshed immediately before publication.

## Publication Boundary

This approval covers the design and local implementation of the outcomes section. It does not authorize a push, pull request, merge, or GitHub Pages deployment. After local implementation and browser verification, the user reviews the result and provides separate publication approval.
