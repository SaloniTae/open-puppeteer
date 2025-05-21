// src/app/api/get-token/route.js

import puppeteer from "puppeteer";

export async function GET(request) {
  let browser = null;
  try {
    // Launch a headless browser. Vercel’s functions bundle Chromium for you.
    browser = await puppeteer.launch({
      headless: true,
      // You can add other launch options here if needed (e.g. args: ["--no-sandbox"]).
    });

    const page = await browser.newPage();
    await page.goto("https://pushalert.co/login", { waitUntil: "networkidle0" });

    // Wait up to 10 seconds for the reCAPTCHA hidden input to populate
    await page.waitForSelector('input[name="g-token"]', { timeout: 10000 });

    // Extract its value
    const gToken = await page.$eval('input[name="g-token"]', (el) => el.value);

    // Close the browser instance
    await browser.close();

    // Return the token as JSON
    return new Response(JSON.stringify({ token: gToken }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    // Ensure the browser is closed if an error occurs
    if (browser) {
      await browser.close();
    }
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve reCAPTCHA token",
        details: err.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
