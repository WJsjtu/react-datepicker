import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MonthObject from './MonthObject';

export default class YearPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: parseInt(props.current / 10) * 10 - 1,
            active: props.active
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            current: parseInt(newProps.current / 10) * 10 - 1,
            active: newProps.active
        });
    }

    onPrevClick(event) {
        event.stopPropagation();
        const {current} = this.state;
        this.setState({
            current: current - 9
        });
    }

    onNextClick(event) {
        event.stopPropagation();
        const {current} = this.state;
        this.setState({
            current: current + 11
        });
    }

    onWheel(deltaMode) {
        deltaMode.stopPropagation();
        deltaMode.preventDefault();
        const {current} = this.state;
        this.setState({
            current: current + (deltaMode.deltaY < 0 ? 11 : -9)
        });
    }

    render() {

        /* *
         *
         *current        -   String(MonthObject.year)
         *active         -   Date
         * */
        const me = this;
        const {onYearSelect, style} = me.props;
        const {current, active} = me.state;


        let yearArr = [];
        for (let i = 0; i < 12; i++) {
            yearArr.push([current + i, 'year']);
        }
        yearArr[0][1] += ' old';
        yearArr[11][1] += ' new';

        let addSpecialYear = function (date, className) {
            var monthObj = MonthObject.fromDate(date);
            if (current <= monthObj.year && current + 11 >= monthObj.year) {
                yearArr[monthObj.year - current][1] += className;
            }
        };
        addSpecialYear(new Date, ' today');
        addSpecialYear(active, ' active');

        var spans = [];
        for (let i = 0; i < 12; i++) {
            let item = yearArr[i];
            spans.push(<span className={item[1]} key={i}
                             onClick={(event) => { onYearSelect(item[0], event); }}>{item[0]}</span>);
        }

        return (
            <div className='datepicker-days' style={style}>
                <table className='table'>
                    <thead>
                    <tr>
                        <th className='prev' onClick={me.onPrevClick.bind(me)}>«</th>
                        <th colSpan='5' className='datepicker-switch'>{current + 1}-{current + 10}</th>
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