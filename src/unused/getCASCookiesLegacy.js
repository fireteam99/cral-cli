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
};

module.exports = getCASCookies;

getCASCookies('eee', 'feces!', { headless: false })
    .then(cookies => console.log(cookies))
    .catch(err => console.log(err));
