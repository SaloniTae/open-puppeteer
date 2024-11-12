// app/api/check-page/route.js

import chromium from "@sparticuz/chromium-min";

import { Browser } from "puppeteer";
import { Browser as CoreBrowser } from "puppeteer-core";
export const dynamic = 'force-dynamic'

async function checkPageStatus(url) {
  let browser
  let statusCode;

  try {
    if (process.env.VERCEL_ENV === 'production') {

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new"
      });
    }

    const page = await browser.newPage();

    // Navigate to the specified URL and wait until network requests are idle
    const response = await page.goto(url, { waitUntil: 'networkidle2' });

    // Check if the page loaded successfully
    statusCode = response && response.status() === 200 ? 200 : 404;
  } catch (error) {
    console.error('Error accessing page:', error);
    statusCode = 404;
  } finally {
    if (browser) await browser.close();
  }

  return statusCode === 200;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const status = await checkPageStatus(url);
  console.log(status, "reals");

  return new Response(JSON.stringify({
    statusCode: status ? 200 : 404,
    is200: status
  }), {
    status: status ? 200 : 404,
    headers: { 'Content-Type': 'application/json' },
  });
}
