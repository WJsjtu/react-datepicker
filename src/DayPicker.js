import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MonthObject from './MonthObject';

export default class DayPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: props.current,
            active: props.active
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            current: newProps.current,
            active: newProps.active
        });
    }

    onPrevClick(event) {
        event.stopPropagation();
        const {current} = this.state;
        this.setState({
            current: current.prev()
        });
    }

    onNextClick(event) {
        event.stopPropagation();
        const {current} = this.state;
        this.setState({
            current: current.next()
        });
    }

    onWheel(deltaMode) {
        deltaMode.stopPropagation();
        deltaMode.preventDefault();
        const {current} = this.state;
        this.setState({
            current: deltaMode.deltaY < 0 ? current.next() : current.prev()
        });
    }

    render() {
        /* *
         *
         *current            -   MonthObject
         *active             -   Date
         *dayRule            -   func(dayDate    -   Date)
         *onMonthTitleClick  -   func()
         *weekTitle          -   func(day    -   number)
         *monthTitle         -   func(year   -   number, month   -   number)
         *
         * */
        const me = this;
        const {dayRule, onMonthTitleClick, weekTitle, monthTitle, onDaySelect, style} = me.props;
        const {current, active} = me.state;

        const prevMonth = current.prev(), nextMonth = current.next();

        //get the day in a week by calling getDay (toDate return the first day of the month)
        let prevDays = current.toDate().getDay();

        // add a row before this month when the first day of this month is Sunday
        if (!prevDays) {
            prevDays = 7;
        }

        let daysArr = [];

        for (let i = 0; i < prevDays; i++) {
            let dayDate = prevMonth.toDate();
            dayDate.setDate(prevMonth.dayCount - prevDays + 1 + i);
            let validate = dayRule(dayDate) !== false;
            let className = 'day' + (validate ? '' : ' disabled') + ' old';
            daysArr.push([dayDate, className, validate, prevMonth]);
        }

        for (let i = 0; i < current.dayCount; i++) {
            let dayDate = current.toDate();
            dayDate.setDate(i + 1);
            let validate = dayRule(dayDate) !== false;
            let className = 'day' + (validate ? '' : ' disabled');
            daysArr.push([dayDate, className, validate, current]);
        }

        for (let i = 0; i < 42 - prevDays - current.dayCount; i++) {
            let dayDate = nextMonth.toDate();
            dayDate.setDate(i + 1);
            let validate = dayRule(dayDate) !== false;
            let className = 'day' + (validate ? '' : ' disabled') + ' new';
            daysArr.push([dayDate, className, validate, nextMonth]);
        }


        let addSpecialDay = function (dateObj, className) {
            let monthObj = MonthObject.fromDate(dateObj), date = dateObj.getDate();
            if (!monthObj.compare(prevMonth)) {
                if (date >= prevMonth.dayCount - prevDays + 1) {
                    daysArr[date - prevMonth.dayCount + prevDays - 1][1] += className;
                }
            } else if (!monthObj.compare(current)) {
                daysArr[prevDays + date - 1][1] += className;
            } else if (!monthObj.compare(nextMonth)) {
                if (date < 42 - prevDays - current.dayCount) {
                    daysArr[prevDays + current.dayCount + date - 1][1] += className;
                }
            }
        };

        addSpecialDay(new Date, ' today');
        addSpecialDay(active, ' active');

        let rows = [];
        for (let i = 0; i < 6; i++) {
            let row = [];
            for (let j = 0; j < 7; j++) {
                let item = daysArr[7 * i + j];
                row.push(
                    <td key={j} className={item[1]}
                        onClick={item[2] ? (event) => onDaySelect(item[0], event) : null}>
                        {item[0].getDate()}
                    </td>);
            }
            rows.push(<tr key={i}>{row}</tr>);
        }

        let weekTitleArray = [];
        for (let i = 0; i < 7; i++) {
            weekTitleArray.push(<th key={i} className='dow'>{weekTitle(i)}</th>);
        }

        return (
            <div className='datepicker-days' style={style}>
                <table className='table'>
                    <thead>
                    <tr>
                        <th className='prev' onClick={me.onPrevClick.bind(me)}>«</th>
                        <th colSpan='5' className='datepicker-switch'
                            onClick={(event) => { onMonthTitleClick(event); }}>
                            {monthTitle(current.year, current.month - 1)}
                        </th>
                        <th className='next' onClick={me.onNextClick.bind(me)}>»</th>
                    </tr>
                    <tr>{weekTitleArray}</tr>
                    </thead>
                    <tbody onWheel={me.onWheel.bind(me)}>{rows}</tbody>
                </table>
            </div>
        );
    }
}