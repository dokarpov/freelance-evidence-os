const {test,expect}=require('@playwright/test');
const base='http://127.0.0.1:8765/';
for(const width of [320,375,390,768,1024,1360,1920]){
 test('proof lifecycle end-to-end at '+width+'px',async({browser})=>{
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto(base+'demo.html');
   await expect(page.locator('[data-scene="1"]')).toBeVisible();
   await expect(page.locator('#connectNext')).toBeDisabled();
   await expect(page.locator('[data-scene="2"]')).toBeHidden();
   for(const name of ['contract','invoice','payment']){
    await page.locator('[data-source="'+name+'"]').click();
    await expect(page.locator('[data-source="'+name+'"]')).toHaveAttribute('aria-pressed','true');
   }
   await expect(page.locator('#connectNext')).toBeEnabled();
   await page.locator('#connectNext').click();
   await expect(page.locator('[data-scene="2"]')).toBeVisible();
   await page.locator('#recipient').selectOption('broker');
   await expect(page.locator('#recipientPreview')).toHaveText('Mortgage broker');
   await page.locator('#issueNext').click();
   await expect(page.locator('[data-scene="3"]')).toBeVisible();
   await page.locator('#verifyNow').click();
   await expect(page.locator('#verifyState')).toHaveText('CURRENT / SIMULATED');
   await page.locator('#reversePayment').click();
   await expect(page.locator('#verifyState')).toHaveText('Not checked yet');
   await page.locator('#verifyNow').click();
   await expect(page.locator('#verifyState')).toHaveText('STALE / DO NOT RELY');
   await expect(page.locator('#verifiedRecipient')).toHaveText('Mortgage broker');
   await page.locator('#restorePayment').click();
   await page.locator('#verifyNow').click();
   await expect(page.locator('#verifyState')).toHaveText('CURRENT / SIMULATED');
   await page.locator('#restart').click();
   await expect(page.locator('[data-scene="1"]')).toBeVisible();
   await expect(page.locator('#connectNext')).toBeDisabled();
   await expect(page.locator('[data-source][aria-pressed="true"]')).toHaveCount(0);
   const info=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
   expect(info.scroll).toBeLessThanOrEqual(info.viewport+2);
   expect(errors).toEqual([]);
   await page.screenshot({path:'test-results/proof-'+width+'.png',fullPage:true});
  }finally{await context.close()}
 });
}
test('landing launches new product flow rather than retired reviewer',async({page})=>{
 await page.goto(base);
 await expect(page.locator('#demo .proof-cta')).toHaveAttribute('href','demo.html');
 await expect(page.locator('#legacy-demo')).toBeHidden();
 await page.locator('#demo .proof-cta').click();
 await expect(page).toHaveURL(/demo.html$/);
 await expect(page.getByRole('heading',{name:/Three records/i})).toBeVisible();
});
