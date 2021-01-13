const puppeteer = require('puppeteer');
const makeDir = require('make-dir');
const path = require('path');

const createReturnStatus = (index, hasRegistered, message, screenshot) => {
  return { index, hasRegistered, message, screenshot };
};

// Note: fatal errors are thrown, non fatal errors are returned in the return status message field

// returns true on successful add and false on failed add
const registerForIndex = async ({
  username,
  password,
  index,
  term,
  year,
  baseTimeout,
  puppeteerOptions,
  randomization,
  retryLimit,
}) => {
  // console.log(index);
  let browser = null;
  let loginPage = null;
  let webregPage = null;
  let message = '';
  let screenshot = '';
  try {
    // make sure username, password, and index were passed
    if (!username) {
      throw new Error('Username is required.');
    }
    if (!password) {
      throw new Error('Password is required.');
    }
    if (!index) {
      throw new Error('Course section index is required.');
    }
    // set default values
    if (!baseTimeout) {
      baseTimeout = 5000; // 5 seconds
    }
    if (!puppeteerOptions) {
      puppeteerOptions = {};
    }
    if (!randomization) {
      randomization = 2000; // 2 seconds
    }
    if (!retryLimit) {
      retryLimit = 0;
    }
    // let hrstart = process.hrtime();

    browser = await puppeteer.launch(puppeteerOptions);
    loginPage = await browser.newPage();

    // logs into rutgers CAS
    await loginPage.goto('https://cas.rutgers.edu/login');
    await loginPage.type('#username', username);
    await loginPage.type('#password', password);
    await Promise.all([
      loginPage.click('.btn-submit'),
      loginPage.waitForNavigation(),
    ]);
    // check for login failure
    const loginError = await loginPage.$('.errors');
    if (loginError) {
      const loginErrorMessage = await loginPage.evaluate(
        loginError => loginError.textContent,
        loginError
      );
      throw new Error(
        'Login failed - please check your credentials in config. More info: ' +
          loginErrorMessage
      );
    }
    // grab the cookies for webreg
    const cookies = await loginPage.cookies();

    webregPage = await browser.newPage();
    await webregPage.setCookie(...cookies);

    // goes to webreg page
    await Promise.all([
      webregPage.goto('https://sims.rutgers.edu/webreg/'),
      webregPage.waitForNavigation(),
    ]);

    // clicks ru students button
    await Promise.all([
      webregPage.click('.ru-students'),
      webregPage.waitForNavigation(),
    ]);

    // check to see which semester to choose
    const semesters = await webregPage.$$('.semesterInputClass');
    const semesterValues = await Promise.all(
      semesters.map(async semester => ({
        value: await webregPage.evaluate(semester => semester.value, semester),
        id: await webregPage.evaluate(semester => semester.id, semester),
      }))
    );
    // console.log(semesterValues);

    // selects the choosen semester and clicks submit
    const [chosenSemester] = semesterValues.filter(
      sv => sv.value === `${term}${year}`
    );
    // checks if we were passed an invalid semester/year combination
    if (chosenSemester == null) {
      // if so return an error
      throw new Error(
        'invalid term/year combination. Please run "cral c" to check your config settings...'
      );
    }
    // click on the chosen semester
    await webregPage.click(`#${chosenSemester.id}`);
    await Promise.all([
      webregPage.click('#submit'),
      webregPage.waitForNavigation({
        waitUntil: ['networkidle2', 'domcontentloaded'],
      }),
    ]);

    await webregPage.waitForSelector('#fm-search', {
      visible: true,
      timeout: 0,
    });

    // check to see if an error appeared
    const semesterError = await webregPage.$('.errors > ul > h2 > span');
    if (semesterError) {
      const semesterErrorMessage = await webregPage.evaluate(
        semesterError => semesterError.textContent,
        semesterError
      );
      throw new Error(
        'the current term/year combination is not open for registration. Please run "cral c" to check your config settings... More info: ' +
          semesterErrorMessage
      );
    }

    let wasAdded = false;
    let attempts = 0;

    do {
      // randomize the timeout
      let timeout = baseTimeout + Math.random() * randomization;
      // make sure that the registration page is actually loaded by checking for the box
      await webregPage.waitForSelector('#i1', {
        visible: true,
        timeout: 0,
      });
      // adds class to first index box
      await webregPage.type('#i1', index);

      // click register button
      await Promise.all([
        webregPage.click('#submit'),
        webregPage.waitForNavigation(),
      ]);

      // make sure that the actual page has loaded and not the waiting page
      await webregPage.waitForSelector('.box', {
        visible: true,
        timeout: 0,
      });

      // check to see if additional input box comes up
      let additionalInputBox = await webregPage.evaluate(
        `document.getElementById('operations0.specialPermissionNumber');`
      );
      if (additionalInputBox != null) {
        // if we get an error where the class is filled up (spn box appears)
        // grabs the error message
        const indexFullError = await webregPage.$('dt');
        const indexFullErrorMessage = await webregPage.evaluate(
          indexFullError => indexFullError.textContent,
          indexFullError
        );
        // logs the failure
        message = `Failed to register for index: ${index}, with message: ${indexFullErrorMessage}`;
        // clicks the cancel button
        await Promise.all([
          webregPage.click('[value=Cancel]'),
          webregPage.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);
        await webregPage.waitFor(timeout);
      } else {
        // if we successfully registered
        // check for a success
        const success = await webregPage.$('.info  .ok');
        if (success) {
          // log success
          const successMessage = await webregPage.evaluate(
            success => success.textContent,
            success
          );
          message = `Successfully registered for index: ${index}, with message: ${successMessage}`;
          // screenshots the success
          const successScreenshotName = `success-${Date.now()}.png`;
          const successScreenshotFolderPath = path.join(
            __dirname,
            '..',
            'screenshots'
          );
          // makes sure that the folder exists
          await makeDir(successScreenshotFolderPath);
          const successScreenshotPath = path.join(
            successScreenshotFolderPath,
            successScreenshotName
          );
          await webregPage.screenshot({
            path: successScreenshotPath,
            fullPage: true,
          });
          screenshot = `Screenshot taken at: ${successScreenshotPath}`;
          wasAdded = true;
        } else {
          // look for a generalError message
          const generalError = await webregPage.$('.info  .error');
          if (generalError) {
            const generalErrorMessage = await webregPage.evaluate(
              generalError => generalError.textContent,
              generalError
            );
            // checks to see if the error was because a course was already registered for
            if (
              generalErrorMessage.includes(
                'You are already registered for course'
              )
            ) {
              throw new Error(
                `It seems like you have already registered for index: ${index}. More info: ${generalErrorMessage}`
              );
            } else {
              message = `Failed to register for index: ${index}, with message: ${generalErrorMessage}`;
            }
            await webregPage.waitFor(timeout);
          } else {
            // some other unknown error
            const errorScreenshotName = `error-${Date.now()}.png}`;
            const errorScreenshotFolderPath = path.join(
              __dirname,
              '..',
              'screenshots'
            );
            await makeDir(errorScreenshotFolderPath);
            const errorScreenshotPath = path.join(
              errorScreenshotFolderPath,
              errorScreenshotName
            );
            await webregPage.screenshot({
              path: errorScreenshotPath,
              fullPage: true,
            });
            screenshot = `Screenshot taken at: ${errorScreenshotName}`;
            throw new Error(
              `Failed to register for index: ${index}, Due to unknown error. ${screenshot}`
            );
            // await webregPage.waitFor(5000); // reduced time because we didn't ping the server
          }
        }
      }
      // console.log('-------------------------------------\n');
      attempts++;
      // wasAdded = true;
    } while (!wasAdded && attempts <= retryLimit);

    // let hrend = process.hrtime(hrstart);
    // exits program
    // console.log(`Made ${attempts} attempt(s) in ${hrend[0]} seconds.`);
    await webregPage.close();
    await loginPage.close();
    await browser.close();

    return createReturnStatus(index, wasAdded, message, screenshot);
  } catch (err) {
    if (webregPage) {
      await webregPage.close();
    }
    if (loginPage) {
      await loginPage.close();
    }
    if (browser) {
      await browser.close();
    }
    throw err;
  }
};

module.exports = registerForIndex;
