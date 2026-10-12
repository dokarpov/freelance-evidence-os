/* RILATU — synthetic freelance evidence record, purpose-specific review and motion.
   Links are illustrative; no uploads, formal verification, backend or tax calculations. */
(()=>{'use strict';
const profiles={
 income:{
  code:'01 / INCOME',subtitle:'PURPOSE / INCOME SUMMARY · ILLUSTRATIVE',
  title:'Three records. One traceable payment.',
  mapping:'Agreement, April invoice and matching payment for €3,200',
  check:'Identity, reference, amount and source authenticity',
  missing:'Additional months and independent validation',
  next:'Match further months and validate the underlying documents before describing regular income.',
  note:'The example connects one billed month to one payment. It cannot establish recurring income.',
  context:'Income summary / one month of linked source records',
  gap:'Only one payment month; income continuity not established'
 },
 rental:{
  code:'02 / RENTAL',subtitle:'PURPOSE / RENTAL APPLICATION · ILLUSTRATIVE',
  title:'A landlord asks: how reliable is the income?',
  mapping:'Client agreement, €3,200 invoice and one corresponding payment',
  check:'Recent income history and the landlord’s actual requirements',
  missing:'Further months, identity checks and recipient criteria',
  next:'Add more recent payment periods, then prepare a tailored summary for the recipient to review.',
  note:'A rental provider may request other documents. This sample cannot guarantee acceptance.',
  context:'Rental application / supporting income documentation',
  gap:'Insufficient historical payment evidence to demonstrate regularity'
 },
 residency:{
  code:'03 / RESIDENCY',subtitle:'PURPOSE / RESIDENCY PREPARATION · ILLUSTRATIVE',
  title:'Can your professional activity be documented?',
  mapping:'A contract, one issued invoice and a related transfer',
  check:'Applicable immigration route and official document checklist',
  missing:'Ongoing activity evidence, eligibility and country-specific requirements',
  next:'Confirm the applicable official checklist, then collect the missing periods and supporting records.',
  note:'This is not immigration advice or a visa eligibility assessment. The requirements depend on the jurisdiction.',
  context:'Residency preparation / work-history evidence',
  gap:'Official requirements and continued activity remain unverified'
 }
};
const records={
 contract:{label:'AGREEMENT / FACT',text:'The synthetic agreement states a €3,200 monthly retainer for April–September. It does not establish that every month was paid.'},
 invoice:{label:'INVOICE / FACT',text:'Invoice SN-048 records €3,200 billed for April. The invoice alone is not evidence that money was received.'},
 payment:{label:'PAYMENT / FACT',text:'The synthetic transfer shows €3,200 with reference SN-048 on 06 May. The amount and reference match the invoice, but authenticity has not been checked.'}
};
const $=id=>document.getElementById(id);
const buttons=[...document.querySelectorAll('[data-country]')];
const recordButtons=[...document.querySelectorAll('[data-record]')];
let purpose='income',reviewedTrail=false,switchedTimer=null;
function updateNudge(){
 const el=$('journeyNudge');
 const instruction=$('evidenceTrail').hidden?
 (reviewedTrail?'Compare another purpose or export the synthetic review as JSON.':'Open the evidence trail to see exactly which records support this review.'):
 'You can now see the source-to-claim chain. Compare another purpose or export the sample.';
 el.innerHTML='<span>YOUR NEXT STEP</span> '+instruction;
}
function render(animate=false){
 const p=profiles[purpose];
 buttons.forEach(btn=>{
  const selected=btn.dataset.country===purpose;
  btn.classList.toggle('is-active',selected);
  btn.setAttribute('aria-pressed',String(selected));
 });
 $('reviewCode').textContent=p.code;
 $('interpretationSubtitle').textContent=p.subtitle;
 $('interpretationTitle').textContent=p.title;
 $('mappingText').textContent=p.mapping;
 $('checkText').textContent=p.check;
 $('missingText').textContent=p.missing;
 $('nextAction').textContent=p.next;
 $('interpretationNote').textContent=p.note;
 $('trailContext').textContent=p.context;
 $('trailGap').textContent=p.gap;
 $('countryIndicator').style.setProperty('--route',String(['income','rental','residency'].indexOf(purpose)));
 updateNudge();
 if(animate&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  const panel=$('reviewDynamic'),sources=$('sourceSheet');
  panel.classList.remove('is-switching');sources.classList.remove('is-tracing');
  void panel.offsetWidth;
  panel.classList.add('is-switching');sources.classList.add('is-tracing');
  clearTimeout(switchedTimer);
  switchedTimer=setTimeout(()=>{panel.classList.remove('is-switching');sources.classList.remove('is-tracing')},620);
 }
}
const guideStages={
 1:{title:'What do you need to prove?',desc:"Choose a purpose to begin. We'll show one decision at a time."},
 2:{title:'Which records support it?',desc:'Explore the agreement, invoice and payment. Select a record to see exactly what it establishes.'},
 3:{title:'What does the evidence show?',desc:'Review what can be connected, which checks are missing, and the next step.'}
};
let guidedStep=1,hasChosenPurpose=false;
function setGuidedStep(step,moveFocus=false){
 guidedStep=Math.max(1,Math.min(3,step));
 const workspace=document.querySelector('.workspace');
 workspace.dataset.step=String(guidedStep);
 $('guidedCount').textContent=String(guidedStep).padStart(2,'0')+' / 03';
 $('stepTitle').textContent=guideStages[guidedStep].title;
 $('stepDesc').textContent=guideStages[guidedStep].desc;
 for(const el of document.querySelectorAll('[data-step-marker]'))el.classList.toggle('is-current',Number(el.dataset.stepMarker)===guidedStep);
 $('demoBack').hidden=guidedStep===1;
 $('demoNext').hidden=guidedStep===1;
 $('demoNext').innerHTML=guidedStep===2?'See what it proves <span aria-hidden="true">&rarr;</span>':'Compare another purpose <span aria-hidden="true">&rarr;</span>';
 if(guidedStep===1 && !hasChosenPurpose){for(const btn of buttons){btn.classList.remove('is-active');btn.setAttribute('aria-pressed','false')}}
 if(moveFocus)$('stepTitle').focus({preventScroll:true});
}
buttons.forEach(btn=>btn.addEventListener('click',()=>{hasChosenPurpose=true;purpose=btn.dataset.country;render(true);setGuidedStep(2,true)}));
$('demoBack').addEventListener('click',()=>setGuidedStep(guidedStep-1,true));
$('demoNext').addEventListener('click',()=>setGuidedStep(guidedStep===3?1:guidedStep+1,true));

recordButtons.forEach(btn=>btn.addEventListener('click',()=>{
 const key=btn.dataset.record;
 recordButtons.forEach(other=>{const selected=other===btn;other.classList.toggle('is-inspected',selected);other.setAttribute('aria-pressed',String(selected))});
 $('recordInspectLabel').textContent=records[key].label;
 $('recordInspectText').textContent=records[key].text;
 const inspector=$('recordInspector');inspector.classList.remove('is-updating');void inspector.offsetWidth;inspector.classList.add('is-updating');
}));
$('trailToggle').addEventListener('click',()=>{
 const open=$('evidenceTrail').hidden;
 $('evidenceTrail').hidden=!open;
 $('trailToggle').setAttribute('aria-expanded',String(open));
 $('trailToggle').firstChild.textContent=open?'Hide evidence trail ':'View evidence trail ';
 if(open)reviewedTrail=true;
 updateNudge();
});
$('exportButton').addEventListener('click',()=>{
 const p=profiles[purpose];
 const result={
  kind:'rilatu-synthetic-work-evidence',schema_version:'2.0',
  demo_only:true,independently_verified:false,
  disclaimer:'Synthetic concept data, not a verified proof-of-income, eligibility or tax determination.',
  sources:[
   {id:'contract',kind:'agreement',counterparty:'Studio North',retainer_eur:3200,term:'2026-04 to 2026-09',synthetic:true},
   {id:'invoice',kind:'invoice',reference:'SN-048',period:'2026-04',amount_eur:3200,synthetic:true},
   {id:'payment',kind:'transfer',reference:'SN-048',date:'2026-05-06',amount_eur:3200,synthetic:true}
  ],
  links:[{from:'invoice',to:'payment',method:'same-reference-and-amount',status:'illustrative-match'}],
  selected_purpose:purpose,
  review:{known:p.mapping,key_check:p.check,missing:p.missing,next_step:p.next,explanation:p.note,outcome:'requires-independent-review'},
  exported_at_utc:new Date().toISOString()
 };
 const blob=new Blob([JSON.stringify(result,null,2)+'\n'],{type:'application/json'});
 const url=URL.createObjectURL(blob),anchor=document.createElement('a');
 anchor.href=url;anchor.download='rilatu-sample-'+purpose+'.json';
 document.body.appendChild(anchor);anchor.click();anchor.remove();
 $('exportFeedback').textContent='Sample JSON download requested. These are synthetic, not verified, records.';
 $('exportButton').setAttribute('aria-describedby','exportFeedback');
 reviewedTrail=true;updateNudge();
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
setGuidedStep(1);
})();