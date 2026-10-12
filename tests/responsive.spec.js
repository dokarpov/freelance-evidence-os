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


/* Regression FE-0048: the underline must align with the selected country, not
   escape into the next tab or off the right edge (reported at 1360x696). */
async function expectCountryAligned(page, code) {
  const labels={es:'ES / REVIEW 01',de:'DE / REVIEW 02',fr:'FR / REVIEW 03'};
  await expect(page.locator('[data-country="'+code+'"]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.country.is-active')).toHaveCount(1);
  await expect(page.locator('#reviewCode')).toHaveText(labels[code]);
  await expect.poll(async()=>{
    return page.evaluate(country=>{
      const chosen=document.querySelector('[data-country="'+country+'"]');
      const bar=document.querySelector('.country-indicator i');
      const group=document.querySelector('.countries');
      const a=bar.getBoundingClientRect();
      const b=chosen.getBoundingClientRect();
      const g=group.getBoundingClientRect();
      return {
        aligned:Math.abs(a.left-b.left)<=2 && Math.abs(a.right-b.right)<=2,
        contained:a.left>=g.left-2 && a.right<=g.right+2
      };
    },code);
  },{timeout:3500,message:'underline must match active tab geometry'}).toEqual({aligned:true,contained:true});
}
test('country underline stays on the selected tab at every breakpoint',async({browser})=>{
  for(const width of [320,375,390,768,1024,1360,1440,1920]){
    const context=await browser.newContext({viewport:{width,height:696},reducedMotion:'reduce'});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin);
    await page.locator('#demo').scrollIntoViewIfNeeded();
    await expectCountryAligned(page,'es');
    for(const code of ['de','fr','es','fr','de']){
      await page.locator('[data-country="'+code+'"]').click();
      await expectCountryAligned(page,code);
    }
    await page.locator('[data-country="fr"]').hover();
    await expectCountryAligned(page,'de'); // France hover is not France selection.
    await expect(page.locator('#regimeControl')).toBeHidden();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    expect(errors,'JS errors at '+width+'px').toEqual([]);
    await context.close();
  }
});
test('country underline survives rapid switches, animation, resize, reload and keyboard',async({browser})=>{
  const context=await browser.newContext({viewport:{width:1360,height:696},reducedMotion:'no-preference'});
  const page=await context.newPage();
  await page.goto(origin);
  await page.locator('#demo').scrollIntoViewIfNeeded();
  await page.locator('[data-country="de"]').click();
  await page.locator('[data-country="fr"]').hover();
  await expectCountryAligned(page,'de');
  for(const code of ['fr','es','de','fr','de']){
    await page.locator('[data-country="'+code+'"]').click();
  }
  await expectCountryAligned(page,'de');
  await page.setViewportSize({width:390,height:844});
  await expectCountryAligned(page,'de');
  await page.locator('[data-country="fr"]').focus();
  await page.keyboard.press('Enter');
  await expectCountryAligned(page,'fr');
  await expect(page.locator('#regimeControl')).toBeVisible();
  await page.locator('[data-regime="real"]').click();
  await expect(page.locator('#interpretationSubtitle')).toContainText('RÉGIME RÉEL');
  await expectCountryAligned(page,'fr');
  await page.evaluate(()=>scrollTo(0,0));
  await page.locator('#demo').scrollIntoViewIfNeeded();
  await expectCountryAligned(page,'fr');
  await page.reload();
  await expectCountryAligned(page,'es');
  await context.close();
});

test('walkthrough keeps immutable evidence while explaining changing context',async({browser})=>{
 for(const width of [375,768,1360]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin);
  await expect(page.locator('.orientation-grid>div')).toHaveCount(3);
  await expect(page.locator('.orientation-grid')).toContainText('One original.');
  await expect(page.locator('.orientation-grid')).toContainText('Different questions.');
  await expect(page.locator('.orientation-grid')).toContainText('A traceable next step.');
  const source=await page.locator('#sourceSheet').innerText();
  await expect(page.locator('#journeyNudge')).toContainText('Open the evidence trail');
  const actions=[];
  for(const code of ['es','de','fr']){
   await page.locator('[data-country="'+code+'"]').click();
   await expectCountryAligned(page,code);
   expect(await page.locator('#sourceSheet').innerText()).toBe(source);
   await expect(page.locator('.review-outcome')).toContainText('Needs a qualified review');
   const action=await page.locator('#nextAction').innerText();
   expect(action.length).toBeGreaterThan(28);
   actions.push(action);
  }
  expect(new Set(actions).size).toBe(3);
  await page.locator('#trailToggle').click();
  await expect(page.locator('#evidenceTrail')).toBeVisible();
  await expect(page.locator('#journeyNudge')).toContainText('You can now trace the reasoning');
  await page.locator('[data-country="de"]').click();
  await expect(page.locator('#trailContext')).toContainText('Germany');
  await expect(page.locator('.evidence-trail')).toContainText('Requires qualified human review');
  await expect(page.locator('#regimeControl')).toBeHidden();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect(errors).toEqual([]);
  await context.close();
 }
});
