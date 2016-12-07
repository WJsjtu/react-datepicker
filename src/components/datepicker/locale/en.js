const months = 'January February March April May June July August September October November December'.split(' ');

module.exports = {
    weekTitle: 'Sun Mon Tue Wed Thu Fri Sat'.split(' '),
    month: months.map(function (ele) {
        return ele.substring(0, 3);
    }),
    placeholder: 'select...',
    panelTitle: {
        year: function (panelYear) {
            const startYear = parseInt(panelYear / 10) * 10 - 1;
            return `${startYear} - ${startYear + 12}`;
        },
        month: function (panelYear) {
            return `${panelYear}`;
        },
        day: function (panelYear, panelMonth) {
            return `${months[panelMonth - 1]} ${panelYear}`;
        }
    }
};