const puppeteer = require('puppeteer');
const { login, passwprd } = require('./config/login.js');
const course = require('./config/register.js');

try {
  (async () => {
    try {
      const browser = await puppeteer.launch();
      const loginPage = await browser.newPage();

      await loginPage.goto('https://cas.rutgers.edu/login');
      await loginPage.type('#username', login);
      await loginPage.type('#password', password);
      await loginPage.click('.btn-submit');
      await loginPage.waitForNavigation();
      const cookies = await loginPage.cookies();

      const webregPage = await browser.newPage();
      await webregPage.setCookie(...cookies);
      await webregPage.goto('https://sims.rutgers.edu/webreg/');
      await webregPage.click('.ru-students');
      await webregPage.click('#semesterSelection2');
      await Promise.all([
        webregPage.click('#submit'),
        webregPage.waitForNavigation()
      ]);

      // adds class to first index box
      await webregPage.type('#i1', course);
      let wasAdded = false;

      while (!wasAdded) {
        // click register button
        await webregPage.click('#submit');
        await webregPage.waitForNavigation();
        // check to see whether the course was added
        let wasAdded = (await webregPage.$('') !== null);
        console.log('failed to register for class... trying again')
        // waits for five seconds
        await page.waitFor(5000);
      }

      console.log('successfully registered for class');
      await webregPage.screenshot({ path: 'screenshots/webreg.png'});

      browser.close();

    } catch (err) {
      console.log(err);
    }
  }) ();
} catch (err) {
  console.log(err);
}
