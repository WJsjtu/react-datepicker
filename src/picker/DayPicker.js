import {Component} from 'react';
import {autobind} from 'core-decorators';

import PanelDecorator  from './../utils/PanelDecorator';
import styles from './../style.less';
import DateUtils from './../utils/DateUtils';


/**
 * @class DayPicker
 * @extends React.Component
 */
@PanelDecorator
class DayPicker extends Component {

    /**
     * Get day count of last month.
     * @return {number} The day count of last month.
     */
    @autobind
    getLastMonthDays() {
        const date = new Date();
        date.setFullYear(this.props.panelYear);
        date.setMonth(this.props.panelMonth - 1);
        date.setDate(1);

        let prevDays = date.getDay();
        if (!prevDays) prevDays = 7;
        return prevDays;
    }

    render() {
        const {
            panelYear,
            panelMonth,
            currentYear,
            currentMonth,
            currentDay,
            activeYear,
            activeMonth,
            activeDay,
        } = this.props;

        const pCount = this.getLastMonthDays(),
            cCount = DateUtils.getDayCount(panelYear, panelMonth),
            nCount = 42 - pCount - cCount;

        const pMonthArray = DateUtils.getPrevMonth(panelYear, panelMonth),
            nMonthArray = DateUtils.getNextMonth(panelYear, panelMonth);

        const pStartDate = DateUtils.getDayCount.apply(null, pMonthArray) - pCount + 1;

        const cellArray = [];

        let keyIndex = 0;

        const getCellElement = (year, month, day, classNames) => {
            const classArray = ['cell', 'small'].concat(classNames);
            const validate = (this.props.rule(year, month, day) !== false);
            if (validate === false) classArray.push('disabled');
            if (year == currentYear && month == currentMonth && day == currentDay) classArray.push('current');
            if (year == activeYear && month == activeMonth && day == activeDay) classArray.push('active');

            return (
                <td key={keyIndex++}
                    className={classArray.map((className) => styles[className]).join(' ')}
                    onClick={validate !== false ? this.onCellClick.bind(this, year, month, day) : null}
                >
                    {day}
                </td>
            );
        };

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

}

/**
 * @export DayPicker
 * @module DayPicker
 */
export default DayPicker;