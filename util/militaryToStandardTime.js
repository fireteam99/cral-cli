module.exports = mTime => {
    if (mTime == null) {
        return 'N/A';
    }
    const millyTime = Number(mTime);
    if (millyTime < 100) {
        return `12:${millyTime} AM`;
    } else if (millyTime < 1200) {
        const digits = millyTime.toString().split('');
        return digits.length < 4
            ? `${digits[0]}:${digits[1]}${digits[2]} PM`
            : `${digits[0]}${digits[1]}:${digits[2]}${digits[3]} PM`;
    } else if (millyTime >= 1200 && millyTime < 1300) {
        return `${digits[0]}${digits[1]}:${digits[2]}${digits[3]} PM`;
    } else {
        const digits = (millyTime - 1200).toString().split('');
        return digits.length < 4
            ? `${digits[0]}:${digits[1]}${digits[2]} PM`
            : `${digits[0]}${digits[1]}:${digits[2]}${digits[3]} PM`;
    }
};
