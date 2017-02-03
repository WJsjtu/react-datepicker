import {Component, PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import locale, {DEFAULT_LANGUAGE} from './../locale';

import DayPicker from './DayPicker';
import MonthPicker from './MonthPicker';
import YearPicker from './YearPicker';

import DateUtils from './../utils/DateUtils';

/**
 * Create a Symbol for empty date.
 * @type {Symbol|number}
 */
export const PICKER_EMPTY_DATE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('Picker.EmptyDate') || Math.random();

/**
 * Shared dummy function instance.
 */
export const PICKER_DUMMY_FUNC = () => true;

/**
 *
 * @param {object} dateObject
 * @return {{activeYear, activeMonth, activeDay, currentYear: number, currentMonth: number, currentDay: number, panelYear, panelMonth}}
 */
const fixDateObject = (dateObject)=> {
    if (PICKER_EMPTY_DATE === dateObject) dateObject = {};
    let {year, month, day} = dateObject;

    const currentDate = new Date();

    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);

    if (year < 0 || isNaN(year)) year = currentDate.getFullYear();
    if (month < 0 || isNaN(month)) month = currentDate.getMonth() + 1;
    if (day < 0 || isNaN(day)) day = 0;

    return {
        activeYear: year,
        activeMonth: month,
        activeDay: day,
        currentYear: currentDate.getFullYear(),
        currentMonth: currentDate.getMonth() + 1,
        currentDay: currentDate.getDate(),
        panelYear: year,
        panelMonth: month
    };
};

/**
 * The state is of the following shape:
 *
 * State: {
 *      panel:          number,
 *      activeYear:     number,
 *      activeMonth:    number,
 *      currentMonth:   number,
 *      currentDay:     number,
 *      panelYear:      number,
 *      panelMonth:     number
 * }
 *
 * Here the state is used instead of props, because in some situation (e.g. inline mode) the picker is the most outer component.
 * And the picker has a private state - panel which is closely related with some ui events inside it.
 * So the main control of state lays in in Picker component in my design.
 *
 * @class Picker
 * @export Picker
 * @module Picker
 */
export default class Picker extends Component {


    constructor(props) {

        super(props);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.onDaySelect = ::this.onDaySelect;
        this.onMonthSelect = ::this.onMonthSelect;
        this.onYearSelect = ::this.onYearSelect;
        this.switchTitle = ::this.switchTitle;

        this.state = Object.assign(fixDateObject(this.props.date), {
            panel: 1
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.date === this.props.date) return;

        const {panelYear, panelMonth} = this.state;

        //reserve the panel state
        this.setState(
            Object.assign(
                fixDateObject(nextProps.date),
                {
                    panelYear,
                    panelMonth
                }
            )
        );
    }

    onDaySelect(year, month, day) {
        this.setState({
            activeYear: year,
            activeMonth: month,
            activeDay: day,
            panelYear: year,
            panelMonth: month
        });
        this.props.onSelect(year, month, day);
    }

    onMonthSelect(month) {
        this.setState({
            panel: 1,
            panelMonth: month
        });
    }

    onYearSelect(year) {
        this.setState({
            panel: 2,
            panelYear: year
        });
    }

    switchStep(step, event) {
        event.stopPropagation();

        const {panel, panelYear, panelMonth} = this.state;

        switch (panel) {
            case 1:
                const switchedArray = (step < 0 ? DateUtils.getPrevMonth : DateUtils.getNextMonth)(panelYear, panelMonth);
                this.setState({
                    panelYear: switchedArray[0],
                    panelMonth: switchedArray[1]
                });
                break;
            case 2:
                this.setState({
                    panelYear: panelYear + step
                });
                break;
            case 3:
                this.setState({
                    panelYear: panelYear + 10 * step
                });
                break;
            default:
                break;
        }
    }

    switchTitle(event) {
        event.stopPropagation();

        const {panel} = this.state;

        switch (panel) {
            case 1:
            case 2:
                this.setState({
                    panel: panel + 1
                });
                break;
            default:
                break;
        }
    }

    renderTitle() {
        const me = this, {panel, panelYear, panelMonth} = me.state;
        const language = locale[this.props.lang] || locale.en;
        const funcType = ['day', 'month', 'year'][panel - 1];
        return <span>{language.panelTitle[funcType](panelYear, panelMonth)}</span>;
    }

    renderBody() {
        const props = {
            /*
             activeYear,
             activeMonth,
             activeDay,
             currentYear,
             currentMonth,
             currentDay,
             panelYear,
             panelMonth,
             */
            ...this.state,
            rule: this.props.rule,
            lang: this.props.lang
        };

        delete props.panel;

        switch (this.state.panel) {
            case 2:
                return <MonthPicker {...props} onCellSelect={this.onMonthSelect}/>;
                break;
            case 3:
                return <YearPicker {...props} onCellSelect={this.onYearSelect}/>;
                break;
            default:
                return <DayPicker {...props} onCellSelect={this.onDaySelect}/>;
        }
    }

    renderWeekTitle() {

        switch (this.state.panel) {
            case 1:
                const language = locale[this.props.lang] || locale.en;
                const width = this.props.width / 7;
                return (
                    <tr>{language.weekTitle.map(function (title, index) {
                        return <th style={{width: width}} key={index}>{title}</th>;
                    })}</tr>
                );
                break;
            default:
                return null;
        }
    }

    render() {
        return (
            <table>
                <thead>
                <tr>
                    <th onClick={this.switchStep.bind(this, -1)}>
                        <span>&lt;&nbsp;</span>
                    </th>
                    <th colSpan='5' onClick={this.switchTitle}>
                        <div key='title'>{this.renderTitle()}</div>
                    </th>
                    <th onClick={this.switchStep.bind(this, 1)}>
                        <span>&nbsp;&gt;</span>
                    </th>
                </tr>
                {this.renderWeekTitle()}
                </thead>
                {this.renderBody()}
            </table>
        );
    }


}

Picker.propTypes = process.env.NODE_ENV === "production" ? undefined : {
    date: PropTypes.oneOfType([
        PropTypes.shape({
            year: PropTypes.number.isRequired,
            month: PropTypes.number.isRequired,
            day: PropTypes.number.isRequired
        }),
        function (props, propName, componentName) {
            if (props[propName] !== PICKER_EMPTY_DATE) {
                return new Error(
                    'Invalid prop `' + propName + '` supplied to' +
                    ' `' + componentName + '`. Validation failed.'
                );
            }
        }
    ]),
    onSelect: PropTypes.func,
    rule: PropTypes.func,
    width: PropTypes.number,
    lang: PropTypes.oneOf(Object.keys(locale))
};

Picker.defaultProps = {
    date: PICKER_EMPTY_DATE,
    onSelect: PICKER_DUMMY_FUNC,
    rule: PICKER_DUMMY_FUNC,
    lang: DEFAULT_LANGUAGE
};

Picker.EMPTY_DATE = PICKER_EMPTY_DATE;
Picker.DUMMY_FUNC = PICKER_DUMMY_FUNC;