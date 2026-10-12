const {test,expect}=require('@playwright/test');
const widths=[320,375,390,768,1024,1440];
const origin='http://127.0.0.1:8765/';

for(const width of widths){
 test('responsive layout and legibility at '+width+'px',async({browser})=>{
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
   const page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin,{waitUntil:'domcontentloaded'});
   await expect(page.locator('.hero h1')).toBeVisible();
   await page.screenshot({path:'test-results/rilatu-'+width+'.png',fullPage:true,animations:'disabled'});
   const result=await page.evaluate(()=>{
     const w=innerWidth;
     const targets=['.site-header','.hero h1','.hero-actions','.workspace','.source-page','.review-panel','.countries','.review-buttons','.closing h2'];
     const out=[];
     for(const selector of targets){
       const el=document.querySelector(selector);if(!el)continue;
       const r=el.getBoundingClientRect();
       if(r.width>0 && (r.left<-3||r.right>w+3))out.push(selector+': '+Math.round(r.left)+'..'+Math.round(r.right));
     }
     for(const el of document.querySelectorAll('.hero-line')){
       if(el.scrollWidth>el.clientWidth+3)out.push('cropped hero line: '+el.textContent.trim());
     }
     const sizes={dd:parseFloat(getComputedStyle(document.querySelector('.review-results dd')).fontSize),button:parseFloat(getComputedStyle(document.querySelector('.review-button')).fontSize),country:parseFloat(getComputedStyle(document.querySelector('.country')).fontSize)};
     const targetsHeight=['.country','.review-button','.nav-cta'].map(s=>[s,document.querySelector(s).getBoundingClientRect().height]);
     return {offscreen:out,sizes,targetsHeight};
   });
   expect(result.offscreen).toEqual([]);
   expect(result.sizes.dd).toBeGreaterThanOrEqual(12.9);
   expect(result.sizes.button).toBeGreaterThanOrEqual(12.9);
   expect(result.sizes.country).toBeGreaterThanOrEqual(11.9);
   for(const [name,height] of result.targetsHeight)expect(height,name+' minimum target').toBeGreaterThanOrEqual(43);
   await page.locator('[data-country="fr"]').click();
   await expect(page.locator('#regimeControl')).toBeVisible();
   await page.locator('[data-regime="real"]').click();
   await expect(page.locator('#interpretationSubtitle')).toContainText('RÉGIME RÉEL');
   await page.locator('#trailToggle').click();
   await expect(page.locator('#evidenceTrail')).toBeVisible();
   await page.locator('#trailToggle').click();
   await expect(page.locator('#evidenceTrail')).toBeHidden();
   await page.locator('[data-country="de"]').click();
   await expect(page.locator('#interpretationSubtitle')).toContainText('GERMANY');
   await page.locator('[data-country="es"]').click();
   await expect(page.locator('#interpretationSubtitle')).toContainText('SPAIN');
   expect(errors).toEqual([]);
   await context.close();
 });
}
test('export stays functional',async({page})=>{
 await page.goto(origin);
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#exportButton').click()]);
 expect(download.suggestedFilename()).toBe('rilatu-demo-es.json');
 await expect(page.locator('#exportFeedback')).toContainText('Download requested');
});
test('reduced motion keeps all content visible',async({browser})=>{
 const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:375,height:800}});
 const page=await context.newPage();await page.goto(origin);
 const el=page.locator('#problem-title');
 await el.scrollIntoViewIfNeeded();await expect(el).toBeVisible();
 const opacity=await el.evaluate(e=>getComputedStyle(e).opacity);
 expect(opacity).toBe('1');
 await context.close();
});
