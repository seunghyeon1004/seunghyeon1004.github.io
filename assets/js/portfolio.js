export function normalizeLanguage(value = '') {
  return value.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

export function setLanguage(language, root = globalThis.document) {
  if (!root) return normalizeLanguage(language);
  const normalized = normalizeLanguage(language);
  const documentElement = root.documentElement || root.ownerDocument?.documentElement;

  if (documentElement) documentElement.lang = normalized;
  root.querySelectorAll('[data-ko][data-en]').forEach(element => {
    element.textContent = element.dataset[normalized];
  });
  root.querySelectorAll('[data-lang]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === normalized));
  });

  try {
    localStorage.setItem('portfolio-language', normalized);
  } catch {
    // The language still applies when storage is unavailable.
  }

  return normalized;
}

export function initNavigation(root = globalThis.document) {
  if (!root || typeof window === 'undefined') return null;

  const header = root.querySelector('#site-nav');
  const menuButton = root.querySelector('[data-menu-toggle]');
  const menu = root.querySelector('#mobile-menu');
  const navigationLinks = [...root.querySelectorAll('#site-nav a[href^="#"]')];
  const sections = [...root.querySelectorAll('main > section[id]')];

  const setMenuOpen = open => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    header?.toggleAttribute('data-menu-open', open);
  };

  const toggleMenu = () => {
    setMenuOpen(menuButton?.getAttribute('aria-expanded') !== 'true');
  };

  const closeMenu = () => setMenuOpen(false);
  const onKeyDown = event => {
    if (event.key !== 'Escape') return;
    closeMenu();
    menuButton?.focus();
  };

  const setActiveSection = id => {
    navigationLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const sectionObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.1, 0.35] })
    : null;

  sections.forEach(section => sectionObserver?.observe(section));
  menuButton?.addEventListener('click', toggleMenu);
  navigationLinks.forEach(link => link.addEventListener('click', closeMenu));
  root.addEventListener('keydown', onKeyDown);

  return {
    close: closeMenu,
    destroy() {
      sectionObserver?.disconnect();
      menuButton?.removeEventListener('click', toggleMenu);
      navigationLinks.forEach(link => link.removeEventListener('click', closeMenu));
      root.removeEventListener('keydown', onKeyDown);
    },
  };
}

export function initPortfolio(root = globalThis.document) {
  if (!root || typeof window === 'undefined') return null;
  const documentElement = root.documentElement;
  if (documentElement?.dataset.portfolioReady === 'true') return null;
  if (documentElement) documentElement.dataset.portfolioReady = 'true';

  let savedLanguage;
  try {
    savedLanguage = localStorage.getItem('portfolio-language');
  } catch {
    savedLanguage = null;
  }

  const language = savedLanguage || navigator.language || 'ko';
  setLanguage(language, root);
  root.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang, root));
  });

  const navigation = initNavigation(root);
  const header = root.querySelector('#site-nav');
  const story = root.querySelector('#scroll-story');
  const updateHeaderTheme = () => {
    if (!header || !story) return;
    header.dataset.onDark = String(story.getBoundingClientRect().bottom > 72);
  };

  updateHeaderTheme();
  window.addEventListener('scroll', updateHeaderTheme, { passive: true });
  window.addEventListener('resize', updateHeaderTheme, { passive: true });

  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.65 } });
  }

  return navigation;
}

if (typeof document !== 'undefined') initPortfolio();
