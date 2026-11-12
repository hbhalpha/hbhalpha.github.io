/* Light-mode typesetting. Images stay outside all entrance animations. */
(() => {
  'use strict';
  if (!window.IntersectionObserver || !Element.prototype.animate) return;

  const page = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.22,.64,.24,1)';
  const animations = new Set();
  const impressions = new Map();
  const seen = new WeakSet();
  const lastHeading = new WeakMap();
  const active = () => page.dataset.theme === 'light' && !reduced.matches;

  function animate(element, frames, duration, delay = 0, fill = 'backwards') {
    if (!element) return;
    const animation = element.animate(frames, { duration, delay, easing: ease, fill });
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    return animation;
  }

  function align(element, x, y, duration, delay = 0) {
    animate(element, [
      { transform: `translate(${x}px, ${y}px)` },
      { transform: 'translate(0, 0)' }
    ], duration, delay);
  }

  // Three impressions share one typographic box, including when the title wraps.
  // The original text remains selectable and supplies the accessible heading.
  const bands = [
    'polygon(-20% -30%,120% -30%,120% 25%,-20% 50%)',
    'polygon(-20% 50%,120% 25%,120% 63%,-20% 84%)',
    'polygon(-20% 84%,120% 63%,120% 130%,-20% 130%)'
  ];
  function setType(word, direction, distance) {
    impressions.get(word)?.();
    const source = document.createElement('span');
    source.style.display = 'block';
    source.append(...word.childNodes);
    const glyphs = source.textContent;
    const passes = bands.slice(1).map(() => {
      const pass = document.createElement('span');
      pass.className = 'type-pass';
      pass.setAttribute('aria-hidden', 'true');
      pass.dataset.glyphs = glyphs;
      return pass;
    });
    word.append(source, ...passes);
    const settledColor = getComputedStyle(word).color;
    const offsets = [-1, .78, -.36];
    const strikes = [source, ...passes].map((layer, i) => {
      const dx = direction * distance * offsets[i];
      return animate(layer, [
        { clipPath: bands[i], color: i === 1 ? '#3167ce' : settledColor,
          transform: `translate(${dx}px, ${(i - 1) * 8}px)` },
        { clipPath: bands[i], color: settledColor, transform: 'translate(0, 0)' }
      ], 1450, i * 65, 'both');
    });
    function finish() {
      if (impressions.get(word) !== finish) return;
      impressions.delete(word);
      strikes.forEach(animation => animation.cancel());
      word.replaceChildren(...source.childNodes);
    }
    impressions.set(word, finish);
    Promise.all(strikes.map(animation => animation.finished)).then(finish, finish);
  }

  function chapter(head) {
    const now = performance.now();
    if (now - (lastHeading.get(head) ?? -Infinity) < 2200) return;
    lastHeading.set(head, now);
    const number = head.querySelector('.chapter-number');
    const direction = Number(number.textContent) % 2 ? -1 : 1;
    const distance = Math.min(62, innerWidth * .095);
    const title = head.querySelector('.heading-type');
    switch (head.parentElement.id) {
      case 'bio':
        animate(title, [
          { clipPath: 'polygon(-10% -30%,26% -30%,12% 130%,-10% 130%)', transform: 'translateX(-.16em)' },
          { clipPath: 'polygon(-10% -30%,130% -30%,116% 130%,-10% 130%)', transform: 'translateX(0)' }
        ], 1480);
        break;
      case 'education':
        animate(title, [
          { transform: 'perspective(540px) translateY(.35em) rotateX(-58deg)', transformOrigin: 'left bottom' },
          { transform: 'perspective(540px) translateY(0) rotateX(0)', transformOrigin: 'left bottom' }
        ], 1490);
        break;
      case 'experience':
        animate(title, [
          { transform: 'translateX(.65em) skewX(-8deg)' },
          { transform: 'translateX(0) skewX(0)' }
        ], 1410);
        break;
      case 'publications':
        setType(title, direction, distance * .77);
        break;
      case 'projects':
        animate(title, [
          { transform: 'perspective(680px) rotateY(58deg)', transformOrigin: 'left center' },
          { transform: 'perspective(680px) rotateY(0)', transformOrigin: 'left center' }
        ], 1610);
        break;
      default:
        align(title, 0, -28, 1500);
    }
    align(number, -direction * Math.min(12, distance * .4), 19, 1500);
    align(head.querySelector('.chapter-label'), 0, -10, 950);
    align(head.querySelector('.section-note'), 0, 13, 1080, 180);
    animate(head.querySelector('.chapter-rule'), [
      { transform: 'scaleX(.015) scaleY(2.5)' },
      { transform: 'scaleX(.77) scaleY(1.45)', offset: .6 },
      { transform: 'scale(1)' }
    ], 1670, 80);
  }

  function readingEntry(item, delay) {
    if (item.matches('.hero')) {
      align(item.querySelector('.given-name'), -26, 7, 1520);
      setType(item.querySelector('.folio-surname'), 1, Math.min(84, innerWidth * .1));
      align(item.querySelector('.cn-name'), 0, -17, 1460, 130);
      align(item.querySelector('.subtitle'), 24, 0, 1280, 190);
    } else if (item.matches('.updates')) {
      item.querySelectorAll('.news-lines p').forEach((line, i) => align(line, 23, 0, 1100, i * 105));
    } else if (item.matches('.paper-card')) {
      align(item.querySelector('.paper-title'), 0, 24, 1160);
      align(item.querySelector('.authors, .author-details'), 0, 13, 1080, 100);
    } else if (item.matches('.timeline-card')) {
      align(item.querySelector('.period'), -32, 0, 1230, delay);
      align(item.querySelector('h3'), 0, 19, 1120, delay + 100);
    } else if (item.matches('.simple-card')) {
      align(item.querySelector('h3'), -22, 0, 1200, delay);
      align(item.lastElementChild, 0, 16, 1200, delay + 90);
    } else {
      align(item, 0, 24, 1230, delay);
    }
  }

  const heads = document.querySelectorAll('.section-head');
  const items = document.querySelectorAll([
    '.hero', '.updates', '.bio-card > p', '.timeline-card', '.paper-card',
    '.project-top', '.project-card > p', '.simple-card'
  ].join(','));
  const headObserver = new IntersectionObserver(entries => {
    if (active()) entries.forEach(({ target, isIntersecting }) => { if (isIntersecting) chapter(target); });
  }, { threshold: .48, rootMargin: '-58px 0px -2% 0px' });
  const itemObserver = new IntersectionObserver(entries => {
    if (!active()) return;
    let row = 0;
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting || target.hidden || seen.has(target)) continue;
      seen.add(target);
      itemObserver.unobserve(target);
      readingEntry(target, Math.min(row++, 3) * 90);
    }
  }, { rootMargin: '-56px 0px -4% 0px' });

  function stop() {
    for (const finish of impressions.values()) finish();
    animations.forEach(animation => animation.cancel());
    animations.clear();
  }
  function observeTheme() {
    stop();
    headObserver.disconnect();
    itemObserver.disconnect();
    if (!active()) return;
    heads.forEach(head => headObserver.observe(head));
    items.forEach(item => { if (!seen.has(item)) itemObserver.observe(item); });
  }
  observeTheme();
  new MutationObserver(observeTheme).observe(page, { attributes: true, attributeFilter: ['data-theme'] });
  reduced.addEventListener('change', observeTheme);
  document.addEventListener('publications:before-filter', stop);
  document.addEventListener('focusin', event => {
    for (const animation of animations) {
      if (animation.effect?.target?.contains(event.target)) animation.cancel();
    }
  });
  addEventListener('beforeprint', stop);
  addEventListener('pagehide', stop);
})();
