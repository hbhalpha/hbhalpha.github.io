/* Print the decorative margin once as it comes into view. */
(() => {
  'use strict';
  if (!window.IntersectionObserver || !Element.prototype.animate) return;

  const page = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const ornaments = document.querySelectorAll('.margin-art, .margin-rule');
  const printed = { light: new WeakSet(), dark: new WeakSet() };
  const active = new Set();
  const easing = 'cubic-bezier(.22,.58,.25,1)';

  function animate(element, frames, duration, delay = 0) {
    const effect = element.animate(frames, { duration, delay, easing, fill: 'backwards' });
    active.add(effect);
    const release = () => active.delete(effect);
    effect.finished.then(release, release);
  }

  function print(ornament) {
    if (ornament.matches('.margin-rule')) {
      animate(ornament, [
        { scale: '.08 1', transformOrigin: 'left center' },
        { scale: '1 1', transformOrigin: 'left center' }
      ], 1450);
      return;
    }

    if (page.dataset.theme === 'dark') {
      const ink = ornament.querySelector('.art-dark');
      if (!ink) return;
      if (ornament.matches('.margin-pool, .margin-reed')) {
        const isSeam = ornament.matches('.margin-pool');
        animate(ink, [
          { clipPath: isSeam ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
          { clipPath: 'inset(0 0 0 0)' }
        ], isSeam ? 1940 : 1680);
        return;
      }
      const rise = ornament.matches('.margin-fold') ? '0 5px' : '0 0';
      animate(ink, [{ opacity: .14, translate: rise }, { opacity: 1, translate: '0 0' }], 1650);
      if (ornament.matches('.margin-balance')) {
        const orbit = ink.querySelector('.art-stroke');
        if (orbit) animate(orbit, [
          { rotate: '-3deg', transformBox: 'fill-box', transformOrigin: 'center' },
          { rotate: '0deg', transformBox: 'fill-box', transformOrigin: 'center' }
        ], 1880);
      }
      return;
    }

    if (ornament.matches('.margin-balance')) {
      // Rotate wire and counterweights together about their common suspension point.
      const arm = ornament.querySelector('.suspended-arm');
      animate(arm, [
        { rotate: '-5deg' },
        { rotate: '1.8deg', offset: .45 },
        { rotate: '-.6deg', offset: .77 },
        { rotate: '0deg' }
      ], 2340);
      return;
    }

    if (ornament.matches('.margin-fold')) {
      // Sweep clockwise around the pin: the printed mark and ribs open together.
      animate(ornament, [
        { clipPath: 'polygon(34% 97%,-30% 135%,-30% -40%,12% -40%,12% -40%,12% -40%)' },
        { clipPath: 'polygon(34% 97%,-30% 135%,-30% -40%,130% -40%,140% -5%,145% 16%)', offset: .62 },
        { clipPath: 'polygon(34% 97%,-30% 135%,-30% -40%,130% -40%,150% 30%,150% 145%)' }
      ], 1940);
      return;
    }

    // The oblique edge crosses the outer layer. Inner masks keep their own geometry.
    animate(ornament, [
      { clipPath: 'polygon(-10% -10%,8% -10%,-4% 110%,-10% 110%)' },
      { clipPath: 'polygon(-10% -10%,125% -10%,113% 110%,-10% 110%)' }
    ], 1820);
    const ink = ornament.querySelector('.art-light') || ornament;
    ink.querySelectorAll('.art-plane').forEach((plane, index) => {
      animate(plane, [{ translate: '-20px 7px' }, { translate: '0 0' }],
        1710, Math.min(index, 3) * 70);
    });
    ink.querySelectorAll('.art-stroke').forEach((stroke, index) => {
      animate(stroke, [{ translate: '14px -3px' }, { translate: '0 0' }],
        1760, 100 + Math.min(index, 4) * 70);
    });
  }

  const observer = new IntersectionObserver(entries => {
    if (reducedMotion.matches) return;
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting || printed[page.dataset.theme].has(target)) continue;
      printed[page.dataset.theme].add(target);
      observer.unobserve(target);
      print(target);
    }
  }, { rootMargin: '0px 0px 28px 0px' });

  function stop() {
    observer.disconnect();
    active.forEach(animation => animation.cancel());
    active.clear();
  }
  function watch() {
    stop();
    if (reducedMotion.matches) return;
    ornaments.forEach(element => { if (!printed[page.dataset.theme].has(element)) observer.observe(element); });
  }

  watch();
  reducedMotion.addEventListener('change', watch);
  new MutationObserver(watch).observe(page, { attributes: true, attributeFilter: ['data-theme'] });
  addEventListener('beforeprint', stop);
  addEventListener('afterprint', watch);
  addEventListener('pagehide', stop);
  addEventListener('pageshow', event => { if (event.persisted) watch(); });
})();
