export const maxDuration =60; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";

const CHROMIUM_PATH =
  // "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";
 "https://github.com/Sparticuz/chromium/releases/download/v123.0.0/chromium-v123.0.0-pack.tar"
async function getBrowser() {
  if (process.env.VERCEL_ENV === "production") {
    const sparticuzChromium = await import("@sparticuz/chromium-min").then(
      (mod) => mod.default
    );
    
    const  { chromium: playwright }  = await import("playwright").then(
      (mod) => mod.default
    );
    sparticuzChromium.setHeadlessMode = true

    const executablePath = await sparticuzChromium.executablePath(CHROMIUM_PATH);

    const browser = await playwright.launch({
      args: sparticuzChromium.args,
      executablePath:executablePath,
      headless: sparticuzChromium.headless,
    });
    return browser;
  } else {
    const  { chromium: playwright }  = await import("playwright").then(
      (mod) => mod.default);
  
    const browser = await playwright.launch();
    return browser;
  }
}

export async function GET(request: NextRequest) {

  const browser = await getBrowser();
  const url = request.nextUrl.searchParams.get("url") || null;
  if(url){

    const page = await browser.newPage();
    await page.goto("https://radar.cloudflare.com/scan");
    await page.locator(".a op oq or os").fill(url)
    await page.locator('#root > main > div.radar-grid.gf.bk.bh.ak.gg.gh > form > fieldset > div > button')
    await page.click('#root > main > div.radar-grid.gf.bk.bh.ak.gg.gh > form > fieldset > div > button')
    await page.locator('.radar-link bf ea dj ds dr').isVisible()
    const uuid = await page.locator('a.radar-link bf ea dj ds dr').getAttribute('href')
    // const spanText = await page.$eval('span.mySpan', span => span.textContent);
  
    await browser.close();
    return new NextResponse({'url':url,'uuid':uuid}, {
      headers: {
        "Content-Type": "application/json",
      },
    });

  }else{
    return new NextResponse({'url':url,'uuid':'check your input and try again'}, {
      headers: {
        "Content-Type": "application/json",
      },
    });



  }

}
