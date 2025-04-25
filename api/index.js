const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    await browser.close();

    res.status(200).send(`✅ Scraping završen! Naslov stranice: ${title}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Greška prilikom pokretanja Puppeteer-a.');
  }
};
