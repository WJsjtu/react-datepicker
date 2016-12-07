const {createElement} = React;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const PanelMixin = require('./PanelMixin');
const DateMixin = require('./DateMixin');

module.exports = React.createClass({

    displayName: 'DayPicker',

    mixins: [PureRenderMixin, PanelMixin, DateMixin],

    getLastMonthDays: function () {
        const date = new Date();
        date.setFullYear(this.state.panelYear);
        date.setMonth(this.state.panelMonth - 1);
        date.setDate(1);

        let prevDays = date.getDay();
        if (!prevDays) prevDays = 7;
        return prevDays;
    },


    onCellClick: function (year, month, day, event) {
        event.stopPropagation();
        this.props.onCellSelect(year, month, day);
    },

    render: function () {

        const {panelYear, panelMonth, currentYear, currentMonth, currentDay, activeYear, activeMonth, activeDay} = this.state;

        const pCount = this.getLastMonthDays(), cCount = this.getDayCount(panelYear, panelMonth), nCount = 42 - pCount - cCount;

        const pMonthArray = this.getPrevMonth(panelYear, panelMonth), nMonthArray = this.getNextMonth(panelYear, panelMonth);

        const pStartDate = this.getDayCount.apply(this, pMonthArray) - pCount + 1;

        const cellArray = [];

        let keyIndex = 0;

        const getCellElement = (function (year, month, day, classNames) {
            const classArray = ['cell', 'small'].concat(classNames);
            const validate = (this.props.rule(year, month, day) !== false);
            if (validate === false) classArray.push('disabled');
            if (year == currentYear && month == currentMonth && day == currentDay) classArray.push('current');
            if (year == activeYear && month == activeMonth && day == activeDay) classArray.push('active');

            return (
                <td key={keyIndex++}
                    className={classArray.join(' ')}
                    onClick={validate !== false ? this.onCellClick.bind(this, year, month, day) : null}
                >
                    {day}
                </td>
            );
        }).bind(this);

        for (let i = 0; i < pCount; i++) {
            cellArray.push(getCellElement(pMonthArray[0], pMonthArray[1], pStartDate + i, ['old']));
        }

        for (let i = 0; i < cCount; i++) {
            cellArray.push(getCellElement(panelYear, panelMonth, i + 1, []));
        }

        for (let i = 0; i < nCount; i++) {
            cellArray.push(getCellElement(nMonthArray[0], nMonthArray[1], i + 1, ['new']));
        }

        const tableRows = [];
        for (let i = 0; i < 6; i++) {
            const oneRow = [];
            for (let j = 0; j < 7; j++) {
                oneRow.push(cellArray[7 * i + j]);
            }
            tableRows.push(<tr key={i}>{oneRow}</tr>);
        }

        return <tbody>{tableRows}</tbody>;
    }
});