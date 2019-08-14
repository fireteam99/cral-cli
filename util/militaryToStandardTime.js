module.exports = mTime => {
    if (mTime == null) {
        return 'N/A';
    }
    millyTime = Number(mTime);
    if (millyTime === 0000) {
        return '12:00 AM';
    } else if (millyTime < 1200) {
        const digits = millyTime.toString().split('');
        return `${digits[0]}:${digits[1]}${digits[2]} AM`;
    } else {
        const digits = millyTime.toString().split('');
        return `${digits[0]}${digits[1]}:${digits[2]}${digits[3]} PM`;
    }
};
