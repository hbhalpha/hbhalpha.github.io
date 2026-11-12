/* Large ink reveals on first entry; revisited content is never clipped again. */
(() => {
  'use strict';
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const panels=[...document.querySelectorAll('[data-ink-panel]')];
  const seen=new WeakSet();
  const active=new Map();
  const blooms=new Map();
  const canAnimate=!!Element.prototype.animate && 'IntersectionObserver' in window;
  const isDay=()=>root.dataset.theme==='light';
  const radii=[1,.76,1.16,.91,1.24,.72,1.1,.86,1.21,.79,1.08,.74,1.19,.88,1.12,.73,1.2,.83,1.06,.77,1.14,.87,1.18,.8];
  let panelObserver,chapterObserver;

  function finish(panel) {
    seen.add(panel);
    panel.classList.add('ink-seen');
    panel.dataset.inkState='done';
    active.get(panel)?.cancel();
    active.delete(panel);
    panelObserver?.unobserve(panel);
  }
  function finishAll() {
    panels.forEach(finish);
    blooms.forEach(animation=>animation.cancel());
    blooms.clear();
    root.classList.remove('blue-ink-boot');
  }
  function shape(box,radius) {
    const cx=Math.min(90,box.width*.09),cy=Math.min(68,box.height*.32);
    return 'polygon('+radii.map((weight,i)=>{
      const angle=i/radii.length*Math.PI*2;
      return `${(cx+Math.cos(angle)*radius*weight).toFixed(1)}px ${(cy+Math.sin(angle)*radius*weight).toFixed(1)}px`;
    }).join(',')+')';
  }
  function reveal(panel,delay=0) {
    if(seen.has(panel)||panel.hidden) return;
    if(!isDay()||reduce.matches||!canAnimate) { finish(panel); return; }
    seen.add(panel);
    panel.classList.add('ink-seen');
    panel.dataset.inkState='revealing';
    panelObserver?.unobserve(panel);
    const box=panel.getBoundingClientRect();
    const radius=Math.hypot(box.width,box.height)/.65+20;
    const duration=panel.dataset.inkPanel==='heading'?1600:1900;
    try {
      const animation=panel.animate([
        {clipPath:shape(box,2),offset:0},
        {clipPath:shape(box,radius*.13),offset:.25},
        {clipPath:shape(box,radius*.52),offset:.67},
        {clipPath:shape(box,radius),offset:1}
      ],{duration,delay,easing:'cubic-bezier(.2,.58,.25,1)',fill:'backwards'});
      active.set(panel,animation);
      animation.finished.then(()=>{if(active.get(panel)===animation)finish(panel);}).catch(()=>{});
    } catch (_) { finish(panel); }
  }
  function updateVisible(animate=true) {
    let stagger=0;
    panels.forEach(panel=>{
      if(seen.has(panel)||panel.hidden) return;
      const r=panel.getBoundingClientRect();
      if(r.top<innerHeight-20&&r.bottom>80) {
        if(animate) reveal(panel,Math.min(stagger++*75,225));
        else finish(panel);
      }
    });
  }
  const chapters=[...document.querySelectorAll('main > section')];
  const chapterState=new WeakMap();
  function bloom(chapter) {
    if(!isDay()||reduce.matches||!canAnimate) return;
    const state=chapterState.get(chapter);
    if(!state) return;
    const now=performance.now();
    if(now-state.last<1100) return;
    state.last=now;
    blooms.get(chapter)?.cancel();
    const animation=state.ink.animate([
      {opacity:0,transform:'scale(.03,.08) rotate(-14deg)'},
      {opacity:.23,transform:'scale(.48,.8) rotate(-5deg)',offset:.26},
      {opacity:.13,transform:'scale(1.04,1.16) rotate(0deg)',offset:.65},
      {opacity:0,transform:'scale(1.16,1.28) rotate(0deg)'}
    ],{duration:2200,easing:'cubic-bezier(.2,.58,.25,1)'});
    blooms.set(chapter,animation);
    animation.finished.then(()=>{if(blooms.get(chapter)===animation)blooms.delete(chapter);}).catch(()=>{});
  }
  document.querySelectorAll('.paper-thumb').forEach(thumb=>{
    const edge=document.createElement('span');edge.className='paper-lift';edge.setAttribute('aria-hidden','true');thumb.append(edge);
  });
  chapters.forEach(chapter=>{
    const field=document.createElement('span');field.className='chapter-ink-field';field.setAttribute('aria-hidden','true');
    const ink=document.createElement('span');ink.className='chapter-ink';field.append(ink);chapter.append(field);
    chapterState.set(chapter,{ink,last:-Infinity,inside:false});
  });
  if(canAnimate) {
    panelObserver=new IntersectionObserver(entries=>{
      let stagger=0;
      entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top).forEach(entry=>reveal(entry.target,Math.min(stagger++*75,225)));
    },{threshold:0,rootMargin:'-70px 0px -7% 0px'});
    panels.forEach(panel=>panelObserver.observe(panel));
    chapterObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const state=chapterState.get(entry.target);
        if(entry.isIntersecting&&!state.inside) bloom(entry.target);
        state.inside=entry.isIntersecting;
      });
    },{threshold:0,rootMargin:'-76px 0px -30% 0px'});
    chapters.forEach(chapter=>chapterObserver.observe(chapter));
    root.classList.add('blue-ink-ready');
    updateVisible();
  } else finishAll();

  // Interrupted filters must keep already revealed rows intact.
  document.addEventListener('publications:before-filter',()=>[...active.keys()].forEach(finish));
  document.addEventListener('publications:filtered',()=>updateVisible());
  document.addEventListener('focusin',event=>{
    const panel=event.target.closest('[data-ink-panel]');
    if(panel) finish(panel);
  });
  new MutationObserver(()=>{
    if(!isDay()) { [...active.keys()].forEach(finish);blooms.forEach(animation=>animation.cancel());blooms.clear(); }
    else updateVisible(false);
  }).observe(root,{attributes:true,attributeFilter:['data-theme']});
  addEventListener('resize',()=>{[...active.keys()].forEach(finish);updateVisible(false);},{passive:true});
  addEventListener('beforeprint',finishAll);
  addEventListener('pagehide',()=>{[...active.keys()].forEach(finish);blooms.forEach(animation=>animation.cancel());blooms.clear();});
  reduce.addEventListener('change',()=>{if(reduce.matches)finishAll();});
})();
