/* Progressive enhancement: content remains visible if motion is unavailable. */
(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.16,1,.3,1)';
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
    play(element, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 850, easing: ease, delay, fill: 'backwards' });
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
    }, { threshold: .06, rootMargin: '0px 0px -18px 0px' });
    document.querySelectorAll('.section-head, .bio-card, .timeline-card, .paper-card, .project-card, .simple-card, .updates')
      .forEach(element => observer.observe(element));
  }

  // FLIP positions only for cards close to the viewport; no per-frame layout work.
  const cards = [...document.querySelectorAll('.paper-card')];
  let previousPositions = new Map();
  const filterAnimations = new Map();
  document.addEventListener('publications:before-filter', () => {
    filterAnimations.forEach(animation => animation.cancel());
    filterAnimations.clear();
    previousPositions = new Map();
    if (reducedMotion.matches) return;
    cards.forEach(card => {
      if (!card.hidden) previousPositions.set(card, card.getBoundingClientRect());
    });
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
      const distance = previous ? Math.max(-80, Math.min(80, previous.top - next.top)) : 14;
      const animation = play(card,
        [{ opacity: previous ? 1 : 0, transform: `translateY(${distance}px)` }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 520, easing: ease });
      if (animation) filterAnimations.set(card, animation);
    });
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
    }
  });
  measureRange();
})();
