// 작업 화면: 물어보거나 목록에서 고르면 큰 화면이 바로 바뀐다. 답은 이 페이지에 담긴 작업 기록에서만 찾는다(모델 호출 없음).
// 스크립트가 꺼져도 목록의 링크와 첫 작업은 그대로 보인다.
(() => {
  const player = (id, title) => Object.assign(document.createElement('iframe'), {
    src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, title, className: 'yt__frame',
    allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
  });
  // 상세 페이지의 시연 영상: 누르기 전에는 사진만 있고, 누르면 그 자리에서 재생기를 불러온다.
  document.querySelectorAll('.yt[data-yt]').forEach((btn) => {
    btn.addEventListener('click', () => btn.replaceWith(player(btn.dataset.yt, btn.getAttribute('aria-label'))));
  });

  const con = document.querySelector('.con');
  if (!con) return;
  const works = JSON.parse(document.getElementById('works').textContent);
  const bySlug = new Map(works.map((w) => [w.slug, w]));
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => con.querySelector(s);
  const el = (tag, props = {}, kids = []) => { const n = Object.assign(document.createElement(tag), props); n.append(...kids); return n; };
  const view = $('.con__view'), media = $('.con__media'), sayBox = $('.con__say'), live = $('[role=status]');
  const rows = [...con.querySelectorAll('.pick')];
  const chips = [...con.querySelectorAll('.chip[data-q]')];
  const inputs = [...document.querySelectorAll('[data-ask] input')];
  let current = '', touched = false, typing = 0;

  const say = (text) => {
    live.textContent = text;
    const id = ++typing;
    if (still) { sayBox.textContent = text; return; }
    let i = 0;
    const tick = () => {
      if (id !== typing) return;
      i += 2;
      sayBox.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(tick, 18);
    };
    tick();
  };

  const select = (slug) => {
    if (slug === current) return;
    current = slug;
    const w = bySlug.get(slug);
    rows.forEach((r) => r.setAttribute('aria-current', String(r.dataset.slug === slug)));
    const picture = () => (w.img ? el('img', { src: `/assets/work/${w.slug}.webp`, alt: `${w.name} 결과 화면` }) : el('p', { textContent: w.lead }));
    media.replaceChildren(picture());
    $('.con__name').textContent = w.name;
    $('.con__meta').replaceChildren(
      el('span', { className: `tag tag--${w.state}`, textContent: w.status }),
      el('span', { textContent: w.kind }),
      el('span', { className: 'num', textContent: w.year }),
    );
    $('.con__line').textContent = w.line;
    $('.con__facts').replaceChildren(...w.facts.map(([k, v]) => el('div', {}, [el('dt', { textContent: k }), el('dd', { textContent: v })])));
    const acts = [];
    if (w.yt) {
      const play = el('button', { type: 'button', className: 'btn', textContent: '영상 재생' });
      play.addEventListener('click', () => { touched = true; media.replaceChildren(player(w.yt, `${w.name} 시연 영상`)); });
      acts.push(play);
    }
    if (w.link) acts.push(el('a', { className: 'btn', href: w.link[1], target: '_blank', rel: 'noopener', textContent: w.link[0] }));
    acts.push(el('a', { className: 'btn', href: `/work/${w.slug}/`, textContent: '자세히 보기' }));
    acts[0].classList.add('btn--primary');
    $('.con__acts').replaceChildren(...acts);
    view.classList.remove('is-swap');
    void view.offsetWidth;
    view.classList.add('is-swap');
  };

  const shown = () => rows.filter((r) => !r.parentElement.hidden);
  const show = (list, text) => {
    const keep = new Set(list.map((w) => w.slug));
    rows.forEach((r) => { r.parentElement.hidden = !keep.has(r.dataset.slug); });
    if (list.length) select(list[0].slug);
    say(text);
  };

  const n = works.length;
  const kind = (k, words) => (q) => { const l = works.filter((w) => w.k === k); return [l, `${words} ${l.length}개입니다.`]; };
  const jump = (id, text) => () => { document.getElementById(id).scrollIntoView({ behavior: still ? 'auto' : 'smooth' }); return [null, text]; };
  const intents = [
    [/^(안녕|하이|hi|hello)/, () => [null, '안녕하세요. 해커톤, 자동화, 지금 써볼 수 있는 것처럼 보고 싶은 것을 말씀해 주세요.']],
    [/연락|문의|의뢰|견적|맡기|가격|비용/, jump('contact', '문의는 크몽이나 X로 받습니다. 아래로 안내했습니다.')],
    [/사진|입체|깊이|3d/, jump('try', '사진을 입체로 바꾸는 체험으로 안내했습니다.')],
    [/지금|바로|써 ?[볼보]|열어|라이브|체험/, () => { const l = works.filter((w) => w.state === 'in'); return [l, `지금 바로 열어볼 수 있는 작업은 ${l.length}개입니다.`]; }],
    [/영상|비디오|유튜브|시연|데모/, () => { const l = works.filter((w) => w.yt); return [l, `시연 영상이 있는 작업은 ${l.length}개입니다. 영상 재생을 누르면 이 화면에서 바로 나옵니다.`]; }],
    [/해커톤|공모전|대회|출품/, kind('contest', '해커톤과 공모전에 낸 작업은')],
    [/제품|앱|어플|출시/, kind('product', '제품으로 내놓은 작업은')],
    [/자동화|봇|블로그/, kind('auto', '자동화 작업은')],
    [/연구|실측|벤치|측정|맥 ?미니|속도/, kind('research', '직접 재고 연구한 작업은')],
    [/실험|옛|예전/, kind('archive', '실험 기록으로 남긴 작업은')],
    [/전체|전부|모두|다 보여/, () => [works, `작업 ${n}개를 모두 불러왔습니다.`]],
    [/누구|소개|자기/, () => [works, `백승현은 AI로 영상과 앱과 자동화를 직접 만들고 돌립니다. 작업 ${n}개를 불러왔습니다.`]],
  ];
  // 정해 둔 말에 걸리지 않으면 작업 기록의 글에서 낱말을 찾는다.
  const search = (q) => {
    const words = q.toLowerCase().split(/\s+/).map((t) => t.replace(/(보여|알려|찾아)\s*(줘|주세요|줄래)?$|[?!.,]/g, '').replace(/(은|는|이|가|을|를|도|만|의|에|로)$/, '')).filter((t) => t.length >= 2);
    const hits = works.map((w) => [w, words.filter((t) => w.text.includes(t)).length]).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]).map(([w]) => w);
    if (hits.length) return [hits, `‘${q}’와 관련된 작업 ${hits.length}개를 찾았습니다.`];
    return [null, `‘${q}’에 대한 작업은 아직 없습니다. 해커톤, 자동화, 지금 써볼 수 있는 것처럼 물어보세요.`];
  };

  const ask = (raw) => {
    const q = raw.trim();
    if (!q) return;
    touched = true;
    inputs.forEach((i) => { i.value = q; });
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.q === q)));
    const hit = intents.find(([re]) => re.test(q.toLowerCase()));
    const [list, text] = hit ? hit[1](q) : search(q);
    if (list) { show(list, text); con.scrollIntoView({ behavior: still ? 'auto' : 'smooth' }); } else say(text);
  };

  document.querySelectorAll('[data-ask]').forEach((form) => form.addEventListener('submit', (e) => { e.preventDefault(); ask(form.querySelector('input').value); }));
  document.querySelectorAll('[data-q]').forEach((b) => b.addEventListener('click', () => ask(b.dataset.q)));

  rows.forEach((r) => {
    r.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { touched = true; select(r.dataset.slug); } });
    r.addEventListener('focus', () => { touched = true; select(r.dataset.slug); });
    r.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      touched = true;
      select(r.dataset.slug);
      if (view.getBoundingClientRect().top < 0 || getComputedStyle(view).position !== 'sticky') view.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
    });
    r.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const list = shown(), next = list[list.indexOf(r) + (e.key === 'ArrowDown' ? 1 : -1)];
      if (next) { e.preventDefault(); next.focus(); }
    });
  });

  // 말로 묻기: 브라우저에 음성 인식이 있을 때만 단추가 보인다.
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const mic = document.querySelector('[data-mic]');
  if (SR && mic) {
    mic.hidden = false;
    mic.addEventListener('click', () => {
      const r = new SR();
      r.lang = 'ko-KR';
      r.onstart = () => mic.setAttribute('aria-pressed', 'true');
      r.onend = () => mic.setAttribute('aria-pressed', 'false');
      r.onresult = (e) => ask(e.results[0][0].transcript);
      r.onerror = () => { mic.hidden = true; inputs[0].placeholder = '이 브라우저는 음성 인식이 안 됩니다. 글로 물어보세요.'; };
      r.start();
    });
  }

  select(works[0].slug);
  if (still) return;

  // 큰 화면이 포인터를 따라 살짝 기운다.
  if (window.matchMedia('(hover: hover)').matches) {
    view.addEventListener('pointermove', (e) => {
      const b = media.getBoundingClientRect();
      media.style.setProperty('--ry', `${(((e.clientX - b.left) / b.width) - 0.5) * 5}deg`);
      media.style.setProperty('--rx', `${(0.5 - (e.clientY - b.top) / b.height) * 4}deg`);
    });
    view.addEventListener('pointerleave', () => { media.style.setProperty('--ry', '0deg'); media.style.setProperty('--rx', '0deg'); });
  }

  // 아무도 건드리지 않는 동안에는 그림 있는 작업을 차례로 넘겨 보여 준다.
  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.4 }).observe(view);
  con.addEventListener('pointerdown', () => { touched = true; });
  setInterval(() => {
    if (touched || !visible || document.hidden) return;
    const list = shown().filter((r) => bySlug.get(r.dataset.slug).img);
    const next = list[(list.findIndex((r) => r.dataset.slug === current) + 1) % list.length];
    if (next) select(next.dataset.slug);
  }, 4200);
})();
