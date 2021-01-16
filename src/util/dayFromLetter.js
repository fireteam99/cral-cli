module.exports = letter => {
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
};
