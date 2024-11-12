

import puppeteer from 'puppeteer';

async function checkPageStatus(url) {
  const browser = await puppeteer.launch();
  let statusCode;

  try {
    const page = await browser.newPage();
    const response = await page.goto(url, { waitUntil: 'networkidle2' });
    statusCode = response && response.status() === 200 ? 200 : 404;
  } catch (error) {
    console.error('Error accessing page:', error);
    statusCode = 404;
  } finally {
    await browser.close();
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
    statusCode: status,
    is200: status

  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
