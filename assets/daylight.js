/* Pull a sheet off the decorative print fragment as its chapter arrives.
   No masking, delayed visibility, or animation of any reading content. */
(() => {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Map();
  const cancel = entry => {
    animations.get(entry)?.cancel();
    animations.delete(entry);
  };
  const stop = () => { for (const entry of animations.keys()) cancel(entry); };
  const observer = new IntersectionObserver(entries => {
    for (const {target, isIntersecting} of entries) {
      cancel(target);
      if (!isIntersecting || reduced.matches || document.documentElement.dataset.theme !== 'light') continue;
      const paper = target.querySelector('.chapter-proof > span');
      if (!paper) continue;
      const motion = paper.animate(
        [{transform:'translateX(-9%)'},{transform:'translateX(105%)'}],
        {duration:1650,easing:'cubic-bezier(.28,.13,.17,1)'}
      );
      animations.set(target, motion);
      motion.finished.then(() => { if (animations.get(target) === motion) animations.delete(target); }).catch(() => {});
    }
  }, {rootMargin:'-64px 0px -7% 0px'});
  document.querySelectorAll('.section-head').forEach(head => observer.observe(head));
  reduced.addEventListener('change',stop);
  new MutationObserver(stop).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  addEventListener('pagehide',stop);
})();
