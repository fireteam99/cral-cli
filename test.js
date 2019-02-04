const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

try {
  (async () => {
    try {
      const data = await fetch('https://sis.rutgers.edu/soc/openSections.gz?year=2019&term=1&campus=NB');
      console.log(await data.json());
      // const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      // const page = await browser.newPage();
      // await page.goto('https://www.york.ac.uk/teaching/cws/wws/webpage1.html');
      // const header = await page.$('h1');
      // if (header == null) {
      //   console.log('failed');
      // } else {
      //   console.log('passed');
      //   console.log(await page.evaluate(header => header.textContent, header));
      // }
      // browser.close();
    } catch (err) {
      console.log(err);
    }
  }) ();
} catch (err) {
  console.log(err);
}
