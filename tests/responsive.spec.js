const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const origin='http://127.0.0.1:8765/';
const widths=[320,375,390,768,1024,1360,1440,1920];
const purposes=['income','rental','residency'];
const headers={income:'01 / INCOME',rental:'02 / RENTAL',residency:'03 / RESIDENCY'};
const recordKeys=['contract','invoice','payment'];

async function pageAt(browser,width,reducedMotion='reduce'){
 const context=await browser.newContext({viewport:{width,height:width===1360?696:900},reducedMotion,acceptDownloads:true});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin,{waitUntil:'domcontentloaded'});
 return {page,context,errors};
}
async function assertAligned(page,purpose){
 await expect(page.locator('[data-country="'+purpose+'"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.country.is-active')).toHaveCount(1);
 await expect(page.locator('#reviewCode')).toHaveText(headers[purpose]);
 await expect.poll(async()=>page.evaluate(p=>{
  const active=document.querySelector('[data-country="'+p+'"]').getBoundingClientRect();
  const indicator=document.querySelector('.country-indicator i').getBoundingClientRect();
  const parent=document.querySelector('.countries').getBoundingClientRect();
  return Math.abs(active.left-indicator.left)<2 &&
   Math.abs(active.right-indicator.right)<2 &&
   indicator.left>=parent.left-2 && indicator.right<=parent.right+2;
 },purpose),{timeout:3500,message:'active underline must coincide with selected purpose tab'}).toBe(true);
}
async function inspectLayout(page){
 return page.evaluate(()=>{
  const width=window.innerWidth,problems=[];
  const selectors=[
   '.site-header','.hero h1','.hero-actions','.workspace',
   '.source-panel','.record-stack','.review-panel','.countries',
   '.review-buttons','.orientation-grid','.closing h2'
  ];
  for(const selector of selectors){
   const el=document.querySelector(selector);
   if(!el) {problems.push('Missing '+selector);continue}
   const b=el.getBoundingClientRect();
   if(b.width>0&&(b.left< -3||b.right>width+3))problems.push(selector+': '+Math.round(b.left)+'…'+Math.round(b.right));
  }
  for(const el of document.querySelectorAll('.hero-line')){
   if(el.scrollWidth>el.clientWidth+3)problems.push('cropped heading: '+el.textContent.trim());
  }
  if(document.documentElement.scrollWidth>width+2)problems.push('page horizontal overflow');
  const size=s=>parseFloat(getComputedStyle(document.querySelector(s)).fontSize);
  const height=s=>document.querySelector(s).getBoundingClientRect().height;
  return {problems,type:{country:size('.country'),review:size('.review-results dd'),action:size('.review-button')},
   targets:{country:height('.country'),record:height('.record'),cta:height('.nav-cta')}};
 });
}
for(const width of widths){
 test('layout, evidence actions, and indicator at '+width+'px',async({browser})=>{
  const {page,context,errors}=await pageAt(browser,width);
  try{
   await expect(page.locator('.hero h1')).toBeVisible();
   await expect(page.locator('.record')).toHaveCount(3);
   const layout=await inspectLayout(page);
   expect(layout.problems,'layout problems at '+width+'px').toEqual([]);
   expect(layout.type.country).toBeGreaterThanOrEqual(11.9);
   expect(layout.type.review).toBeGreaterThanOrEqual(12.9);
   expect(layout.type.action).toBeGreaterThanOrEqual(12.9);
   for(const [name,height] of Object.entries(layout.targets))expect(height,name+' touch target').toBeGreaterThanOrEqual(43);
   await page.screenshot({path:'test-results/rilatu-'+width+'.png',fullPage:true,animations:'disabled'});
   const sourceText=await page.locator('#sourceSheet').innerText();
   await assertAligned(page,'income');
   for(const purpose of ['rental','residency','income','residency','rental']){
    await page.locator('[data-country="'+purpose+'"]').click();
    await assertAligned(page,purpose);
    expect(await page.locator('#sourceSheet').innerText()).toBe(sourceText);
    await expect(page.locator('#reviewOutcome')).toContainText('Linked, not certified');
   }
   await page.locator('[data-country="residency"]').hover();
   await assertAligned(page,'rental');
   for(const record of recordKeys){
    await page.locator('[data-record="'+record+'"]').click();
    await expect(page.locator('[data-record="'+record+'"]')).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('.record.is-inspected')).toHaveCount(1);
    await expect(page.locator('#recordInspectLabel')).not.toBeEmpty();
   }
   await page.locator('#trailToggle').click();
   await expect(page.locator('#evidenceTrail')).toBeVisible();
   await expect(page.locator('#trailContext')).toContainText('Rental');
   await page.locator('[data-country="income"]').click();
   await expect(page.locator('#trailContext')).toContainText('Income');
   await page.locator('#trailToggle').click();
   await expect(page.locator('#evidenceTrail')).toBeHidden();
   expect(errors).toEqual([]);
  }finally{await context.close()}
 });
}
test('proof export contains matching source links, current purpose, and explicit limits',async({browser})=>{
 const {page,context}=await pageAt(browser,1360);
 try{
  await page.locator('[data-country="residency"]').click();
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#exportButton').click()]);
  expect(download.suggestedFilename()).toBe('rilatu-sample-residency.json');
  const payload=JSON.parse(await fs.readFile(await download.path(),'utf8'));
  expect(payload.selected_purpose).toBe('residency');
  expect(payload.sources).toHaveLength(3);
  expect(payload.links).toContainEqual(expect.objectContaining({from:'invoice',to:'payment',status:'illustrative-match'}));
  expect(payload.demo_only).toBe(true);
  expect(payload.independently_verified).toBe(false);
  await expect(page.locator('#exportFeedback')).toContainText('synthetic');
 }finally{await context.close()}
});
test('keyboard, animated rapid switching, resizing and refresh preserve consistent state',async({browser})=>{
 const {page,context,errors}=await pageAt(browser,1360,'no-preference');
 try{
  for(const p of ['rental','residency','income','rental','residency']){
   await page.locator('[data-country="'+p+'"]').click();
  }
  await assertAligned(page,'residency');
  await page.setViewportSize({width:390,height:844});
  await assertAligned(page,'residency');
  await page.locator('[data-country="income"]').focus();
  await page.keyboard.press('Enter');
  await assertAligned(page,'income');
  await page.locator('[data-record="payment"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#recordInspectLabel')).toContainText('PAYMENT');
  await page.evaluate(()=>scrollTo(0,0));
  await page.locator('#demo').scrollIntoViewIfNeeded();
  await assertAligned(page,'income');
  await page.reload();
  await assertAligned(page,'income');
  expect(errors).toEqual([]);
 }finally{await context.close()}
});
test('reduced motion keeps explanatory sections visible',async({browser})=>{
 const {page,context}=await pageAt(browser,375,'reduce');
 try{
  for(const selector of ['#problem-title','#demo-title','.demo-orientation','#method']){
   const el=page.locator(selector);await el.scrollIntoViewIfNeeded();await expect(el).toBeVisible();
   expect(await el.evaluate(node=>getComputedStyle(node).opacity)).toBe('1');
  }
 }finally{await context.close()}
});

test('method action stays on one line at 320px without overflow',async({browser})=>{
 const {page,context}=await pageAt(browser,320);
 try{
  const action=page.locator('.method .display span');
  await action.scrollIntoViewIfNeeded();
  await expect(action).toHaveText('Hand over.');
  const b=await action.evaluate(node=>{
   const r=node.getBoundingClientRect();
   return {fragments:node.getClientRects().length,left:r.left,right:r.right,width:r.width,viewport:innerWidth};
  });
  expect(b.fragments).toBe(1);
  expect(b.width).toBeGreaterThan(40);
  expect(b.left).toBeGreaterThanOrEqual(0);
  expect(b.right).toBeLessThanOrEqual(b.viewport+1);
 }finally{await context.close()}
});
