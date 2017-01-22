/**
 *
 * @type {{weekTitle: Array, month: number[], placeholder: string, panelTitle: {year: assets.panelTitle.year, month: assets.panelTitle.month, day: assets.panelTitle.day}}}
 */
const assets = {
    weekTitle: '日一二三四五六'.split('').map(function (day) {
        return '周' + day;
    }),
    month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    placeholder: '请选择...',
    panelTitle: {
        year: function (panelYear) {
            const startYear = parseInt(panelYear / 10) * 10 - 1;
            return `${startYear} 年 - ${startYear + 12} 年`;
        },
        month: function (panelYear) {
            return `${panelYear} 年`;
        },
        day: function (panelYear, panelMonth) {
            return `${panelYear} 年 ${panelMonth} 月`;
        }
    }
};

/**
 * @module assets
 * @export assets
 */
export default assets;
