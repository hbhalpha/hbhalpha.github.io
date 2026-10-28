/* Scroll motion never hides a readable card or a decoded image. */
(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.25,.46,.45,.94)';
  const animated = new WeakSet();
  const trackedAnimations = new Set();
  function play(element, frames, options) {
    if (reducedMotion.matches || !element.animate) return;
    const animation = element.animate(frames, options);
    trackedAnimations.add(animation);
    animation.finished.catch(() => {}).finally(() => trackedAnimations.delete(animation));
    return animation;
  }
  function reveal(element, delay = 0) {
    if (animated.has(element)) return;
    animated.add(element);
    element.classList.add('is-in-view');
    if (element.getBoundingClientRect().top < innerHeight - 12) return;
    play(element, [{ translate: '0 12px' }, { translate: '0 0' }],
      { duration: 1150, easing: ease, delay, fill: 'backwards' });
  }

  // First-paint choreography and one-time reveals, with no hidden-content class.
  document.querySelectorAll('.hero-copy > *, .portrait-card').forEach((element, i) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.top < innerHeight && bounds.bottom > 0) reveal(element, Math.min(i * 65, 325));
  });
  let observer;
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    observer = new IntersectionObserver(entries => {
      let stagger = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.hidden) return;
        reveal(entry.target, Math.min(stagger++ * 55, 165));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px 170px 0px' });
    document.querySelectorAll('.section-head, .bio-card, .timeline-card, .paper-card, .project-card, .simple-card, .updates')
      .forEach(element => observer.observe(element));
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
      animated.add(card);
      if (observer) observer.unobserve(card);
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
      observer?.disconnect();
      if (stage) stage.style.overflow = '';
    }
  });
  addEventListener('beforeprint', () => {
    trackedAnimations.forEach(animation => animation.cancel());
    if (stage) stage.style.overflow = '';
  });
  measureRange();
})();
