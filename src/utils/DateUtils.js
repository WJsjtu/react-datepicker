/**
 * @type {{getPrevMonth: DateUtils.getPrevMonth, getNextMonth: DateUtils.getNextMonth, getDayCount: DateUtils.getDayCount, dateFormat: DateUtils.dateFormat}}
 */
const DateUtils = {

    /**
     *
     * @param {number} year Current year.
     * @param {number} month Current month.
     * @returns {number} Previous month.
     */
    getPrevMonth: function (year, month) {
        return month == 1 ? [year - 1, 12] : [year, month - 1];
    },

    /**
     *
     * @param {number} year Current year.
     * @param {number} month Current month.
     * @returns {number} Next month.
     */
    getNextMonth: function (year, month) {
        return month == 12 ? [year + 1, 1] : [year, month + 1];
    },

    /**
     *
     * @param {number} year Current year.
     * @param {number} month Current month.
     * @returns {number} The days count of specific month.
     */
    getDayCount: function (year, month) {
        const isLeap = ((month == 2) && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0));
        return [1, -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1][month - 1] + 30 + isLeap;
    },

    /**
     *
     * @param date
     * @param _fmt
     * @returns {string}
     */
    dateFormat: function (date, _fmt) {
        if (!date || isNaN(+date)) {
            return '';
        }
        _fmt = _fmt || 'yyyy-MM-dd HH:mm:ss';

        return (
            /**
             *
             * @param {string} fmt Format for the date.
             * @returns {string} Result of the date in specific format.
             */
                function (fmt) {
                var o = {
                    'M+': this.getMonth() + 1, //月份
                    'd+': this.getDate(), //日
                    'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
                    'H+': this.getHours(), //小时
                    'm+': this.getMinutes(), //分
                    's+': this.getSeconds(), //秒
                    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
                    'S': this.getMilliseconds() //毫秒
                };
                var week = {
                    '0': '/u65e5',
                    '1': '/u4e00',
                    '2': '/u4e8c',
                    '3': '/u4e09',
                    '4': '/u56db',
                    '5': '/u4e94',
                    '6': '/u516d'
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                if (/(E+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + '']);
                }
                for (var k in o) {
                    if (new RegExp('(' + k + ')').test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                    }
                }
                return fmt;
            }
        ).call((date instanceof Date ? date : new Date(+date)), _fmt);
    }
};

/**
 * The utils for date calculating.
 * @module DateUtils
 * @exports DateUtils
 */
export default DateUtils;