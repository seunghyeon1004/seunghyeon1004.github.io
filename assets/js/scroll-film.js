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

function canSeekTo(video, targetTime) {
  if (targetTime <= SEEK_EPSILON) return true;
  for (let index = 0; index < video.seekable.length; index += 1) {
    if (video.seekable.start(index) <= targetTime && video.seekable.end(index) >= targetTime) return true;
  }
  return false;
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
  let recoveryPromise = null;
  let usingBlob = false;
  let blobUrl = null;
  let destroyed = false;
  const directSourceUrl = getMediaSource(video);

  const setFallback = () => {
    story.dataset.filmState = 'fallback';
    video.hidden = true;
  };

  const recoverWithBlob = () => {
    if (reducedMotion) return Promise.resolve();
    if (recoveryPromise) return recoveryPromise;
    if (recoveryAttempted || usingBlob) {
      setFallback();
      return Promise.resolve();
    }

    recoveryAttempted = true;
    if (!directSourceUrl) {
      setFallback();
      return Promise.resolve();
    }

    story.dataset.filmState = 'recovering';
    video.pause();
    video.removeAttribute('src');
    video.querySelector('source')?.removeAttribute('src');
    video.load();

    recoveryPromise = fetch(directSourceUrl, { cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error(`Film request failed: ${response.status}`);
        return response.blob();
      })
      .then(blob => {
        if (destroyed) return;
        blobUrl = URL.createObjectURL(blob);
        usingBlob = true;
        video.src = blobUrl;
        video.load();
      })
      .catch(setFallback)
      .finally(() => {
        recoveryPromise = null;
      });
    return recoveryPromise;
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
    const wordmarkProgress = clamp((progress - WORDMARK_START) / (1 - WORDMARK_START));
    wordmark?.style.setProperty('--wordmark-progress', wordmarkProgress.toFixed(5));
    wordmark?.style.setProperty('--wordmark-clip', `${((1 - wordmarkProgress) * 100).toFixed(3)}%`);

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
    if (!canSeekTo(video, videoTime)) {
      if (usingBlob) setFallback();
      else void recoverWithBlob();
      return;
    }

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
    if (!reducedMotion) story.dataset.filmState = usingBlob ? 'blob-ready' : 'ready';
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
  video.addEventListener('error', () => {
    if (usingBlob) setFallback();
    else void recoverWithBlob();
  });
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
