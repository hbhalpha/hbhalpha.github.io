/* Scroll motion never hides a readable card or a decoded image. */
(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.25,.46,.45,.94)';
  const trackedAnimations = new Set();
  function play(element, frames, options) {
    if (reducedMotion.matches || !element.animate) return;
    const animation = element.animate(frames, options);
    trackedAnimations.add(animation);
    animation.finished.catch(() => {}).finally(() => trackedAnimations.delete(animation));
    return animation;
  }
  // FLIP positions only for cards close to the viewport; no per-frame layout work.
  const cards = [...document.querySelectorAll('.paper-card')];
  const list = document.getElementById('publication-list');
  const stage = document.querySelector('.publication-stage');
  let previousPositions = new Map();
  let previousHeight = 0;
  let heightAnimation = null;
  const filterAnimations = new Map();
  document.addEventListener('publications:before-filter', () => {
    // Keep the current visual positions when an in-flight filter is interrupted.
    previousPositions = new Map(cards.filter(card => !card.hidden).map(card => [card, card.getBoundingClientRect()]));
    previousHeight = stage?.getBoundingClientRect().height || 0;
    filterAnimations.forEach(animation => animation.cancel());
    filterAnimations.clear();
    heightAnimation?.cancel();
    heightAnimation = null;
    if (stage) stage.style.overflow = '';
  });
  document.addEventListener('publications:filtered', () => {
    if (reducedMotion.matches) return;
    cards.forEach(card => {
      if (card.hidden) return;
      const next = card.getBoundingClientRect();
      if (next.bottom < -150 || next.top > innerHeight + 150) return;
      const previous = previousPositions.get(card);
      const distance = previous && previous.bottom > 70 && previous.top < innerHeight ? previous.top - next.top : 12;
      if (Math.abs(distance) < .5) return;
      const animation = play(card,
        [{ translate: `0 ${distance}px` }, { translate: '0 0' }],
        { duration: 850, easing: ease });
      if (animation) filterAnimations.set(card, animation);
    });
    const nextHeight = list.getBoundingClientRect().height;
    if (stage && previousHeight > 0 && Math.abs(nextHeight - previousHeight) > 1) {
      stage.style.overflow = 'clip';
      const animation = play(stage, [{ height: `${previousHeight}px` }, { height: `${nextHeight}px` }], { duration: 900, easing: ease });
      heightAnimation = animation;
      animation?.finished.then(() => {
        if (heightAnimation === animation) { stage.style.overflow = ''; heightAnimation = null; }
      }).catch(() => {});
    }
  });

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const header = document.querySelector('.site-header');
  let scrollFrame = null;
  let scrollRange = 1;
  function measureRange() {
    scrollRange = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scheduleScroll();
  }
  function renderScroll() {
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / scrollRange))})`;
    header?.classList.toggle('is-scrolled', scrollY > 24);
    scrollFrame = null;
  }
  function scheduleScroll() {
    if (scrollFrame === null) scrollFrame = requestAnimationFrame(renderScroll);
  }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', measureRange, { passive: true });
  addEventListener('load', measureRange, { once: true });
  document.addEventListener('publications:filtered', measureRange);
  if ('ResizeObserver' in window) new ResizeObserver(measureRange).observe(document.querySelector('main'));
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      trackedAnimations.forEach(animation => animation.cancel());
      if (stage) stage.style.overflow = '';
    }
  });
  addEventListener('beforeprint', () => {
    trackedAnimations.forEach(animation => animation.cancel());
    if (stage) stage.style.overflow = '';
  });
  measureRange();
})();
