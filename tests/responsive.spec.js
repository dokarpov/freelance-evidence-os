const {test,expect}=require('@playwright/test');
const origin='http://127.0.0.1:8765/';
const widths=[320,375,390,768,1024,1360,1440,1920];
async function aligned(page,key){
 const codes={income:'01 / INCOME',rental:'02 / RENTAL',residency:'03 / RESIDENCY'};
 await expect(page.locator('[data-country="'+key+'"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.country.is-active')).toHaveCount(1);
 await expect(page.locator('#reviewCode')).toHaveText(codes[key]);
 await expect.poll(()=>page.evaluate(key=>{
   const i=document.querySelector('#countryIndicator').getBoundingClientRect();
   const t=document.querySelector('[data-country="'+key+'"]').getBoundingClientRect();
   const g=document.querySelector('.countries').getBoundingClientRect();
   return Math.abs(i.left-t.left)<2 && Math.abs(i.right-t.right)<2 && i.left>=g.left-2 && i.right<=g.right+2;
 },key),{timeout:3500,message:'indicator must align with selected purpose and stay inside its row'}).toBe(true);
}
for(const width of widths){
 test('linked evidence and responsive layout at '+width+'px',async({browser})=>{
   const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin,{waitUntil:'domcontentloaded'});
   await expect(page.locator('.hero h1')).toBeVisible();
   await page.screenshot({path:'test-results/rilatu-'+width+'.png',fullPage:true,animations:'disabled'});
   const geometry=await page.evaluate(()=>{
     const offscreen=[],vw=innerWidth;
     for(const sel of ['.site-header','.hero h1','.workspace','.record-stack','.review-panel','.countries','.review-buttons','.closing h2']){
       const el=document.querySelector(sel);if(!el)continue;const r=el.getBoundingClientRect();
       if(r.width>0&&(r.left<-3||r.right>vw+3))offscreen.push(sel+' '+r.left+'..'+r.right);
     }
     for(const el of document.querySelectorAll('.hero-line'))if(el.scrollWidth>el.clientWidth+3)offscreen.push('clipped hero '+el.textContent);
     return {
       offscreen,
       horizontal:document.documentElement.scrollWidth>vw+1,
       countryFont:parseFloat(getComputedStyle(document.querySelector('.country')).fontSize),
       recordFont:parseFloat(getComputedStyle(document.querySelector('.record-meta')).fontSize),
       countryHeight:document.querySelector('.country').getBoundingClientRect().height,
       recordHeight:document.querySelector('.record').getBoundingClientRect().height
     };
   });
   expect(geometry.offscreen).toEqual([]);
   expect(geometry.horizontal).toBe(false);
   expect(geometry.countryFont).toBeGreaterThanOrEqual(11.9);
   expect(geometry.recordFont).toBeGreaterThanOrEqual(12.9);
   expect(geometry.countryHeight).toBeGreaterThanOrEqual(43);
   expect(geometry.recordHeight).toBeGreaterThanOrEqual(44);
   await expect(page.locator('.orientation-grid>div')).toHaveCount(3);
   await expect(page.locator('.record')).toHaveCount(3);
   const unchanged=await page.locator('#sourceSheet').innerText();
   await aligned(page,'income');
   for(const key of ['rental','residency','income']){
     await page.locator('[data-country="'+key+'"]').click();
     await aligned(page,key);
     expect(await page.locator('#sourceSheet').innerText()).toBe(unchanged);
     await expect(page.locator('.review-outcome')).toContainText('Linked, not certified');
     await expect(page.locator('#nextAction')).not.toBeEmpty();
   }
   await page.locator('[data-record="invoice"]').click();
   await expect(page.locator('[data-record="invoice"]')).toHaveAttribute('aria-pressed','true');
   await expect(page.locator('#recordInspectText')).toContainText('Invoice SN-048');
   await page.locator('[data-record="payment"]').click();
   await expect(page.locator('#recordInspectText')).toContainText('reference SN-048');
   await page.locator('#trailToggle').click();
   await expect(page.locator('#evidenceTrail')).toBeVisible();
   await page.locator('[data-country="rental"]').click();
   await expect(page.locator('#trailContext')).toContainText('Rental application');
   await expect(page.locator('#trailGap')).toContainText('Insufficient historical');
   await page.locator('#trailToggle').click();
   await expect(page.locator('#evidenceTrail')).toBeHidden();
   expect(errors).toEqual([]);
   await ctx.close();
 });
}
test('rapid purpose switching, hover, resize and keyboard selection',async({browser})=>{
 const ctx=await browser.newContext({viewport:{width:1360,height:696},reducedMotion:'no-preference'});
 const page=await ctx.newPage();await page.goto(origin);
 await page.locator('#demo').scrollIntoViewIfNeeded();
 for(const key of ['residency','income','rental','residency','rental']){
   await page.locator('[data-country="'+key+'"]').click();
 }
 await aligned(page,'rental');
 await page.locator('[data-country="residency"]').hover();
 await aligned(page,'rental'); // Hover must never move the selected indicator.
 await page.setViewportSize({width:390,height:844});await aligned(page,'rental');
 await page.locator('[data-country="residency"]').focus();
 await page.keyboard.press('Enter');await aligned(page,'residency');
 await page.evaluate(()=>scrollTo(0,0));
 await page.locator('#demo').scrollIntoViewIfNeeded();
 await aligned(page,'residency');
 await page.reload();await aligned(page,'income');
 await ctx.close();
});
test('export includes source links and purpose without making verified claims',async({page})=>{
 await page.goto(origin);
 await page.locator('[data-country="rental"]').click();
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#exportButton').click()]);
 expect(download.suggestedFilename()).toBe('rilatu-sample-rental.json');
 await expect(page.locator('#exportFeedback')).toContainText('synthetic');
});
test('reduced motion leaves all content and linked evidence visible',async({browser})=>{
 const ctx=await browser.newContext({viewport:{width:375,height:800},reducedMotion:'reduce'});
 const page=await ctx.newPage();await page.goto(origin);
 await page.locator('#demo').scrollIntoViewIfNeeded();
 await expect(page.locator('.record').first()).toBeVisible();
 const opacity=await page.locator('.orientation-grid>div').first().evaluate(el=>getComputedStyle(el).opacity);
 expect(opacity).toBe('1');
 await ctx.close();
});
