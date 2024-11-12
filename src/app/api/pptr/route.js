// app/api/check-page/route.js

import puppeteer from 'puppeteer'
import puppeteerCore from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
export const dynamic = 'force-dynamic'

async function checkPageStatus(url) {
  let browser;
  let statusCode;

  try {
    if (process.env.VERCEL_ENV === 'production') {
      const executablePath = await chromium.executablePath()
      browser = await puppeteerCore.launch({
        executablePath,
        args: chromium.args,
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport
      })
    } else {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
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
