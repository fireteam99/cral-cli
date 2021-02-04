/**
 * Formats seconds to hours, minutes and seconds.
 *
 * @param {String} secs - Number of seconds
 * @returns {String} - Formatted duration in hours, minutes, and seconds
 */
function toHHMMSS(secs) {
    const sec_num = parseInt(secs, 10);
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor(sec_num / 60) % 60;
    const seconds = sec_num % 60;

    return [hours, minutes, seconds]
        .map(v => (v < 10 ? '0' + v : v))
        .filter((v, i) => v !== '00' || i > 0)
        .join(':');
}

module.exports = toHHMMSS;
