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

        // check to see if additional input box comes up
        let additionalInputBox = await webregPage.$('.box');
        if (additionalInputBox)
          // grabs the error message
          const error = await webregPage.$('.dt');
          const errorMessage = await pave.evaluate(error => error.textContent, error);
          // logs the failure
          console.log(`Failed to register for course: ${course} with message: ${errorMessage}.\nTrying again...`);
          // clicks the cancel button
          await webregPage.click('[value=Cancel]');
        } else {
          // check to see if success message pops up

          // checks to see if failure message pops up

          // in all other cases try to continue

          // waits for five seconds
        }
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
