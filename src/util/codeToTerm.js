/**
 * Maps numerical term codes, to actual term names.
 *
 * @param {String} code Numerical term code
 * @returns {String} Human readable term name
 */
function codeToTerm(code) {
    switch (code) {
        case '0':
            return 'Winter';
        case '1':
            return 'Spring';
        case '7':
            return 'Summer';
        case '9':
            return 'Fall';
        default:
            return 'Error';
    }
}

module.exports = codeToTerm;
