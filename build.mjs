// 포트폴리오 정적 페이지 생성기. 실행: node build.mjs
// site/projects.mjs 의 데이터로 index.html 과 work/<slug>/index.html 을 만든다. 의존성 없음.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { projects, kinds } from './site/projects.mjs';

const SITE = 'https://seunghyeon1004.github.io';
const NAME = 'Seunghyeon';
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
      <a href="/#work">작업 ${projects.length}</a>
      <a href="/#try">해보기</a>
      <a href="/#contact">연락</a>
    </nav>
  </div>
</header>
<main id="main">`;

const foot = () => `</main>
<footer class="foot">
  <div class="container foot__in">
    <div class="foot__about">
      <p class="foot__mark">${NAME}</p>
      <p>AI로 영상, 앱, 자동화를 직접 만들고 돌려요. 첫 화면 영상은 Grok으로 만들고 깊이는 제가 따로 계산해서 입혔어요. 숫자는 전부 각 프로젝트 기록에서 확인한 값이에요.</p>
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
<script type="module" src="/assets/js/stage.js"></script>
</body>
</html>
`;

const ytId = (p) => {
  for (const [, u] of p.links) {
    const m = u.match(/youtu\.be\/([\w-]+)/);
    if (m) return m[1];
  }
  return null;
};
// 누르면 그 자리에서 재생되는 시연 영상. 누르기 전에는 우리 쪽 사진만 보인다.
const yt = (p, big) => `<button class="yt shot" type="button" data-yt="${ytId(p)}" aria-label="${esc(p.name)} 시연 영상 재생">
        <img src="/assets/work/${big ? '' : 'thumb/'}${p.slug}.webp" alt="" loading="lazy" ${size(`assets/work/${big ? '' : 'thumb/'}${p.slug}.webp`)}>
        <span class="yt__play">재생</span>
      </button>`;
const mesh = projects.find((p) => p.slug === 'mesh');
const meshTimes = mesh.facts.filter(([k]) => k.startsWith('3초 영상')).map(([k, v]) => [k.replace('3초 영상, ', ''), parseFloat(v), v]);

const tag = (p) => `<span class="tag tag--${p.state}">${esc(p.status)}</span>`;

// 작업 화면에 넘기는 자료. 질문에 답할 때도 이 자료만 쓴다(모델 호출 없음).
const works = projects.map((p) => ({
  slug: p.slug, name: p.name, line: p.line, lead: p.body[0], k: p.kind, kind: kinds[p.kind], year: p.year, status: p.status, state: p.state,
  img: hasImg(p), yt: ytId(p), facts: p.facts.slice(0, 3), link: p.links.find(([, u]) => !/youtu\.be/.test(u)) || null,
  text: [p.name, p.line, ...p.body, ...p.facts.flat()].join(' ').toLowerCase(),
}));
const first = projects[0];
const asks = ['지금 써볼 수 있는 거', '해커톤 나간 거', '자동화', '영상 있는 거'];

const pick = (p, i) => `
        <li><a class="pick" href="/work/${p.slug}/" data-slug="${p.slug}">
          <span class="pick__num num">${String(i + 1).padStart(2, '0')}</span>
          <span class="pick__name">${esc(p.name)}</span>
          ${p.state === 'in' ? tag(p) : '<span></span>'}
          <span class="pick__kind">${esc(kinds[p.kind])}</span>
        </a></li>`;

const index = () => `${head({
  title: `${NAME} | AI로 영상, 앱, 자동화를 만들어요`,
  desc: `해커톤에 낸 것부터 출시한 앱까지, 혼자 만든 것 ${projects.length}개를 모아 뒀어요.`,
  path: '/',
  image: '/assets/hero/poster.webp',
})}
<section class="hero">
  <div class="hero__stage">
    <img src="/assets/hero/poster.webp" alt="새벽 안개가 깔린 돌 항구에 붉은 고깃배가 매여 있는 장면. AI로 만든 영상의 한 장면입니다." width="1280" height="720" fetchpriority="high">
    <canvas data-src="/assets/hero/harbor-depth.mp4" data-src-small="/assets/hero/harbor-depth-small.mp4" aria-hidden="true"></canvas>
  </div>
  <div class="container hero__in">
    <div class="hero__main">
      <h1 class="visually-hidden">${NAME}이 만든 것 ${projects.length}개</h1>
      <div class="asks">
${asks.map((q) => `        <button class="chip" type="button" data-q="${q}">${q}</button>`).join('\n')}
      </div>
    </div>
  </div>
</section>

<section class="con" id="work" aria-labelledby="work-title">
  <div class="container">
    <h2 id="work-title" class="visually-hidden">작업 ${projects.length}개</h2>
    <p class="con__say" aria-hidden="true">지금까지 만든 ${projects.length}개예요.</p>
    <p class="visually-hidden" role="status"></p>
    <div class="con__in">
      <div class="con__view">
        <div class="shot con__media">${hasImg(first) ? `<img src="/assets/work/${first.slug}.webp" alt="${esc(first.name)} 결과 화면">` : `<p>${esc(first.body[0])}</p>`}</div>
        <div class="con__info">
          <div class="con__title">
            <h3 class="con__name">${esc(first.name)}</h3>
            <p class="con__meta">${tag(first)}<span>${esc(kinds[first.kind])}</span><span class="num">${first.year}</span></p>
            <p class="con__line">${esc(first.line)}</p>
            <div class="actions con__acts"><a class="btn btn--primary" href="/work/${first.slug}/">자세히 보기</a></div>
          </div>
          <dl class="figures con__facts">
${first.facts.slice(0, 3).map(([k, v]) => `            <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
          </dl>
        </div>
      </div>
      <div class="con__side">
        <div class="filter" role="group" aria-label="종류로 걸러 보기">
          <button class="chip" type="button" data-q="전체" aria-pressed="true">전체</button>
${Object.values(kinds).map((v) => `          <button class="chip" type="button" data-q="${v}" aria-pressed="false">${v}</button>`).join('\n')}
        </div>
        <ol class="picks ruled">${projects.map(pick).join('')}
        </ol>
      </div>
    </div>
  </div>
  <script type="application/json" id="works">${JSON.stringify(works).replace(/</g, '\\u003c')}</script>
</section>

<section class="try" id="try" aria-labelledby="try-title">
  <div class="container try__in">
    <div class="try__text">
      <h2 id="try-title">본인 사진으로도 해보세요</h2>
      <p class="lead">사진을 올리면 이 기기에서 바로 입체로 바꿔 줘요. 사진은 어디로도 안 보내요.</p>
      <div class="actions">
        <button class="btn btn--primary" type="button" data-sample>예시 사진으로 해보기</button>
        <label class="btn try__file">내 사진 고르기<input class="visually-hidden" type="file" accept="image/*"></label>
        <button class="btn" type="button" data-depth aria-pressed="false" hidden>깊이 지도 보기</button>
      </div>
      <p class="try__status" role="status">처음 한 번은 모델 50MB를 받느라 조금 걸려요.</p>
    </div>
    <figure class="shot try__stage">
      <img src="/assets/try/sample.webp" alt="돌 부두에 매인 붉은 고깃배와 불 켜진 집들. AI로 만든 영상의 한 장면입니다." loading="lazy" width="1280" height="720">
      <canvas aria-hidden="true"></canvas>
    </figure>
  </div>
</section>

<section class="proof" aria-labelledby="proof-title">
  <div class="container proof__in">
    <div class="proof__text">
      <h2 id="proof-title">338초 걸리던 걸 165초로 줄였어요</h2>
      <p class="lead">책상에 있는 맥 미니 세 대를 케이블로 묶어서 영상 모델 하나를 나눠 돌려 봤어요. 옆 영상이 그렇게 뽑은 거예요.</p>
      <a class="btn" href="/work/mesh/">어떻게 했는지 보기</a>
    </div>
    <div class="proof__side">
    <video class="shot proof__film" src="/assets/work/mesh-film.mp4" poster="/assets/work/mesh-film.webp" controls muted loop playsinline preload="none" width="672" height="384" aria-label="맥 미니 4대로 만든 항구 영상"></video>
    <ol class="bars">
${meshTimes.map(([k, n, v]) => `      <li><span class="bars__k">맥 미니 ${esc(k)}</span><span class="bars__track"><span class="bars__bar" style="--v:${(n / meshTimes[0][1]).toFixed(3)}"></span></span><span class="bars__v num">${esc(v)}</span></li>`).join('\n')}
    </ol>
    </div>
  </div>
</section>

<section class="contact" id="contact" aria-labelledby="contact-title">
  <div class="container contact__in">
    <h2 id="contact-title">같이 만들어 보고 싶은 게 있으면 편하게 연락 주세요</h2>
    <div class="actions">
      <a class="btn" href="${KMONG}" target="_blank" rel="noopener">크몽에서 문의하기</a>
      <a class="btn" href="${X}" target="_blank" rel="noopener">X로 연락하기</a>
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
${hasImg(p) && ytId(p) ? `    <div class="proj__shot">
      ${yt(p, true)}
    </div>
` : hasImg(p) ? `    <figure class="shot proj__shot">
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
