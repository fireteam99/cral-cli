const axios = require('axios');

module.exports = axios.create({
    baseURL: 'https://sis.rutgers.edu/soc',
});
