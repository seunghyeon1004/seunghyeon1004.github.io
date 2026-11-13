// 포트폴리오 정적 페이지 생성기. 실행: node build.mjs
// site/projects.mjs 의 데이터로 index.html 과 work/<slug>/index.html 을 만든다. 의존성 없음.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { projects, kinds } from './site/projects.mjs';

const SITE = 'https://seunghyeon1004.github.io';
const NAME = '백승현';
const KMONG = 'https://kmong.com/gig/789934';
const X = 'https://x.com/baegseungh7061';
const GH = 'https://github.com/seunghyeon1004';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ext = (u) => (u.startsWith('http') ? ' target="_blank" rel="noopener"' : '');
const hasImg = (p) => p.img && existsSync(`assets/work/${p.slug}.webp`);
// 이미지의 실제 가로세로를 읽어 width/height 속성에 넣는다(레이아웃 밀림 방지). ImageMagick 필요.
const size = (file) => {
  const [w, h] = execFileSync('magick', ['identify', '-format', '%w %h', file]).toString().trim().split(' ');
  return `width="${w}" height="${h}"`;
};

const head = ({ title, desc, path, image }) => `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${path}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${path}">
${image ? `<meta property="og:image" content="${SITE}${image}">\n` : ''}<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css">
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="nav">
  <div class="container nav__in">
    <a class="nav__mark" href="/">${NAME}</a>
    <nav class="nav__links" aria-label="주요 메뉴">
      <a href="/#work">작업</a>
      <a href="/#services">맡길 수 있는 일</a>
      <a class="btn btn--primary btn--small" href="/#contact">의뢰 문의</a>
    </nav>
  </div>
</header>
<main id="main">`;

const foot = () => `</main>
<footer class="foot">
  <div class="container foot__in">
    <div class="foot__about">
      <p class="foot__mark">${NAME}</p>
      <p>자동화와 웹과 앱 시제품을 만들고, 만든 것이 맞게 돌아가는지 검증합니다. 이 페이지의 숫자는 각 프로젝트의 기록에서 확인한 값입니다.</p>
    </div>
    <nav class="foot__col" aria-label="연락처">
      <p class="foot__head">연락</p>
      <a href="${KMONG}" target="_blank" rel="noopener">크몽 서비스</a>
      <a href="${X}" target="_blank" rel="noopener">X @baegseungh7061</a>
      <a href="${GH}" target="_blank" rel="noopener">GitHub</a>
    </nav>
    <nav class="foot__col" aria-label="운영 중인 페이지">
      <p class="foot__head">운영 중인 페이지</p>
      <a href="/pawrelay/">PawRelay 소개</a>
      <a href="/pawrelay/privacy-policy.html">PawRelay 개인정보 처리방침</a>
      <a href="/fox-after-school-lab/">Fox’s After-School Lab</a>
      <a href="/history-exam/">한국사 실전 시험실</a>
    </nav>
  </div>
</footer>
<script src="/assets/js/site.js" defer></script>
</body>
</html>
`;

const tag = (p) => `<span class="tag tag--${p.state}">${esc(p.status)}</span>`;

const row = (p, i) => `
        <li class="row" data-kind="${p.kind}">
          <a class="row__link" href="/work/${p.slug}/"${hasImg(p) ? ` data-img="/assets/work/thumb/${p.slug}.webp"` : ''}>
            <span class="row__num num">${String(i + 1).padStart(2, '0')}</span>
            <span class="row__name">${esc(p.name)}</span>
            <span class="row__line">${esc(p.line)}</span>
            <span class="row__kind">${esc(kinds[p.kind])}</span>
            <span class="row__year num">${p.year}</span>
            <span class="row__tag">${tag(p)}</span>
          </a>
        </li>`;

const caseP = projects.find((p) => p.slug === 'mureobopseo');
const liveCount = projects.filter((p) => p.state === 'in').length;

const index = () => `${head({
  title: `${NAME} | 자동화와 시제품을 만들고 검증합니다`,
  desc: `해커톤 출품작부터 출시한 앱까지, ${NAME}이 직접 만든 결과물 ${projects.length}개를 모았습니다. 자동화, 웹과 앱 시제품, 데이터 검증 의뢰를 받습니다.`,
  path: '/',
  image: '/assets/work/mureobopseo.webp',
})}
<section class="hero">
  <div class="container hero__in">
    <h1>만들고, 돌리고, 검증합니다.</h1>
    <div class="hero__side">
      <p class="lead">해커톤 출품작부터 출시한 앱까지, 직접 만든 결과물 ${projects.length}개입니다.</p>
      <div class="actions">
        <a class="btn btn--primary" href="#contact">의뢰 문의</a>
        <a class="btn" href="#work">작업 보기</a>
      </div>
    </div>
  </div>
</section>

<section class="work" id="work" aria-labelledby="work-title">
  <div class="container">
    <div class="work__head">
      <h2 id="work-title" class="work__title">작업 <span class="num">${projects.length}</span></h2>
      <div class="filter" role="group" aria-label="종류로 걸러 보기">
        <button class="chip" type="button" data-filter="all" aria-pressed="true">전체</button>
${Object.entries(kinds).map(([k, v]) => `        <button class="chip" type="button" data-filter="${k}" aria-pressed="false">${v}</button>`).join('\n')}
      </div>
    </div>
    <ol class="rows ruled">${projects.map(row).join('')}
    </ol>
    <p class="work__note">지금 바로 열어볼 수 있는 것은 ${liveCount}개이고, 청록색으로 표시했습니다.</p>
  </div>
</section>

<section class="case" aria-labelledby="case-title">
  <div class="container case__in">
    <div class="case__text">
      <h2 id="case-title">답에 쓴 숫자를 하나씩 검증합니다</h2>
      <p class="lead">${esc(caseP.name)}는 동네 데이터를 말로 물으면 계산해서 답하고, 그 숫자가 계산값과 맞는지 답 옆에 보여 줍니다.</p>
      <dl class="figures">
        <div><dt>예시 답의 숫자</dt><dd class="num">200개 중 200개 일치</dd></div>
        <div><dt>쓰는 자료</dt><dd class="num">제주데이터허브 8종</dd></div>
        <div><dt>다루는 범위</dt><dd class="num">읍면동 43곳</dd></div>
      </dl>
      <a class="btn" href="/work/${caseP.slug}/">자세히 보기</a>
    </div>
    <figure class="shot case__shot">
      <img src="/assets/work/thumb/${caseP.slug}.webp" alt="물어봅서가 노형동 유동인구 질문에 답하고 숫자 검증 결과를 보여 주는 화면" loading="lazy" ${size(`assets/work/thumb/${caseP.slug}.webp`)}>
    </figure>
  </div>
</section>

<section class="services" id="services" aria-labelledby="services-title">
  <div class="container">
    <h2 id="services-title">맡길 수 있는 일</h2>
    <ol class="steps">
      <li>
        <span class="steps__n num">1</span>
        <h3>반복 업무 자동화</h3>
        <p>사람이 매일 손으로 하던 수집, 작성, 발행을 정해진 시각에 돌아가게 만듭니다.</p>
        <a href="/work/blog-auto/">블로그 자동 발행 보기</a>
      </li>
      <li>
        <span class="steps__n num">2</span>
        <h3>웹과 앱 시제품</h3>
        <p>아이디어를 직접 눌러 볼 수 있는 화면으로 만들고, 필요하면 출시까지 갑니다.</p>
        <a href="/work/pawrelay/">PawRelay 보기</a>
      </li>
      <li>
        <span class="steps__n num">3</span>
        <h3>데이터 검증과 리서치</h3>
        <p>주장과 숫자를 원자료에서 다시 계산해, 맞는 것과 틀린 것을 가려 드립니다.</p>
        <a href="/work/f301/">F301 보기</a>
      </li>
    </ol>
  </div>
</section>

<section class="contact" id="contact" aria-labelledby="contact-title">
  <div class="container contact__in">
    <h2 id="contact-title">다음 것은 같이 만들 수 있습니다</h2>
    <div class="contact__side">
      <p class="lead">하고 싶은 일을 한두 줄로 보내 주시면, 가능한 범위와 기간을 답해 드립니다.</p>
      <div class="actions">
        <a class="btn btn--paper" href="${KMONG}" target="_blank" rel="noopener">크몽에서 문의하기</a>
        <a class="btn btn--ghost" href="${X}" target="_blank" rel="noopener">X로 연락하기</a>
      </div>
    </div>
  </div>
</section>
${foot()}`;

const detail = (p, i) => {
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return `${head({
    title: `${p.name} | ${NAME}`,
    desc: p.line,
    path: `/work/${p.slug}/`,
    image: hasImg(p) ? `/assets/work/${p.slug}.webp` : null,
  })}
<article class="proj">
  <div class="container">
    <p class="crumb"><a href="/#work">작업</a> <span aria-hidden="true">/</span> ${esc(kinds[p.kind])}</p>
    <header class="proj__head">
      <h1>${esc(p.name)}</h1>
      <div class="proj__side">
        <p class="lead">${esc(p.line)}</p>
        <p class="proj__meta">${tag(p)} <span class="num">${p.year}</span></p>
      </div>
    </header>
${hasImg(p) ? `    <figure class="shot proj__shot">
      <img src="/assets/work/${p.slug}.webp" alt="${esc(p.name)} 결과 화면" ${size(`assets/work/${p.slug}.webp`)}>
    </figure>
` : ''}    <div class="proj__body">
      <div class="proj__text">
${p.body.map((t) => `        <p>${esc(t)}</p>`).join('\n')}
${p.note ? `        <p class="proj__note">${esc(p.note)}</p>\n` : ''}${p.links.length ? `        <div class="actions">
${p.links.map(([l, u], k) => `          <a class="btn${k === 0 ? ' btn--primary' : ''}" href="${u}"${ext(u)}>${esc(l)}</a>`).join('\n')}
        </div>
` : ''}      </div>
      <dl class="facts ruled">
${p.facts.map(([k, v]) => `        <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
      </dl>
    </div>
    <nav class="pager ruled" aria-label="다른 작업">
      <a href="/work/${prev.slug}/"><span class="pager__dir">이전 작업</span><span class="pager__name">${esc(prev.name)}</span></a>
      <a href="/work/${next.slug}/"><span class="pager__dir">다음 작업</span><span class="pager__name">${esc(next.name)}</span></a>
    </nav>
  </div>
</article>
${foot()}`;
};

writeFileSync('index.html', index());
projects.forEach((p, i) => {
  mkdirSync(`work/${p.slug}`, { recursive: true });
  writeFileSync(`work/${p.slug}/index.html`, detail(p, i));
});
writeFileSync(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/', ...projects.map((p) => `/work/${p.slug}/`)].map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`,
);
console.log(`built: index.html + ${projects.length} project pages (${projects.filter(hasImg).length} with pictures)`);
