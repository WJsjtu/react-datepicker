const {PropTypes, createElement} = React;
const {findDOMNode} = ReactDOM;

const PureRenderMixin = require('react-addons-pure-render-mixin');
const DateMixin = require('./DateMixin');
const language = require('./language');
const PickerPanel = require('./PickerPanel');

require('./style.less');

module.exports = React.createClass({

    displayName: 'DatePicker',

    mixins: [PureRenderMixin, DateMixin],

    propTypes: {
        fontSize: PropTypes.number,
        date: PropTypes.shape({
            year: PropTypes.number,
            month: PropTypes.number,
            day: PropTypes.number
        }),
        onSelect: PropTypes.func,
        rule: PropTypes.func,
        format: PropTypes.string,
        lang: PropTypes.oneOf(['en', 'zh']),
        position: PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
    },

    getDefaultProps: function () {
        return {
            fontSize: 12,
            date: {},
            onSelect: console.log.bind(console),
            rule: () => true,
            format: 'yyyy-MM-dd',
            lang: 'en',
            position: 'bottom'
        };
    },

    getInitialState: function () {
        const {fontSize, date} = this.props;
        return {
            fontSize: fontSize,
            date: date,
            focused: false
        };
    },

    componentDidMount: function () {
        this.mounted = true;

    },

    componentWillUnmount: function () {
        this.mounted = false;
    },

    getDateText: function () {
        const date = this.state.date;
        const lang = language[this.props.lang] || language.en;
        if (!date.year || !date.month || !date.day) return lang.placeholder;
        const dateObject = new Date();
        dateObject.setFullYear(date.year);
        dateObject.setMonth(date.month - 1);
        dateObject.setDate(date.day);
        return this.dateFormat(dateObject, this.props.format);
    },

    onSelect: function (year, month, day) {
        this.setState({
            date: {year, month, day}
        }, function () {
            this.props.onSelect(year, month, day);
        });
    },

    onBlur: function (event) {
        let element = event.srcElement;
        while (element && element != findDOMNode(this.refs.comp)) {
            element = element.parentElement;
        }
        if (!element) {
            this.mounted && this.setState({
                focused: false
            }, function () {
                document.removeEventListener('click', this.onBlur);
            });
        }
    },

    onFocus: function () {
        this.mounted && this.setState({
            focused: true
        }, function () {
            document.addEventListener('click', this.onBlur);
        });
    },

    render: function () {

        const {fontSize, date, focused} = this.state;

        const width = fontSize * 21;

        const style = {width, fontSize};

        const position = this.props.position;

        const height = fontSize * 16.8 + 3;

        if (position == 'top') {
            style.top = -height - fontSize * 2.1 - 6;
            style.left = 0;
        } else if (position == 'left') {
            style.left = -3 - width;
            style.top = -height / 2 - fontSize - 1;
        } else if (position == 'right') {
            style.left = 3 + width;
            style.top = -height / 2 - fontSize - 1;
        } else {
            style.top = 0;
            style.left = 0;
        }

        return (
            <div className='date-picker' ref='comp'>
                <div className='input' style={style} onClick={this.onFocus}>
                    <span style={{padding: `0 ${fontSize}px`}}>{this.getDateText()}</span>
                </div>
                {focused &&
                <div className='picker-wrapper'>
                    <div className='picker' style={style}>
                        <PickerPanel lang={this.props.lang}
                                     width={width}
                                     date={date}
                                     rule={this.props.rule}
                                     onSelect={this.onSelect}/>
                    </div>
                </div>
                }
            </div>
        );
    }
});