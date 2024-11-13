

import chromium from "@sparticuz/chromium-min";
import puppeteer from 'puppeteer'
import puppeteerCore from 'puppeteer-core'
export const dynamic = 'force-dynamic'

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar";

async function checkPageStatus(url) {
  let browser
  let statusCode;

  try {

    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(`https://github.com/Sparticuz/chromium/releases/download/v116`),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    const response = await page.goto(url, { waitUntil: 'networkidle2' });
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
  return new Response(JSON.stringify({
    statusCode: status ? 200 : 404,
    is200: status
  }), {
    status: status ? 200 : 404,
    headers: { 'Content-Type': 'application/json' },
  });
}
