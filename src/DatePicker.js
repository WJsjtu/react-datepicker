import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MonthObject from './MonthObject';
import DayPicker from './DayPicker';
import MonthPicker from './MonthPicker';
import YearPciker from './YearPicker';

if (process.env.NODE_ENV !== 'production') {
    require('./DatePicker.less');
}

const doc = document;

let onEvent = (name, cb) => {
    if (!doc.addEventListener && doc.attachEvent) {
        doc.attachEvent('on' + name, cb);
    } else {
        doc.addEventListener(name, cb);
    }
};

let offEvent = (name, cb) => {
    if (!doc.removeEventListener && doc.detachEvent) {
        doc.detachEvent('on' + name, cb);
    } else {
        doc.removeEventListener(name, cb);
    }
};

let isOutside = (elements, event) => {
    let eventTarget = (event.target) ? event.target : event.srcElement;
    if (eventTarget.parentElement == null && eventTarget != doc.body.parentElement) {
        return false;
    }
    while (eventTarget != null) {
        if (elements.indexOf(eventTarget) != -1) return false;
        eventTarget = eventTarget.parentElement;
    }
    return true;
};


let clearTime = (dateObj) => {
    dateObj.setHours(0);
    dateObj.setMinutes(0);
    dateObj.setSeconds(0);
    return dateObj;
};

export default class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeDate: clearTime(props.activeDate),
            currentDate: clearTime(props.currentDate),
            picker: +props.picker
        }
    }

    componentWillReceiveProps(newProps) {
        let _actvieDate = clearTime(newProps.activeDate);
        let _currentDate = clearTime(newProps.currentDate);
        if (this.state.activeDate.getTime() != _actvieDate.getTime() ||
            this.state.currentDate.getTime() != _currentDate.getTime() ||
            this.state.picker != +newProps.picker
        ) {
            this.setState({
                activeDate: _actvieDate,
                currentDate: _currentDate,
                picker: +newProps.picker
            });
        }
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        offEvent('click', me.closePicker.bind(me));
        this.mounted = false;
    }

    closePicker(event) {

        event && (event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true);

        const me = this;

        if (!me.state.isFocused) {
            return;
        }

        if (isOutside([ReactDOM.findDOMNode(me.refs.picker)], event)) {
            if (!me.mounted) return;
            this.setState({
                isFocused: false
            }, () => {
                offEvent('click', me.closePicker.bind(me));
            });
        }
    }

    onInputFocus(event) {
        event && event.stopPropagation();
        const me = this;
        me.setState({
            isFocused: true
        }, () => {
            onEvent('click', me.closePicker.bind(me));
        });
    }

    onDaySelect(dateObj, event) {
        event.stopPropagation();
        let _dateObject = clearTime(dateObj);
        this.setState({
            activeDate: _dateObject,
            currentDate: _dateObject
        });
        this.props.onDaySelect(_dateObject);
    }

    onMonthSelect(month, event) {//range from 0 to 11
        event.stopPropagation();
        const {currentDate} = this.state;
        currentDate.setMonth(month);
        this.setState({
            currentDate: clearTime(currentDate),
            picker: 1
        });
    }

    onYearSelect(year, event) {
        event.stopPropagation();
        const {currentDate} = this.state;
        currentDate.setFullYear(year);
        this.setState({
            currentDate: clearTime(currentDate),
            picker: 2
        });
    }

    setPicker(picker, event) {
        event.stopPropagation();
        this.setState({
            picker: picker
        });
    }

    set mounted(mounted) {
        this._mounted = mounted;
    }

    get mounted() {
        return this._mounted;
    }

    render() {

        const me = this;

        const {position, dayRule, weekTitle, monthTitle, yearTitle, monthText, format} = me.props;
        const {activeDate, currentDate, picker, isFocused} = me.state;

        let monthObject = MonthObject.fromDate(currentDate);

        let html = (
            <div>
                <DayPicker style={{display: picker == 1 ? 'block' : 'none'}}
                           active={activeDate}
                           current={monthObject}
                           dayRule={dayRule}
                           weekTitle={weekTitle}
                           monthTitle={monthTitle}
                           onMonthTitleClick={me.setPicker.bind(me, 2)}
                           onDaySelect={me.onDaySelect.bind(me)}/>
                <MonthPicker style={{display: picker == 2 ? 'block' : 'none'}}
                             active={activeDate}
                             current={monthObject.year}
                             onYearTitleClick={me.setPicker.bind(me, 3)}
                             yearTitle={yearTitle}
                             monthText={monthText}
                             onMonthSelect={me.onMonthSelect.bind(me)}/>
                <YearPciker style={{display: picker == 3 ? 'block' : 'none'}}
                            active={activeDate}
                            current={monthObject.year}
                            onYearSelect={me.onYearSelect.bind(me)}/>
            </div>
        );


        let inputHtml = (
            <input onChange={() => {}}
                   onFocus={me.onInputFocus.bind(me)}
                   type='text' key='input' ref='input'
                   className='form-control'
                   value={format(activeDate)}/>
        );

        let style = {};
        if (position % 3 == 2) {
            style.left = 0;
        } else if (position % 3 == 0) {
            style.right = 0;
        } else if (position) {
            style.left = '50%';
            style.marginLeft = -107;
        }

        if (position == 0) {
            return (
                <div className='datepicker datepicker-inline'>{html}</div>
            );
        } else {
            let pickerHtml = (
                <div key={1} className='datepicker datepicker-dropdown' style={style}>{html}</div>
            );
            if (position < 4) {
                style.bottom = 36;
            } else {
                style.top = 36;
            }

            return (
                <div style={{position: 'relative'}} ref='picker'>
                    {isFocused ? [inputHtml, pickerHtml] : [inputHtml]}
                </div>
            );
        }
    }
}

DatePicker.displayName = 'DatePicker';

DatePicker.propTypes = {
    activeDate: React.PropTypes.instanceOf(Date),
    currentDate: React.PropTypes.instanceOf(Date),
    shouldPreserve: React.PropTypes.bool,
    picker: React.PropTypes.oneOf([1, 2, 3]),
    position: React.PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    format: React.PropTypes.func,

    //DayPicker
    dayRule: React.PropTypes.func,
    //onMonthTitleClick: React.PropTypes.func,
    weekTitle: React.PropTypes.func,
    monthTitle: React.PropTypes.func,
    onDaySelect: React.PropTypes.func,

    //MonthPicker
    onYearTitleClick: React.PropTypes.func,
    yearTitle: React.PropTypes.func,
    monthText: React.PropTypes.func
    //onMonthSelect: React.PropTypes.func,

    //YearPicker
    //onYearSelect: React.PropTypes.func
};

let weekTitles = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');
let monthTitles = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

DatePicker.defaultProps = {

    activeDate: clearTime(new Date),
    currentDate: clearTime(new Date),
    shouldPreserve: true,
    picker: 1,
    position: 5,
    format: (dateObject) => {
        return dateObject.toString();
    },

    //DayPicker
    dayRule: (dateObject) => true,
    //onMonthTitleClick
    weekTitle: (day) => {
        return weekTitles[day];
    },
    monthTitle: (year, month) => {
        return monthTitles[month] + ' ' + year;
    },
    onDaySelect: (dateObject) => {
        console.log(dateObject);
    },

    //MonthPicker
    //onYearTitleClick
    yearTitle: (year) => {
        return year;
    },
    monthText: (index) => {
        return monthTitles[index];
    }
    //onMonthSelect

    //YearPicker
    //onYearSelect
};

DatePicker.Positions = {
    INLINE: 0,
    TOP: {
        AUTO: 1,
        LEFT: 2,
        RIGHT: 3
    },
    BOTTOM: {
        AUTO: 4,
        LEFT: 5,
        RIGHT: 6
    }
};

DatePicker.Pickers = {
    DAY: 1,
    MONTH: 2,
    YEAR: 3
};

window.DatePicker = DatePicker;