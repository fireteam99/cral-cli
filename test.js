const puppeteer = require('puppeteer');

try {
  (async () => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://www.york.ac.uk/teaching/cws/wws/webpage1.html');
      if ()

    } catch (err) {
      console.log(err);
    }
  }) ();
} catch (err) {
  console.log(err);
}
