/* RILATU — synthetic review, provenance and motion.
   No uploads, tracking, backend calls or invented tax calculations. */
(()=>{'use strict';
  const profiles = {
    es: {
      code: 'ES / REVIEW 01', subtitle: 'SPAIN / AUTÓNOMO · ILLUSTRATIVE',
      title: 'A business expense? <em>Show the link.</em>',
      mapping: 'Potential professional service expense',
      check: 'Business use, valid invoice, and VAT entitlement',
      missing: 'Supplier details and actual business use',
      next: 'Confirm that the subscription was for the business and request complete supplier invoice details.',
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
      next: 'Check supplier invoice details and confirm the business and VAT circumstances with a German adviser.',
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
        next: 'Confirm that micro-BNC applies; keep the invoice as evidence rather than claiming an actual-cost income-tax deduction.',
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
        next: 'Verify business use, invoice validity and the actual income-tax and VAT regimes before any treatment is decided.',
        note: 'Under a real-cost income-tax regime, substantiated business expenses may be deductible. Input VAT is a separate determination; nothing is calculated automatically.',
        context: 'France / régime réel; VAT regime unconfirmed',
        url: 'https://www.impots.gouv.fr/professionnel/questions/que-puis-je-deduire-de-mes-resultats-professionnels'
      }
    }
  };

let country='es',regime='micro';
const $=id=>document.getElementById(id);
const buttons=[...document.querySelectorAll('[data-country]')];
const regimeButtons=[...document.querySelectorAll('[data-regime]')];
const plain=html=>html.replace(/<[^>]*>/g,'');
const current=()=>country==='fr'?profiles.fr[regime]:profiles[country];
let switchedTimer=null;
let reviewedTrail=false;
function updateNudge(){
 const nudge=$('journeyNudge');
 if(!nudge)return;
 const detail=$('evidenceTrail').hidden;
 nudge.innerHTML='<span>YOUR NEXT STEP</span> '+(detail?(reviewedTrail?'Compare another country or export the synthetic review as JSON.':'Open the evidence trail to see the source, missing facts and reasoning.'):'You can now trace the reasoning. Compare another country or export the synthetic example.');
}
function render(animate=false){
 const p=current();
 for(const btn of buttons){const selected=btn.dataset.country===country;btn.classList.toggle('is-active',selected);btn.setAttribute('aria-pressed',String(selected))}
 for(const btn of regimeButtons){const selected=btn.dataset.regime===regime;btn.classList.toggle('is-active',selected);btn.setAttribute('aria-pressed',String(selected))}
 $('regimeControl').hidden=country!=='fr';
 $('reviewCode').textContent=p.code;
 $('interpretationSubtitle').textContent=p.subtitle;
 $('interpretationTitle').textContent=plain(p.title);
 $('mappingText').textContent=p.mapping;
 $('checkText').textContent=p.check;
 $('missingText').textContent=p.missing;
 $('interpretationNote').textContent=p.note;
 $('nextAction').textContent=p.next;
 updateNudge();
 $('trailContext').textContent=p.context;
 $('sourceLink').href=p.url;
 $('countryIndicator').style.setProperty('--route',String(['es','de','fr'].indexOf(country)));
 // Context-dependent attention belongs on the review, not the immutable source values.
 $('sourceUnknown').classList.toggle('is-referenced',true);
 if(animate){const source=$('sourceSheet');source.classList.remove('fact-trace');void source.offsetWidth;source.classList.add('fact-trace');}
 if(animate && !matchMedia('(prefers-reduced-motion:reduce)').matches){
   const pane=$('reviewDynamic');pane.classList.remove('is-switching');void pane.offsetWidth;pane.classList.add('is-switching');
   clearTimeout(switchedTimer);switchedTimer=setTimeout(()=>{pane.classList.remove('is-switching');$('sourceSheet').classList.remove('fact-trace')},600);
 }
}
for(const btn of buttons)btn.addEventListener('click',()=>{country=btn.dataset.country;render(true)});
for(const btn of regimeButtons)btn.addEventListener('click',()=>{regime=btn.dataset.regime;render(true)});
$('trailToggle').addEventListener('click',()=>{
 const open=$('evidenceTrail').hidden;
 $('evidenceTrail').hidden=!open;
 $('trailToggle').setAttribute('aria-expanded',String(open));
 $('trailToggle').firstChild.textContent=open?'Hide evidence trail ':'View evidence trail ';
 if(open)reviewedTrail=true;
 updateNudge();
});
$('exportButton').addEventListener('click',()=>{
 const p=current();
 const result={
  kind:'rilatu-synthetic-evidence-review',schema_version:'1.0',demo_only:true,not_tax_advice:true,
  disclaimer:'This is synthetic concept data. Not an assessment, deduction determination or tax filing.',
  source:{reference:'FE-0048',synthetic:true,issuer:'Studio North',invoice_number:'2026-048',date:'2026-10-08',description:'Design software subscription',total_eur:340,vat_information:null},
  context:p.context,
  review:{question:plain(p.title),potential_mapping:p.mapping,key_check:p.check,not_determined:p.missing,explanation:p.note,outcome:'requires-qualified-review'},
  official_reference:p.url,exported_at_utc:new Date().toISOString()
 };
 const blob=new Blob([JSON.stringify(result,null,2)+'\n'],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='rilatu-demo-'+country+(country==='fr'?'-'+regime:'')+'.json';
 document.body.appendChild(a);a.click();a.remove();
 const status=$('exportFeedback');
 status.textContent='Download requested — check your browser downloads. This is illustrative data, not a verified report.';
 reviewedTrail=true;updateNudge();
 $('exportButton').setAttribute('aria-describedby','exportFeedback');
 setTimeout(()=>URL.revokeObjectURL(url),1500);
});
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!reduce && 'IntersectionObserver' in window){
 document.documentElement.classList.add('motion-active');
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}}
 },{rootMargin:'0px 0px -20px 0px',threshold:.06});
 for(const el of document.querySelectorAll('[data-reveal]'))observer.observe(el);
}
if(!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){
 const area=document.querySelector('.hero-flight'),paper=document.querySelector('.paper-main');
 let sx=0,sy=0,x=0,y=0,raf=0;
 const step=()=>{x+=(sx-x)*.08;y+=(sy-y)*.08;paper.style.setProperty('--px',x.toFixed(1)+'px');paper.style.setProperty('--py',y.toFixed(1)+'px');raf=(Math.abs(sx-x)+Math.abs(sy-y)>.2)?requestAnimationFrame(step):0};
 function kick(){if(!raf)raf=requestAnimationFrame(step)}
 area.addEventListener('pointermove',e=>{const r=area.getBoundingClientRect();sx=((e.clientX-r.left)/r.width-.5)*17;sy=((e.clientY-r.top)/r.height-.5)*13;kick()},{passive:true});
 area.addEventListener('pointerleave',()=>{sx=0;sy=0;kick()});
}

/* Consistent per-group stagger; scroll values are purely decorative and never block content. */
const staggerGroups=[
  ...document.querySelectorAll('.questions,.steps,.product-heading,.section-main')
];
for(const group of staggerGroups){
 const items=[...group.querySelectorAll(':scope > [data-reveal],:scope > .question[data-reveal],:scope > article[data-reveal]')];
 items.forEach((el,index)=>{ el.style.setProperty('--stagger-index',String(Math.min(index,4))); });
}
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
if(!motionPreference.matches){
 const scenes=[
  ['.hero',(el,p)=>{el.style.setProperty('--hero-shift',(-12*p).toFixed(2)+'px');el.style.setProperty('--flight-x',(p*24).toFixed(2)+'px');el.style.setProperty('--flight-y',(-18*p).toFixed(2)+'px')}],
  ['.method',(el,p)=>el.style.setProperty('--handoff-x',((p-.5)*32).toFixed(2)+'px')],
  ['.statement',(el,p)=>{el.style.setProperty('--curve-x',((p-.5)*36).toFixed(2)+'px');el.style.setProperty('--curve-y',(p*45).toFixed(2)+'px')}],
  ['.closing',(el,p)=>el.style.setProperty('--closing-shift',(-10*p).toFixed(2)+'px')]
 ].map(([selector,paint])=>({el:document.querySelector(selector),paint})).filter(x=>x.el);
 let pending=false;
 const paintScroll=()=>{
  pending=false;
  const vh=Math.max(1,window.innerHeight);
  for(const scene of scenes){
   const r=scene.el.getBoundingClientRect();
   if(r.bottom<0||r.top>vh)continue;
   const progress=Math.min(1,Math.max(0,(vh-r.top)/(vh+r.height)));
   scene.paint(scene.el,progress);
  }
 };
 const requestPaint=()=>{if(!pending){pending=true;requestAnimationFrame(paintScroll)}};
 addEventListener('scroll',requestPaint,{passive:true});
 addEventListener('resize',requestPaint,{passive:true});
 requestPaint();
 motionPreference.addEventListener?.('change',()=>{
  if(motionPreference.matches){
   for(const s of scenes){for(const key of ['--hero-shift','--flight-x','--flight-y','--handoff-x','--curve-x','--curve-y','--closing-shift'])s.el.style.removeProperty(key)}
  }else requestPaint();
 });
}

render();
})();