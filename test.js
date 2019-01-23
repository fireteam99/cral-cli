const puppeteer = require('puppeteer');

try {
  (async () => {
    try {
      const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      const page = await browser.newPage();
      await page.goto('https://www.york.ac.uk/teaching/cws/wws/webpage1.html');
      const header = await page.$('h1');
      if (header == null) {
        console.log('failed');
      } else {
        console.log('passed');
        console.log(await page.evaluate(header => header.textContent, header));
      }
      browser.close();
    } catch (err) {
      console.log(err);
    }
  }) ();
} catch (err) {
  console.log(err);
}
