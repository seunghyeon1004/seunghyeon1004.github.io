export const clamp = value => Math.max(0, Math.min(1, value));

export function getSceneProgress(rect, viewportHeight) {
  const travel = Math.max(1, rect.height - viewportHeight);
  return clamp(-rect.top / travel);
}

export function getSceneState(progress) {
  if (progress < 0.22) return 'thesis';
  if (progress < 0.72) return 'evidence';
  return 'method';
}

export function initProductStory(root = globalThis.document, view = globalThis.window) {
  if (!root || !view) return null;
  const scenes = [...root.querySelectorAll('[data-product-scene]')];
  if (scenes.length !== 4) return null;

  const motionQuery = view.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopQuery = view.matchMedia('(min-width: 1024px)');
  let frameRequested = false;
  let destroyed = false;

  const setReadableState = scene => {
    scene.style.setProperty('--scene-progress', '1');
    scene.dataset.sceneState = 'method';
  };

  const render = () => {
    frameRequested = false;
    if (destroyed) return;

    if (motionQuery.matches || !desktopQuery.matches) {
      scenes.forEach(setReadableState);
      return;
    }

    scenes.forEach(scene => {
      const progress = getSceneProgress(scene.getBoundingClientRect(), view.innerHeight);
      scene.style.setProperty('--scene-progress', progress.toFixed(5));
      scene.dataset.sceneState = getSceneState(progress);
    });
  };

  const requestRender = () => {
    if (frameRequested || destroyed) return;
    frameRequested = true;
    view.requestAnimationFrame(render);
  };

  const destroy = () => {
    destroyed = true;
    view.removeEventListener('scroll', requestRender);
    view.removeEventListener('resize', requestRender);
    motionQuery.removeEventListener?.('change', requestRender);
    desktopQuery.removeEventListener?.('change', requestRender);
  };

  root.documentElement.dataset.productStoryReady = 'true';
  view.addEventListener('scroll', requestRender, { passive: true });
  view.addEventListener('resize', requestRender, { passive: true });
  view.addEventListener('pagehide', destroy, { once: true });
  motionQuery.addEventListener?.('change', requestRender);
  desktopQuery.addEventListener?.('change', requestRender);
  render();

  return { render: requestRender, destroy };
}

if (typeof document !== 'undefined') initProductStory();
