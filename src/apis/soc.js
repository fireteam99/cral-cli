const axios = require('axios');

/**
 * Axios instance with a base URL of the Rutgers SOC API endpoint.
 */
module.exports = axios.create({
    baseURL: 'https://sis.rutgers.edu/soc',
});
