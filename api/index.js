import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    await browser.close();

    res.status(200).send(`✅ Scraping uspješan! Naslov: ${title}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Greška pri izvršavanju Puppeteer-a.');
  }
}
