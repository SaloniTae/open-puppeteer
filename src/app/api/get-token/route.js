// src/app/api/get-token/route.js

import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

export async function GET(request) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: await chromium.executablePath,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport
    });

    const page = await browser.newPage();
    await page.goto("https://pushalert.co/login", { waitUntil: "networkidle0" });

    // Wait up to 10 seconds for the reCAPTCHA hidden input to populate
    await page.waitForSelector('input[name="g-token"]', { timeout: 10000 });

    // Extract its value
    const gToken = await page.$eval('input[name="g-token"]', el => el.value);

    await browser.close();
    return new Response(JSON.stringify({ token: gToken }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    if (browser) {
      await browser.close();
    }
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve reCAPTCHA token",
        details: err.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
