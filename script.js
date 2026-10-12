/* Freelance Evidence OS — a self-contained, intentionally non-filing demo.
   All classification text is editorial and conditional, never a tax determination. */
(() => {
  'use strict';
  const profiles = {
    es: {
      code: 'ES / REVIEW 01', subtitle: 'SPAIN / AUTÓNOMO · ILLUSTRATIVE',
      title: 'A business expense? <em>Show the link.</em>',
      mapping: 'Potential professional service expense',
      check: 'Business use, valid invoice, and VAT entitlement',
      missing: 'Supplier details and actual business use',
      note: 'Deductibility depends on business purpose and documentation. Input VAT has separate conditions; this sample does not establish any VAT rate or refund.',
      context: 'Spain / autónomo (specific tax regime not established)',
      url: 'https://sede.agenciatributaria.gob.es/Sede/iva/que-iva-soportado-puedo-deducir/que-puedo-deducir.html'
    },
    de: {
      code: 'DE / REVIEW 02', subtitle: 'GERMANY / SELF-EMPLOYED · ILLUSTRATIVE',
      title: 'An expense on record. <em>What qualifies?</em>',
      mapping: 'Potential Betriebsausgabe / EÜR record',
      check: 'Business purpose, invoice evidence, VAT regime',
      missing: 'Supplier VAT details and Kleinunternehmer status',
      note: 'Business-expense recognition and input VAT deduction are separate checks. A small-business VAT exemption can affect input VAT eligibility.',
      context: 'Germany / self-employed; VAT regime unconfirmed',
      url: 'https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerarten/Umsatzsteuer/Umsatzsteuer_Anwendungserlass/umsatzsteuer_anwendungserlass.html'
    },
    fr: {
      micro: {
        code: 'FR / REVIEW 03', subtitle: 'FRANCE / MICRO-BNC · ILLUSTRATIVE',
        title: 'Keep the proof. <em>Not a real-cost deduction.</em>',
        mapping: 'Document retained; actual expense not deducted under micro-BNC',
        check: 'Confirm micro-BNC status and separate VAT regime',
        missing: 'Taxpayer regime and supplier VAT details',
        note: 'Under micro-BNC, taxable profit uses a standard allowance rather than deducting each actual cost. VAT treatment depends on a separate VAT regime.',
        context: 'France / micro-BNC; VAT regime unconfirmed',
        url: 'https://www.impots.gouv.fr/professionnel/questions/je-suis-micro-entrepreneur-puis-je-deduire-des-charges'
      },
      real: {
        code: 'FR / REVIEW 03', subtitle: 'FRANCE / RÉGIME RÉEL · ILLUSTRATIVE',
        title: 'A possible cost. <em>Evidence first.</em>',
        mapping: 'Potential charge professionnelle, subject to evidence',
        check: 'Business relevance, recordkeeping, tax/VAT regime',
        missing: 'Invoice validity, actual use, and VAT status',
        note: 'Under a real-cost income-tax regime, substantiated business expenses may be deductible. Input VAT is a separate determination; nothing is calculated automatically.',
        context: 'France / régime réel; VAT regime unconfirmed',
        url: 'https://www.impots.gouv.fr/professionnel/questions/que-puis-je-deduire-de-mes-resultats-professionnels'
      }
    }
  };
  let country = 'es';
  let regime = 'micro';
  const $ = id => document.getElementById(id);
  const buttons = Array.from(document.querySelectorAll('[data-country]'));
  const regimeButtons = Array.from(document.querySelectorAll('[data-regime]'));
  const plainText = html => html.replace(/<[^>]*>/g, '');
  function current() { return country === 'fr' ? profiles.fr[regime] : profiles[country]; }
  function render() {
    const p = current();
    buttons.forEach(btn => {
      const selected = btn.dataset.country === country;
      btn.classList.toggle('is-selected', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
    regimeButtons.forEach(btn => {
      const selected = btn.dataset.regime === regime;
      btn.classList.toggle('is-active', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
    $('regimeControl').hidden = country !== 'fr';
    $('reviewCode').textContent = p.code;
    $('interpretationSubtitle').textContent = p.subtitle;
    // The title markup comes exclusively from this local, static, developer-authored object.
    $('interpretationTitle').innerHTML = p.title;
    $('mappingText').textContent = p.mapping;
    $('checkText').textContent = p.check;
    $('missingText').textContent = p.missing;
    $('interpretationNote').textContent = p.note;
    $('trailContext').textContent = p.context;
    $('sourceLink').href = p.url;
  }
  buttons.forEach(btn => btn.addEventListener('click', () => {
    country = btn.dataset.country;
    render();
  }));
  regimeButtons.forEach(btn => btn.addEventListener('click', () => {
    regime = btn.dataset.regime;
    render();
  }));
  $('trailToggle').addEventListener('click', () => {
    const open = $('evidenceTrail').hidden;
    $('evidenceTrail').hidden = !open;
    $('trailToggle').setAttribute('aria-expanded', String(open));
    $('trailToggle').textContent = open ? 'Hide evidence trail' : 'View evidence trail';
  });
  $('exportButton').addEventListener('click', () => {
    const p = current();
    const review = {
      kind: 'illustrative-evidence-review',
      schema_version: '1.0',
      demo_only: true,
      not_tax_advice: true,
      disclaimer: 'Synthetic record. For illustration only. Does not calculate, establish deductibility, or prepare or file taxes.',
      source: { reference: 'FE-0048', synthetic: true, issuer: 'Studio North', invoice_number: '2026-048', date: '2026-10-08', item: 'Design software subscription', document_total_eur: 340, vat_details: null },
      review_context: p.context,
      review: { question: plainText(p.title), mapping: p.mapping, key_check: p.check, not_determined: p.missing, explanation: p.note, status: 'requires-qualified-review' },
      authority_reference: p.url,
      generated_at_utc: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(review, null, 2) + '\n'], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidence-os-sample-${country}${country === 'fr' ? '-' + regime : ''}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  });
  const meter = $('scrollMeter');
  let ticking = false;
  function updateMeter() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    meter.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateMeter); } }, {passive:true});
  window.addEventListener('resize', updateMeter, {passive:true});
  render(); updateMeter();
})();


/* Motion direction: visible energy, calm controls, no layout shift.
   Decorative motion disabled for reduced-motion and coarse pointers. */
(() => {
 'use strict';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const hero=document.querySelector('.hero-art');
 const review=document.querySelector('.review-pane');
 const buttons=document.querySelectorAll('[data-country], [data-regime]');
 if(review){
   const city={es:'SPAIN',de:'GERMANY',fr:'FRANCE'};
   let switchTimer;
   buttons.forEach(btn=>btn.addEventListener('click',()=>{
     const active=document.querySelector('[data-country].is-selected');
     const code=active?.dataset.country||'es';
     review.dataset.country=code;
     const label=document.getElementById('reviewRouteCity');
     if(label) label.textContent=city[code];
     review.classList.remove('review-switching');
     // Restart only the interpretation animation, not the source document.
     void review.offsetWidth;
     review.classList.add('review-switching');
     window.clearTimeout(switchTimer);
     switchTimer=window.setTimeout(()=>review.classList.remove('review-switching'),630);
   }));
 }
 if(!reduced && 'IntersectionObserver' in window){
   document.documentElement.classList.add('motion-ready');
   const observer=new IntersectionObserver(entries=>{
     entries.forEach(entry=>{
       if(entry.isIntersecting){
         entry.target.classList.add('is-visible');
         observer.unobserve(entry.target);
       }
     });
   },{threshold:.08,rootMargin:'0px 0px -25px 0px'});
   document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
 } else {
   document.querySelectorAll('[data-reveal]').forEach(el=>el.classList.add('is-visible'));
 }
 if(hero&&!reduced&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
   let aimX=0,aimY=0,atX=0,atY=0,animating=false;
   const ease=.065;
   const tick=()=>{
     atX+=(aimX-atX)*ease;atY+=(aimY-atY)*ease;
     hero.style.setProperty('--pointer-x',atX.toFixed(2)+'px');
     hero.style.setProperty('--pointer-y',atY.toFixed(2)+'px');
     const drifting=Math.abs(aimX-atX)+Math.abs(aimY-atY)>.2;
     if(drifting)requestAnimationFrame(tick);else animating=false;
   };
   const kick=()=>{if(!animating){animating=true;requestAnimationFrame(tick)}};
   hero.addEventListener('pointermove',e=>{
     const rect=hero.getBoundingClientRect();
     aimX=((e.clientX-rect.left)/rect.width-.5)*22;
     aimY=((e.clientY-rect.top)/rect.height-.5)*17;
     kick();
   },{passive:true});
   hero.addEventListener('pointerleave',()=>{aimX=0;aimY=0;kick()});
 }
})();
