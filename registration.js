const puppeteer = require('puppeteer');
const { username, password } = require('./config/login.js');
const { course, timeout } = require('./config/register.js');


try {
  (async () => {
    try {
      let hrstart = process.hrtime();
      const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      const loginPage = await browser.newPage();

      await loginPage.goto('https://cas.rutgers.edu/login');
      await loginPage.type('#username', username);
      await loginPage.type('#password', password);
      await Promise.all([
        loginPage.click('.btn-submit'),
        loginPage.waitForNavigation()
      ])
      const cookies = await loginPage.cookies();

      const webregPage = await browser.newPage();
      await webregPage.setCookie(...cookies);

      // goes to webreg page
      await Promise.all([
         webregPage.goto('https://sims.rutgers.edu/webreg/'),
         webregPage.waitForNavigation()
      ]);


      // clicks ru students button
      await Promise.all([
        webregPage.click('.ru-students'),
        webregPage.waitForNavigation()
      ]);

      // selects spring semester and clicks submit
      await webregPage.click('#semesterSelection2');
      await Promise.all([
        webregPage.click('#submit'),
        webregPage.waitForNavigation({ waitUntil: 'networkidle2' })
      ]);

      let wasAdded = false;
      let attempts = 0;

      do {
        // make sure that the registration page is actually loaded by checking for the box
        await webregPage.waitForSelector( '#i1', { visible : true } );
        // adds class to first index box
        await webregPage.type('#i1', course);

        // click register button
        await Promise.all([
          webregPage.click('#submit'),
          webregPage.waitForNavigation()
        ]);

        // check to see if additional input box comes up
        let additionalInputBox = await webregPage.evaluate(`document.getElementById('operations0.specialPermissionNumber');`);
        if (additionalInputBox != null) {
          // grabs the error message
          const courseFullError = await webregPage.$('dt');
          const courseFullErrorMessage = await webregPage.evaluate(courseFullError => courseFullError.textContent, courseFullError);
          // logs the failure
          console.log(`Failed to register for course: ${course}, with message: ${courseFullErrorMessage}.\nTrying again in ${timeout}...`);
          // clicks the cancel button after timeout
          await webregPage.waitFor(timeout);
          await Promise.all([
            webregPage.click('[value=Cancel]'),
            webregPage.waitForNavigation({ waitUntil: 'networkidle2' })
          ])
        } else {
          // check for a success
          const success = await webregPage.$('.info  .ok');
          if (success) {
            // log success
            const successMessage = await webregPage.evaluate(success => success.textContent, success);
            console.log(`Successfully registered for course: ${course}, with message: ${successMessage}.`);
            // screenshots the success
            await webregPage.screenshot({ path: 'screenshots/webreg.png'});
            wasAdded = true;
          } else {
            // look for a generalError message
            const generalError = await webregPage.$('.info  .error');
            if (generalError) {
              const generalErrorMessage = await webregPage.evaluate(generalError => generalError.textContent, generalError);
              console.log(`Failed to register for course: ${course}, with message: ${generalErrorMessage}.\nTrying again in ${timeout}...`);
              await webregPage.waitFor(timeout);
            } else {
              console.log(`Failed to register for course: ${course}, Due to unknown error.\nTrying again in ${timeout}...`);
              await webregPage.screenshot({ path: 'screenshots/error.png'});
              await webregPage.waitFor(5000); // reduced time because we didn't ping the server
            }
          }
        }
        console.log('-------------------------------------\n')
        attempts++;
        // wasAdded = true;
      } while (!wasAdded)

      let hrend = process.hrtime(hrstart);
      // exits program
      console.log(`Made ${attempts} attempt(s) in ${hrend[0]} seconds.`);
      browser.close();
    } catch (err) {
      console.log(err);
    }
  }) ();
} catch (err) {
  console.log(err);
}
