const puppeteer = require('puppeteer');

try {
  (async () => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      if ()

    } catch (err) {
      console.log(err);
    }
  }) ();
} catch (err) {
  console.log(err);
}
