const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const origin='http://127.0.0.1:8765/';
const widths=[320,375,390,768,1024,1360,1440,1920];
const purposes=['income','rental','residency'];
const records=['contract','invoice','payment'];
async function screenshotFromTop(page,path){
 await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0)});
 await expect.poll(()=>page.evaluate(()=>Math.round(window.scrollY))).toBe(0);
 await page.screenshot({path,fullPage:true,animations:'disabled'});
}


async function openAt(browser,width,reducedMotion='reduce'){
 const context=await browser.newContext({viewport:{width,height:width===1360?696:900},reducedMotion,acceptDownloads:true});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin,{waitUntil:'domcontentloaded'});
 return {page,context,errors};
}
async function step(page,n){
 await expect(page.locator('.workspace')).toHaveAttribute('data-step',String(n));
 await expect(page.locator('[data-step-marker].is-current')).toHaveAttribute('data-step-marker',String(n));
 await expect(page.locator('#guidedCount')).toHaveText('0'+n+' / 03');
}
async function choose(page,purpose){
 await step(page,1);
 await page.locator('[data-country="'+purpose+'"]').click();
 await step(page,2);
 await expect(page.locator('[data-country="'+purpose+'"]')).toHaveAttribute('aria-pressed','true');
}
async function inspect(page,record){
 await page.locator('[data-record="'+record+'"]').click();
 await expect(page.locator('[data-record="'+record+'"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.record.is-inspected')).toHaveCount(1);
 const text=await page.locator('#recordInspectText').innerText();
 expect(text.length).toBeGreaterThan(25);
}
async function seeReview(page,purpose){
 await step(page,2);
 await page.locator('#demoNext').click();
 await step(page,3);
 await expect(page.locator('#reviewCode')).toContainText(purpose.toUpperCase());
 await expect(page.locator('#reviewOutcome')).toContainText('Linked, not certified');
 await expect(page.locator('#nextAction')).not.toBeEmpty();
}
async function measure(page){
 return page.evaluate(()=>{
  const vw=innerWidth,bad=[];
  const checks=['.site-header','.hero h1','.hero-actions','.workspace','.guided-head','.guided-progress','.review-panel','.source-panel','.record-stack','.review-buttons','.closing h2'];
  for(const s of checks){
   const el=document.querySelector(s);if(!el)continue;
   if(getComputedStyle(el).display==='none')continue;
   const r=el.getBoundingClientRect();
   if(r.width>0 && (r.left< -3 || r.right>vw+3))bad.push(s+': '+Math.round(r.left)+'..'+Math.round(r.right));
  }
  if(document.documentElement.scrollWidth>vw+2)bad.push('document horizontal overflow');
  for(const el of document.querySelectorAll('.hero-line'))if(el.scrollWidth>el.clientWidth+3)bad.push('cropped hero line');
  return bad;
 });
}
for(const width of widths){
 test('guided UX + responsive layout '+width,async({browser})=>{
  const {page,context,errors}=await openAt(browser,width);
  try{
   await step(page,1);
   await expect(page.locator('.country.is-active')).toHaveCount(0);
   await expect(page.locator('.source-panel')).toBeHidden();
   await expect(page.locator('#reviewDynamic')).toBeHidden();
   await expect(page.locator('.countries')).toBeVisible();
   await expect(page.locator('#demoNext')).toBeHidden();
   await expect(page.locator('[data-country]')).toHaveCount(3);
   expect(await measure(page)).toEqual([]);
   await screenshotFromTop(page,'test-results/rilatu-'+width+'.png');
   await choose(page,'rental');
   await expect(page.locator('.source-panel')).toBeVisible();
   await expect(page.locator('.review-panel')).toBeHidden();
   if([320,375,768,1360,1920].includes(width)) await screenshotFromTop(page,'test-results/rilatu-'+width+'-inspect.png');
   const original=await page.locator('#sourceSheet').textContent();
   for(const record of records) await inspect(page,record);
   expect(await page.locator('#sourceSheet').textContent()).toBe(original);
   expect(await measure(page)).toEqual([]);
   await seeReview(page,'rental');
   await expect(page.locator('#reviewDynamic')).toBeVisible();
   await expect(page.locator('.source-panel')).toBeHidden();
   if([320,375,768,1360,1920].includes(width)) await screenshotFromTop(page,'test-results/rilatu-'+width+'-review.png');
   await page.locator('#trailToggle').click();
   await expect(page.locator('#evidenceTrail')).toBeVisible();
   await expect(page.locator('#trailContext')).toContainText('Rental');
   await page.locator('#trailToggle').click();
   await expect(page.locator('#evidenceTrail')).toBeHidden();
   expect(await measure(page)).toEqual([]);
   await page.locator('#demoNext').click();
   await step(page,1);
   await choose(page,'residency');
   expect(await page.locator('#sourceSheet').textContent()).toBe(original);
   await seeReview(page,'residency');
   await expect(page.locator('#nextAction')).toContainText('official');
   expect(errors).toEqual([]);
  }finally{await context.close()}
 });
}
test('navigation has distinct destinations and no public source links',async({page})=>{
 await page.goto(origin);
 await expect(page.locator('.nav-cta')).toHaveAttribute('href','#method');
 await expect(page.locator('.solid-link')).toHaveAttribute('href','#demo');
 await expect(page.locator('a[href*="github.com"]')).toHaveCount(0);
 await expect(page.locator('a[href="#demo"]')).not.toHaveCount(0);
});
test('static editorial rows do not pretend to be interactive controls',async({page})=>{
 await page.goto(origin);
 const row=page.locator('.question').first();
 const before=await row.evaluate(el=>({x:el.getBoundingClientRect().x,cursor:getComputedStyle(el).cursor}));
 await row.hover();
 await page.waitForTimeout(500);
 const after=await row.evaluate(el=>({x:el.getBoundingClientRect().x,cursor:getComputedStyle(el).cursor}));
 expect(Math.abs(after.x-before.x)).toBeLessThan(0.5);
 expect(before.cursor).not.toBe('pointer');
 expect(after.cursor).not.toBe('pointer');
 await expect(row.locator('button,a')).toHaveCount(0);
});
test('evidence export reflects selected review and declares it synthetic',async({browser})=>{
 const {page,context}=await openAt(browser,1360);
 try{
  await choose(page,'residency');
  await seeReview(page,'residency');
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#exportButton').click()]);
  expect(download.suggestedFilename()).toBe('rilatu-sample-residency.json');
  const payload=JSON.parse(await fs.readFile(await download.path(),'utf8'));
  expect(payload.selected_purpose).toBe('residency');
  expect(payload.sources).toHaveLength(3);
  expect(payload.links).toContainEqual(expect.objectContaining({from:'invoice',to:'payment',status:'illustrative-match'}));
  expect(payload.demo_only).toBe(true);
  expect(payload.independently_verified).toBe(false);
 }finally{await context.close()}
});
test('keyboard, back navigation, resize, and reload reset predictably',async({browser})=>{
 const {page,context,errors}=await openAt(browser,1360,'no-preference');
 try{
  await page.locator('[data-country="income"]').focus();
  await page.keyboard.press('Enter');
  await step(page,2);
  await page.locator('[data-record="payment"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#recordInspectLabel')).toContainText('PAYMENT');
  await page.locator('#demoNext').click();
  await step(page,3);
  await page.locator('#demoBack').click();
  await step(page,2);
  await page.locator('#demoBack').click();
  await step(page,1);
  await page.setViewportSize({width:390,height:844});
  await choose(page,'income');
  await seeReview(page,'income');
  await page.reload();
  await step(page,1);
  expect(errors).toEqual([]);
 }finally{await context.close()}
});
test('reduced-motion preserves exclusive source selection',async({browser})=>{
 const {page,context}=await openAt(browser,375,'reduce');
 try{
  await choose(page,'income');
  for(const chosen of records){
   await inspect(page,chosen);
   const stripes=await page.locator('[data-record]').evaluateAll(els=>els.map(el=>({
    name:el.dataset.record,
    pressed:el.getAttribute('aria-pressed')==='true',
    scale:new DOMMatrixReadOnly(getComputedStyle(el,'::before').transform).d
   })));
   stripes.forEach(s=>{expect(s.pressed).toBe(s.name===chosen);expect(s.scale).toBeCloseTo(s.name===chosen?1:0,3)});
  }
  await seeReview(page,'income');
  const el=page.locator('#reviewDynamic');
  expect(await el.evaluate(node=>getComputedStyle(node).opacity)).toBe('1');
 }finally{await context.close()}
});
test('method phrase does not break internally at 320px',async({browser})=>{
 const {page,context}=await openAt(browser,320);
 try{
  const phrase=page.locator('.method .display span');
  await phrase.scrollIntoViewIfNeeded();
  await expect(phrase).toHaveText('Hand over.');
  const rect=await phrase.boundingBox();
  expect(rect.x).toBeGreaterThanOrEqual(0);
  expect(rect.x+rect.width).toBeLessThanOrEqual(321);
 }finally{await context.close()}
});
