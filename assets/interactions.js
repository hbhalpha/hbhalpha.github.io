/* Interruptible navigation, pointer lighting, and native disclosure transitions. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const ease = 'cubic-bezier(.25,.46,.45,.94)';
  let travel = null;
  function stopTravel() { if (travel !== null) cancelAnimationFrame(travel); travel = null; }
  ['wheel','touchstart','pointerdown'].forEach(type => addEventListener(type, stopTravel, { passive:true }));
  addEventListener('keydown', event => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End','Escape',' '].includes(event.key)) stopTravel();
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = link.getAttribute('href');
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch (_) { return; }
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    stopTravel();
    const start = scrollY;
    const offset = (document.querySelector('.site-header')?.getBoundingClientRect().height || 76) + 26;
    const end = id === 'top' ? 0 : Math.max(0, Math.min(document.documentElement.scrollHeight-innerHeight, start+target.getBoundingClientRect().top-offset));
    if (location.hash !== hash) history.pushState(null, '', hash);
    function focusTarget() {
      const added = !target.hasAttribute('tabindex');
      if (added) target.setAttribute('tabindex','-1');
      target.focus({ preventScroll:true });
      if (added) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once:true });
    }
    if (reduce.matches || Math.abs(end-start) < 3) { scrollTo(0,end); focusTarget(); return; }
    const duration = Math.min(2000, 1050+Math.abs(end-start)*.13);
    const began = performance.now();
    function tick(now) {
      const t = Math.min(1, (now-began)/duration);
      scrollTo(0, start+(end-start)*(1-Math.cos(Math.PI*t))/2);
      if (t < 1) travel = requestAnimationFrame(tick);
      else { travel = null; focusTarget(); }
    }
    travel = requestAnimationFrame(tick);
  });

  // The nav marker follows hover and the section currently being read.
  const nav = document.getElementById('site-nav');
  const marker = document.createElement('span');
  marker.className = 'nav-marker';
  marker.setAttribute('aria-hidden','true');
  nav.prepend(marker);
  nav.classList.add('with-marker');
  let marked = null, hovered = null;
  function placeMarker(link, force=false) {
    if (!link || !nav.getClientRects().length) { marker.style.opacity='0'; marked=null; return; }
    if (link === marked && !force) return;
    const base=nav.getBoundingClientRect(), r=link.getBoundingClientRect();
    marker.style.width=`${r.width}px`;
    marker.style.height=`${r.height}px`;
    marker.style.transform=`translate3d(${r.left-base.left}px,${r.top-base.top}px,0)`;
    marker.style.opacity='1';
    marked=link;
  }
  const active = () => nav.querySelector('a[aria-current="location"]');
  nav.addEventListener('pointerover', event => {
    if (!finePointer.matches) return;
    const link=event.target.closest('a');
    if (link) { hovered=link; placeMarker(link); }
  });
  nav.addEventListener('pointerleave', () => { hovered=null; placeMarker(active()); });
  nav.addEventListener('focusin', event => { if(event.target.matches('a')) placeMarker(event.target); });
  nav.addEventListener('focusout', () => placeMarker(active()));
  new MutationObserver(() => { if(!hovered) placeMarker(active()); }).observe(nav, {subtree:true,attributes:true,attributeFilter:['aria-current','class']});
  addEventListener('resize', () => placeMarker(hovered||active(),true), {passive:true});
  placeMarker(active());

  // Translate a static light layer rather than repainting a changing gradient.
  let spotlight=null, lightFrame=null;
  let targetX=0,targetY=0,currentX=0,currentY=0,lastTime=0;
  function stopLight() {
    spotlight?.classList.remove('spotlight-active');
    spotlight=null;
    if(lightFrame!==null) cancelAnimationFrame(lightFrame);
    lightFrame=null;
  }
  function moveLight(now) {
    if(!spotlight) { lightFrame=null; return; }
    const step=1-Math.exp(-Math.min(40,now-lastTime)/95);
    lastTime=now;
    currentX+=(targetX-currentX)*step;
    currentY+=(targetY-currentY)*step;
    spotlight.style.setProperty('--light-x',`${currentX}px`);
    spotlight.style.setProperty('--light-y',`${currentY}px`);
    if(Math.abs(targetX-currentX)+Math.abs(targetY-currentY)>.15) lightFrame=requestAnimationFrame(moveLight);
    else lightFrame=null;
  }
  document.querySelectorAll('.paper-card,.project-card,.portrait-card').forEach(card => {
    card.classList.add('has-spotlight');
    card.addEventListener('pointerenter', event => {
      if(!finePointer.matches||reduce.matches) return;
      stopLight();
      spotlight=card;
      const r=card.getBoundingClientRect();
      currentX=targetX=event.clientX-r.left;
      currentY=targetY=event.clientY-r.top;
      card.style.setProperty('--light-x',`${currentX}px`);
      card.style.setProperty('--light-y',`${currentY}px`);
      card.classList.add('spotlight-active');
    });
    card.addEventListener('pointermove', event => {
      if(spotlight!==card) return;
      const r=card.getBoundingClientRect();
      targetX=event.clientX-r.left;
      targetY=event.clientY-r.top;
      if(lightFrame===null) { lastTime=performance.now(); lightFrame=requestAnimationFrame(moveLight); }
    });
    card.addEventListener('pointerleave', () => { if(spotlight===card) stopLight(); });
  });

  // Reversible native disclosures, including rapid clicks midway through motion.
  const expanding=new Map();
  function settle(details,record) {
    details.open=record.open;
    details.style.overflow='';
    expanding.delete(details);
  }
  document.querySelectorAll('.author-details').forEach(details => {
    const summary=details.querySelector('summary');
    summary.addEventListener('click', event => {
      if(reduce.matches||!details.animate) return;
      event.preventDefault();
      const old=expanding.get(details), open=old?!old.open:!details.open;
      const start=details.getBoundingClientRect().height;
      old?.animation.cancel();
      details.open=open;
      const end=details.getBoundingClientRect().height;
      details.open=true;
      details.style.overflow='hidden';
      const animation=details.animate([{height:`${start}px`},{height:`${end}px`}],{duration:650,easing:ease});
      const record={animation,open};
      expanding.set(details,record);
      animation.finished.then(() => { if(expanding.get(details)===record) settle(details,record); }).catch(()=>{});
    });
  });
  function settleAll() { expanding.forEach((record,details) => { record.animation.cancel(); settle(details,record); }); }
  addEventListener('resize',settleAll,{passive:true});
  addEventListener('beforeprint', () => {
    // The main script has already opened all author lists for print.
    expanding.forEach((record,details) => { record.animation.cancel(); details.style.overflow=''; });
    expanding.clear();
  });
  reduce.addEventListener('change', () => { if(reduce.matches) { stopTravel(); stopLight(); settleAll(); } });
  addEventListener('pagehide', () => { stopTravel(); stopLight(); settleAll(); });
})();
