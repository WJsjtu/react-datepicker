import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MonthObject from './MonthObject';
import DayPicker from './DayPicker';
import MonthPicker from './MonthPicker';
import YearPciker from './YearPicker';

if (process.env.NODE_ENV !== "production") {
    require('./datepicker.less');
}

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
            isFocused: !!props.isFocused,
            picker: +props.picker
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            activeDate: clearTime(newProps.activeDate),
            currentDate: clearTime(newProps.currentDate),
            isFocused: !!newProps.isFocused,
            picker: +newProps.picker
        });
    }

    componentDidMount() {
        if (this.state.isFocused) {
            ReactDOM.findDOMNode(this.refs.input).focus();
        }
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
        let {currentDate} = this.state;
        currentDate.setMonth(month);
        this.setState({
            currentDate: clearTime(currentDate),
            picker: 1
        });
    }

    onYearSelect(year, event) {
        event.stopPropagation();
        let {currentDate} = this.state;
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

    get isEnter() {
        return this._isEnter;
    }

    set isEnter(isEnter) {
        this._isEnter = isEnter;
    }

    onInputFocus(event) {
        event.stopPropagation();
        if (!this.state.isFocused) {
            this.setState({
                isFocused: true
            });
        }
    }

    onInputBlur(event) {
        event.stopPropagation();
        if (!this.isEnter) {
            let stateObject = {
                isFocused: false
            };
            if (!this.props.shouldPreserve) {
                stateObject.picker = 1;
                stateObject.currentDate = clearTime(this.state.activeDate || new Date);
            }
            this.setState(stateObject);
        }
    }

    setIsEnter(isEnter, event) {
        event.stopPropagation();
        this._isEnter = isEnter;
    }

    render() {
        let me = this;


        let {position, dayRule, weekTitle, monthTitle, yearTitle, monthText, format} = me.props;
        let {activeDate, currentDate, picker, isFocused} = me.state;

        let html = null;
        let monthObject = MonthObject.fromDate(currentDate);

        if (picker == 1) {
            html = (
                <DayPicker active={activeDate}
                           current={monthObject}
                           dayRule={dayRule}
                           weekTitle={weekTitle}
                           monthTitle={monthTitle}
                           onMonthTitleClick={me.setPicker.bind(me, 2)}
                           onDaySelect={me.onDaySelect.bind(me)}/>
            );
        } else if (picker == 2) {
            html = (
                <MonthPicker active={activeDate}
                             current={monthObject.year}
                             onYearTitleClick={me.setPicker.bind(me, 3)}
                             yearTitle={yearTitle}
                             monthText={monthText}
                             onMonthSelect={me.onMonthSelect.bind(me)}/>
            );
        } else if (picker == 3) {
            html = (
                <YearPciker active={activeDate}
                            current={monthObject.year}
                            onYearSelect={me.onYearSelect.bind(me)}/>
            );
        }


        let inputHtml = (
            <input onChange={() => {}}
                   type='text' key='input' ref='input'
                   className='form-control'
                   value={format(activeDate)}
                   onFocus={me.onInputFocus.bind(me)}
                   onBlur={me.onInputBlur.bind(me)}/>
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
                <div style={{position: 'relative'}}
                     onMouseEnter={me.setIsEnter.bind(me, true)}
                     onMouseLeave={me.setIsEnter.bind(me, false)}>
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
    isFocused: React.PropTypes.bool,
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
    isFocused: false,
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