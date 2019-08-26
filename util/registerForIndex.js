const puppeteer = require('puppeteer');

const createReturnStatus = (index, hasRegistered, error) => {
    return { index: index, hasRegistered: hasRegistered, error: error };
};

// returns true on successful add and false on failed add
const registerForIndex = async ({
    username,
    password,
    index,
    baseTimeout,
    puppeteerOptions,
    randomization,
    retryLimit,
}) => {
    try {
        // make sure username, password, and index were passed
        if (!username) {
            throw new Error('Error, username is required.');
        }
        if (!password) {
            throw new Error('Error, password is required.');
        }
        if (!index) {
            throw new Error('Error, course section index is required.');
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
        let hrstart = process.hrtime();
        const browser = await puppeteer.launch(puppeteerOptions);
        const loginPage = await browser.newPage();

        // logs into rutgers CAS
        await loginPage.goto('https://cas.rutgers.edu/login');
        await loginPage.type('#username', username);
        await loginPage.type('#password', password);
        await Promise.all([
            loginPage.click('.btn-submit'),
            loginPage.waitForNavigation(),
        ]);
        // check for login failure
        const loginError = await loginPage.$('errors');
        if (loginError) {
            const loginErrorMessage = await (await loginError.getProperty(
                'textContent'
            )).jsonValue();
            throw new Error(
                'Error, login failed - please check your credentials in config. More info: ' +
                    loginErrorMessage
            );
        }
        // grab the cookies for webreg
        const cookies = await loginPage.cookies();

        const webregPage = await browser.newPage();
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

        // selects spring semester and clicks submit
        await webregPage.click('#semesterSelection2');
        await Promise.all([
            webregPage.click('#submit'),
            webregPage.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

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
            await webregPage.type('#i1', index1);

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
                // grabs the error message
                const index1FullError = await webregPage.$('dt');
                const index1FullErrorMessage = await webregPage.evaluate(
                    index1FullError => index1FullError.textContent,
                    index1FullError
                );
                // logs the failure
                console.log(
                    `Failed to register for index: ${index}, with message: ${index1FullErrorMessage}.\nTrying again in ${timeout}...`
                );
                // clicks the cancel button
                await Promise.all([
                    webregPage.click('[value=Cancel]'),
                    webregPage.waitForNavigation({ waitUntil: 'networkidle2' }),
                ]);
                await webregPage.waitFor(timeout);
            } else {
                // check for a success
                const success = await webregPage.$('.info  .ok');
                if (success) {
                    // log success
                    const successMessage = await webregPage.evaluate(
                        success => success.textContent,
                        success
                    );
                    console.log(
                        `Successfully registered for index: ${index}, with message: ${successMessage}.`
                    );
                    // screenshots the success
                    await webregPage.screenshot({
                        path: 'screenshots/webreg.png',
                    });
                    wasAdded = true;
                } else {
                    // look for a generalError message
                    const generalError = await webregPage.$('.info  .error');
                    if (generalError) {
                        const generalErrorMessage = await webregPage.evaluate(
                            generalError => generalError.textContent,
                            generalError
                        );
                        console.log(
                            `Failed to register for index: ${index}, with message: ${generalErrorMessage}.\nTrying again in ${timeout}...`
                        );
                        await webregPage.waitFor(timeout);
                    } else {
                        console.log(
                            `Failed to register for index: ${index}, Due to unknown error.\nTrying again in ${timeout}...`
                        );
                        await webregPage.screenshot({
                            path: 'screenshots/error.png',
                        });
                        await webregPage.waitFor(5000); // reduced time because we didn't ping the server
                    }
                }
            }
            console.log('-------------------------------------\n');
            attempts++;
            // wasAdded = true;
        } while (!wasAdded && attempts <= retryLimit);

        let hrend = process.hrtime(hrstart);
        // exits program
        console.log(`Made ${attempts} attempt(s) in ${hrend[0]} seconds.`);
        browser.close();

        return createReturnStatus(index, wasAdded, null);
    } catch (err) {
        throw new Error('Unexpected error:' + err);
    }
};

module.exports = registerForIndex;
