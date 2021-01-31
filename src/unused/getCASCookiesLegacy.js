const puppeteer = require('puppeteer');

/**
 * A Puppeteer script that logs in to the old version of Rutgers's CAS login
 * page. Deprecated since version 2 because the CAS login page was updated.
 *
 * @deprecated Since v2.0.0
 * @param {String} username Rutgers netid username
 * @param {String} password Rutgers netid password
 * @param {Object} puppeteerOptions Launch options for Puppeteer
 * @returns {Object} The cookies of the CAS login page
 */
async function getCASCookies(username, password, puppeteerOptions = {}) {
    if (username == null) {
        throw Error('No username provided for authentication.');
    }

    if (password == null) {
        throw Error('No password provided for authentication.');
    }
    let browser = null;
    let loginPage = null;
    try {
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
        return cookies;
    } finally {
        if (loginPage) {
            await loginPage.close();
        }
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = getCASCookies;
