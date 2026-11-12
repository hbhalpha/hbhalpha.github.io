/* Only decorative ink and page edges animate; readable content is never hidden. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new WeakSet();
  const cards = [...document.querySelectorAll('.paper-card')];
  let observer;
  const isDay = () => root.dataset.theme === 'light';
  function arrive(card) {
    if (seen.has(card) || card.hidden || !isDay()) return;
    seen.add(card);
    card.classList.add('ink-arrived');
    if (!reduce.matches) card.querySelector('.paper-thumb')?.classList.add('paper-turned');
    observer?.unobserve(card);
  }
  cards.forEach(card => {
    const thumb = card.querySelector('.paper-thumb');
    if (!thumb) return;
    const edge = document.createElement('span');
    edge.className = 'paper-lift';
    edge.setAttribute('aria-hidden','true');
    thumb.append(edge);
  });
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) arrive(entry.target); });
    }, { threshold: .08, rootMargin: '0px 0px -12px 0px' });
    cards.forEach(card => observer.observe(card));
  }
  function updateVisible() {
    if (!isDay()) return;
    cards.forEach(card => {
      if (seen.has(card) || card.hidden) return;
      const r=card.getBoundingClientRect();
      if (r.top<innerHeight-12 && r.bottom>80) arrive(card);
    });
  }
  new MutationObserver(updateVisible).observe(root,{attributes:true,attributeFilter:['data-theme']});
  document.addEventListener('publications:filtered',updateVisible);
  reduce.addEventListener('change', () => {
    if (reduce.matches) cards.forEach(card => card.querySelector('.paper-thumb')?.classList.remove('paper-turned'));
  });
  updateVisible();
})();
