/* Image state is monotonic; loading and errors never remove the reserved frame. */
(() => {
  'use strict';
  document.querySelectorAll('img.original-asset').forEach(img => {
    const frame = img.closest('.paper-thumb,.portrait-visual,.inst-logo,.brand-mark');
    if (!frame) return;
    let ready = false, decoding = false;
    function setState(state) { img.dataset.imageState = state; frame.dataset.imageState = state; }
    async function show() {
      if (ready || decoding || !img.naturalWidth) return;
      decoding = true;
      try { if (img.decode) await img.decode(); } catch (_) { /* A valid image still wins. */ }
      decoding = false;
      if (!img.naturalWidth) return;
      ready = true;
      setState('ready');
    }
    function fail() {
      if (ready) return;
      setState('error');
      frame.title = 'Preview unavailable. Open the original image.';
    }
    img.addEventListener('load', show);
    img.addEventListener('error', fail);
    if (img.naturalWidth > 0) {
      // Cached or already painting images must not be faded out again.
      ready = true;
      setState('ready');
    } else if (img.complete) { fail(); }
    else { setState('loading'); }
  });
})();
