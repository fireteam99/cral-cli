/**
 * Maps day abbreviations used by Rutgers to the full day name.
 *
 * @param {String} letter - Rutgers day abbreviation.
 * @returns {String} Full day name
 */
function dayFromLetter(letter) {
    switch (letter) {
        case 'M':
            return 'Monday';
        case 'T':
            return 'Tuesday';
        case 'W':
            return 'Wednesday';
        case 'TH':
            return 'Thursday';
        case 'F':
            return 'Friday';
        case 'S':
            return 'Saturday';
        case 'SU':
            return 'Sunday';
        default:
            return 'N/A';
    }
}

module.exports = dayFromLetter;
