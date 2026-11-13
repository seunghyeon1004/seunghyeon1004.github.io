// 색인 걸러 보기와, 줄에 올렸을 때 결과 화면 미리보기. 스크립트가 꺼져도 목록과 링크는 그대로 보인다.
(() => {
  const chips = document.querySelectorAll('.chip[data-filter]');
  const rows = document.querySelectorAll('.row[data-kind]');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const want = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      rows.forEach((r) => { r.hidden = want !== 'all' && r.dataset.kind !== want; });
    });
  });

  const work = document.querySelector('.work');
  if (!work || !window.matchMedia('(hover: hover)').matches) return;
  document.documentElement.classList.add('js');
  const preview = document.createElement('div');
  preview.className = 'preview';
  preview.setAttribute('aria-hidden', 'true');
  const img = new Image();
  img.alt = '';
  img.decoding = 'async';
  preview.append(img);
  work.append(preview);
  const show = (link) => {
    const src = link.dataset.img;
    if (!src) return hide();
    if (img.getAttribute('src') !== src) img.src = src;
    preview.classList.add('is-on');
  };
  const hide = () => preview.classList.remove('is-on');
  document.querySelectorAll('.row__link').forEach((link) => {
    link.addEventListener('mouseenter', () => show(link));
    link.addEventListener('focus', () => show(link));
    link.addEventListener('mouseleave', hide);
    link.addEventListener('blur', hide);
  });
})();
