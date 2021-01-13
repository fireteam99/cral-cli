const puppeteer = require('puppeteer');

const getCASCookies = async (username, password, puppeteerOptions = {}) => {
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
        const loginError = await loginPage.$('.alert.alert-danger');
        if (loginError) {
            const loginErrorMessage = await loginPage.evaluate(
                loginError => loginError.textContent,
                loginError
            );
            throw Error(
                'Login failed - please check your credentials in config. More info: ' +
                    loginErrorMessage
            );
        }

        const loginSuccess = await loginPage.$('.alert.alert-success');
        if (!loginSuccess) {
            throw Error(
                'Login failed unexpectedly - try running in debug mode to determine error.'
            );
        }

        // grab the cookies
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
};

module.exports = getCASCookies;
