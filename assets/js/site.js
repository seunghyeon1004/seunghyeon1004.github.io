// 작업 화면: 단추를 누르거나 목록에서 고르면 큰 화면이 바로 바뀐다. 답은 이 페이지에 담긴 작업 기록에서만 만든다(모델 호출 없음).
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
  const kind = (k, words) => (q) => { const l = works.filter((w) => w.k === k); return [l, `${words} ${l.length}개예요.`]; };
  const intents = [
    [/지금|바로|써 ?[볼보]|열어|라이브|체험/, () => { const l = works.filter((w) => w.state === 'in'); return [l, `지금 바로 열어볼 수 있는 건 ${l.length}개예요.`]; }],
    [/영상|비디오|유튜브|시연|데모/, () => { const l = works.filter((w) => w.yt); return [l, `영상으로 볼 수 있는 건 ${l.length}개예요. 영상 재생을 누르면 여기서 바로 나와요.`]; }],
    [/해커톤|공모전|대회|출품|나간/, kind('contest', '해커톤이랑 공모전에 낸 건')],
    [/제품|앱|어플|출시/, kind('product', '제품으로 내놓은 건')],
    [/자동화|봇|블로그/, kind('auto', '자동화로 돌리는 건')],
    [/연구|실측|벤치|측정|맥 ?미니|속도/, kind('research', '직접 재 보고 연구한 건')],
    [/실험|옛|예전/, kind('archive', '실험하다 기록으로 남긴 건')],
    [/전체|전부|모두|다 보여/, () => [works, `${n}개 전부 꺼내 왔어요.`]],
  ];
  const ask = (raw) => {
    const q = raw.trim();
    if (!q) return;
    touched = true;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.q === q)));
    const hit = intents.find(([re]) => re.test(q.toLowerCase()));
    if (!hit) return;
    const [list, text] = hit[1](q);
    show(list, text);
    con.scrollIntoView({ behavior: still ? 'auto' : 'smooth' });
  };

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
