const {PropTypes, createElement} = React;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const DateMixin = require('./DateMixin');
const language = require('./language');

const DayPicker = require('./DayPicker');
const MonthPicker = require('./MonthPicker');
const YearPicker = require('./YearPicker');

module.exports = React.createClass({

    activeDate: {},

    displayName: 'PickerPanel',

    mixins: [PureRenderMixin, DateMixin],

    propTypes: process.env.NODE_ENV === "production" ? {} : {
        date: PropTypes.shape({
            year: PropTypes.number,
            month: PropTypes.number,
            day: PropTypes.number
        }),
        onSelect: PropTypes.func,
        rule: PropTypes.func,
        width: PropTypes.number,
        lang: PropTypes.PropTypes.oneOf(['en', 'zh'])
    },

    getDefaultProps: function () {
        return {
            date: {},
            onSelect: () => true,
            rule: () => true,
            lang: 'en'
        };
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.date === this.props.date) return;

        let {year, month, day} = nextProps.date || {};

        const currentDate = new Date();

        year = parseInt(year);
        month = parseInt(month);
        day = parseInt(day);

        if (year < 0 || isNaN(year)) year = currentDate.getFullYear();
        if (month < 0 || isNaN(month)) month = currentDate.getMonth() + 1;
        if (day < 0 || isNaN(day)) day = 0;

        this.setState({
            activeYear: year,
            activeMonth: month,
            activeDay: day,
            currentYear: currentDate.getFullYear(),
            currentMonth: currentDate.getMonth() + 1,
            currentDay: currentDate.getDate(),
            panelYear: year,
            panelMonth: month
        });
    },

    getInitialState: function () {

        let {year, month, day} = this.props.date || {};

        const currentDate = new Date();

        year = parseInt(year);
        month = parseInt(month);
        day = parseInt(day);

        if (year < 0 || isNaN(year)) year = currentDate.getFullYear();
        if (month < 0 || isNaN(month)) month = currentDate.getMonth() + 1;
        if (day < 0 || isNaN(day)) day = 0;
        return {
            panel: 1,
            activeYear: year,
            activeMonth: month,
            activeDay: day,
            currentYear: currentDate.getFullYear(),
            currentMonth: currentDate.getMonth() + 1,
            currentDay: currentDate.getDate(),
            panelYear: year,
            panelMonth: month
        };
    },

    onDaySelect: function (year, month, day) {
        this.setState({
            activeYear: year,
            activeMonth: month,
            activeDay: day,
            panelYear: year,
            panelMonth: month
        }, function () {
            this.props.onSelect(year, month, day);
        });
    },

    onMonthSelect: function (month) {
        setTimeout(function () {
            this.setState({
                panel: 1,
                panelMonth: month
            });
        }.bind(this), 50);
    },

    onYearSelect: function (year) {
        setTimeout(function () {
            this.setState({
                panel: 2,
                panelYear: year
            });
        }.bind(this), 50);
    },

    switchStep: function (step, event) {
        event.stopPropagation();
        const {panel, panelYear, panelMonth} = this.state;
        if (panel == 1) {
            const switchedArray = (step < 0 ? this.getPrevMonth : this.getNextMonth)(panelYear, panelMonth);
            this.setState({
                panelYear: switchedArray[0],
                panelMonth: switchedArray[1]
            });
        } else if (panel == 2) {
            this.setState({
                panelYear: panelYear + step
            });
        } else if (panel == 3) {
            this.setState({
                panelYear: panelYear + 10 * step
            });
        }
    },

    switchTitle: function (event) {
        event.stopPropagation();
        const {panel} = this.state;
        if (panel == 1 || panel == 2) this.setState({panel: panel + 1});
    },

    renderTitle: function () {
        const me = this, {panel, panelYear, panelMonth} = me.state;
        const lang = language[this.props.lang] || language.en;
        const funcType = ['day', 'month', 'year'][panel - 1];
        return <span>{lang.panelTitle[funcType](panelYear, panelMonth)}</span>;
    },

    renderBody: function () {
        const {panel, activeYear, activeMonth, activeDay, currentYear, currentMonth, currentDay, panelYear, panelMonth} = this.state;
        const {rule, lang} = this.props;
        const props = {
            activeYear,
            activeMonth,
            activeDay,
            currentYear,
            currentMonth,
            currentDay,
            panelYear,
            panelMonth,
            rule,
            lang
        };
        return panel == 2 ? <MonthPicker {...props} onCellSelect={this.onMonthSelect}/> :
            (panel == 3 ? <YearPicker {...props} onCellSelect={this.onYearSelect}/> :
                    <DayPicker {...props} onCellSelect={this.onDaySelect}/>
            );
    },

    renderWeekTitle: function () {
        if (this.state.panel == 1) {
            const lang = language[this.props.lang] || language.en;
            const width = this.props.width / 7;
            return (
                <tr>{lang.weekTitle.map(function (title, index) {
                    return <th style={{width: width}} key={index}>{title}</th>;
                })}</tr>
            );
        } else {
            return [];
        }
    },

    render: function () {
        return (
            <table ref='table'>
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
});