import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MonthObject from './MonthObject';

export default class MonthPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: props.current,
            active: props.active
        };
    }

    componentWillReceiveProps(newProps) {
        if (this.state.current !== newProps.current || this.state.active !== newProps.active) {
            this.setState({
                current: newProps.current,
                active: newProps.active
            });
        }
    }

    onPrevClick(event) {
        event.stopPropagation();
        const {current} = this.state;
        this.setState({
            current: current - 1
        });
    }

    onNextClick(event) {
        event.stopPropagation();
        const {current} = this.state;
        this.setState({
            current: current + 1
        });
    }

    onWheel(deltaMode) {
        deltaMode.stopPropagation();
        deltaMode.preventDefault();
        const {current} = this.state;
        this.setState({
            current: current + (deltaMode.deltaY < 0 ? 1 : -1)
        });
    }

    render() {

        let me = this;

        /* *
         *
         *current        -   String(MonthObject.year)
         *active         -   Date
         *onYearTitleClick   -   func()
         *yearTitle      -   func(year  -   number)
         *monthText     -   func(index  -   number) index ranges from 0 to 11
         *
         * */
        const {onYearTitleClick, yearTitle, monthText, onMonthSelect, style} = me.props;
        const {current, active} = me.state;


        let monthArr = [];
        for (let i = 0; i < 12; i++) {
            monthArr.push([monthText(i), 'month']);
        }

        let addSpecialMonth = function (date, className) {
            let monthObj = MonthObject.fromDate(date);
            if (monthObj.year == current) {
                monthArr[monthObj.month - 1][1] += className;
            }
        };
        addSpecialMonth(new Date, ' today');
        addSpecialMonth(active, ' active');

        let spans = [];
        for (let i = 0; i < 12; i++) {
            let item = monthArr[i];
            spans.push(<span className={item[1]} key={i}
                             onClick={(event) => { onMonthSelect(i, event); }}>{item[0]}</span>);
        }

        return (
            <div className='datepicker-days' style={style}>
                <table className='table'>
                    <thead>
                    <tr>
                        <th className='prev' onClick={me.onPrevClick.bind(me)}>«</th>
                        <th colSpan='5' className='datepicker-switch'
                            onClick={(event) => { onYearTitleClick(event); }}>
                            {yearTitle(current)}
                        </th>
                        <th className='next' onClick={me.onNextClick.bind(me)}>»</th>
                    </tr>
                    </thead>
                    <tbody onWheel={me.onWheel.bind(me)}>
                    <tr>
                        <td colSpan='7'>
                            {spans}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
