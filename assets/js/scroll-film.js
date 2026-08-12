const DEFAULT_DURATION = 15.041667;
const END_PADDING = 0.045;
const SEEK_EPSILON = 0.018;
const BEAT_THRESHOLDS = [0.075, 0.205, 0.335, 0.465, 0.595, 0.725];
const FINALE_START = 0.86;
const WORDMARK_START = 0.958;
const DESCRIPTOR_START = 0.972;

export const clamp = value => Math.max(0, Math.min(1, value));

export function progressToTime(progress, duration, endPadding = END_PADDING) {
  return clamp(progress) * Math.max(0, duration - endPadding);
}

export function getBeatIndex(progress, thresholds = BEAT_THRESHOLDS, finaleStart = FINALE_START) {
  if (progress >= finaleStart) return -1;

  let active = -1;
  thresholds.forEach((threshold, index) => {
    if (progress >= threshold) active = index;
  });
  return active;
}

function getStoryProgress(story) {
  const rect = story.getBoundingClientRect();
  const viewportHeight = Math.max(1, window.innerHeight);
  const scrollRange = Math.max(1, rect.height - viewportHeight);
  return clamp(-rect.top / scrollRange);
}

function getMediaSource(video) {
  const source = video.querySelector('source');
  const value = video.currentSrc || source?.src || source?.getAttribute('src');
  return value ? new URL(value, document.baseURI).href : null;
}

export function initScrollFilm(root = globalThis.document) {
  if (!root || typeof window === 'undefined') return null;

  const story = root.querySelector('#scroll-story');
  const stage = root.querySelector('#scroll-stage');
  const video = root.querySelector('#scroll-film');
  const beats = [...root.querySelectorAll('#growth-beats [data-beat]')];
  const status = root.querySelector('[data-film-status]');
  const progressBar = root.querySelector('[data-film-progress]');
  const replay = root.querySelector('[data-film-replay]');
  const wordmark = root.querySelector('#final-wordmark');

  if (!story || !stage || !video || beats.length === 0) return null;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = motionQuery.matches;
  let duration = DEFAULT_DURATION;
  let frameRequested = false;
  let recoveryAttempted = false;
  let blobUrl = null;
  let destroyed = false;

  const setFallback = () => {
    story.dataset.filmState = 'fallback';
    video.hidden = true;
  };

  const recoverWithBlob = async () => {
    if (recoveryAttempted || reducedMotion) {
      setFallback();
      return;
    }

    recoveryAttempted = true;
    const sourceUrl = getMediaSource(video);
    if (!sourceUrl) {
      setFallback();
      return;
    }

    story.dataset.filmState = 'recovering';
    try {
      const response = await fetch(sourceUrl);
      if (!response.ok) throw new Error(`Film request failed: ${response.status}`);
      blobUrl = URL.createObjectURL(await response.blob());
      video.src = blobUrl;
      video.load();
    } catch {
      setFallback();
    }
  };

  const setTimelineState = progress => {
    const activeBeat = getBeatIndex(progress);
    const videoTime = progressToTime(progress, duration);
    const isFinale = progress >= FINALE_START;
    const isWordmarkVisible = progress >= WORDMARK_START;
    const isDescriptorVisible = progress >= DESCRIPTOR_START;

    story.style.setProperty('--story-progress', progress.toFixed(5));
    story.dataset.phase = isFinale ? 'finale' : activeBeat >= 0 ? `beat-${activeBeat + 1}` : 'origin';
    story.toggleAttribute('data-wordmark-visible', isWordmarkVisible);
    story.toggleAttribute('data-descriptor-visible', isDescriptorVisible);
    wordmark?.style.setProperty('--wordmark-progress', clamp((progress - WORDMARK_START) / (1 - WORDMARK_START)).toFixed(5));

    beats.forEach((beat, index) => {
      const isActive = index === activeBeat;
      beat.classList.toggle('is-active', isActive);
      if (reducedMotion) {
        beat.removeAttribute('aria-hidden');
      } else {
        beat.setAttribute('aria-hidden', String(!isActive));
      }
    });

    if (progressBar) progressBar.style.setProperty('--film-progress', progress.toFixed(5));
    if (status) status.textContent = `${videoTime.toFixed(1).padStart(4, '0')} / ${duration.toFixed(1)}`;

    if (reducedMotion || story.dataset.filmState === 'fallback') return;
    if (video.readyState < 1 || video.seeking || Math.abs(video.currentTime - videoTime) <= SEEK_EPSILON) return;

    try {
      video.currentTime = videoTime;
    } catch {
      void recoverWithBlob();
    }
  };

  const render = () => {
    frameRequested = false;
    if (destroyed) return;
    setTimelineState(getStoryProgress(story));
  };

  const requestRender = () => {
    if (frameRequested || destroyed) return;
    frameRequested = true;
    window.requestAnimationFrame(render);
  };

  const applyMotionPreference = () => {
    reducedMotion = motionQuery.matches;
    story.dataset.filmState = reducedMotion ? 'reduced-motion' : video.readyState >= 1 ? 'ready' : 'loading';
    beats.forEach(beat => beat.removeAttribute('aria-hidden'));
    requestRender();
  };

  const onMetadata = () => {
    if (Number.isFinite(video.duration) && video.duration > 0) duration = video.duration;
    if (!reducedMotion) story.dataset.filmState = 'ready';
    requestRender();
  };

  const onReplay = () => {
    const storyTop = story.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: storyTop, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const destroy = () => {
    destroyed = true;
    window.removeEventListener('scroll', requestRender);
    window.removeEventListener('resize', requestRender);
    replay?.removeEventListener('click', onReplay);
    motionQuery.removeEventListener?.('change', applyMotionPreference);
    if (blobUrl) URL.revokeObjectURL(blobUrl);
  };

  video.addEventListener('loadedmetadata', onMetadata);
  video.addEventListener('error', () => void recoverWithBlob());
  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender, { passive: true });
  window.addEventListener('pagehide', destroy, { once: true });
  replay?.addEventListener('click', onReplay);
  motionQuery.addEventListener?.('change', applyMotionPreference);

  if (video.readyState >= 1) onMetadata();
  applyMotionPreference();

  return { destroy, render: requestRender };
}

if (typeof document !== 'undefined') initScrollFilm();
