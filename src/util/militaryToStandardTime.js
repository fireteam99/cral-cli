const milToStd = mTime => {
    if (mTime == null) {
        return 'N/A';
    }
    const millyTime = Number(mTime);
    if (millyTime < 100) {
        const digits = millyTime.toString().split('');
        return digits.length > 1 ? `12:${millyTime} AM` : `12:0${millyTime} AM`;
    } else if (millyTime < 1200) {
        const digits = millyTime.toString().split('');
        return digits.length < 4
            ? `${digits[0]}:${digits[1]}${digits[2]} AM`
            : `${digits[0]}${digits[1]}:${digits[2]}${digits[3]} AM`;
    } else if (millyTime >= 1200 && millyTime < 1300) {
        const digits = millyTime.toString().split('');
        return `${digits[0]}${digits[1]}:${digits[2]}${digits[3]} PM`;
    } else {
        const digits = (millyTime - 1200).toString().split('');
        return digits.length < 4
            ? `${digits[0]}:${digits[1]}${digits[2]} PM`
            : `${digits[0]}${digits[1]}:${digits[2]}${digits[3]} PM`;
    }
};

module.exports = milToStd;

// tests to make sure it words
// for (let i = 0; i < 2400; i++) {
//     console.log(milToStd(i));
// }
