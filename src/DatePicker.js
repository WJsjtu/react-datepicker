const {PropTypes} = React;
const {findDOMNode} = ReactDOM;

const PureRenderMixin = require('react-addons-pure-render-mixin');
import DateMixin from './utils/DateUtils';
import language from './locale';
import PickerPanel from './Picker';

const styles = require('./style.less');

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

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            fontSize: nextProps.fontSize,
            date: nextProps.date
        });
    },

    getDateText: function () {
        const date = this.state.date;
        const lang = language[this.props.lang] || language.en;
        if (!date.year || !date.month || !date.day) return lang.placeholder;
        const dateObject = new Date();
        dateObject.setFullYear(date.year);
        dateObject.setMonth(date.month - 1);
        dateObject.setDate(date.day);
        dateObject.setHours(0);
        dateObject.setMinutes(0);
        dateObject.setSeconds(0);
        dateObject.setMilliseconds(0);
        return this.dateFormat(dateObject, this.props.format);
    },

    onSelect: function (year, month, day) {
        this.setState({
            date: {year, month, day}
        }, () => {
            this.props.onSelect(year, month, day)
        });

    },

    onBlur: function (event) {
        /*
         if (!findDOMNode(this.refs.comp).contains(event.srcElement)) {
         this.mounted && this.setState({
         focused: false
         }, function () {
         document.removeEventListener('click', this.onBlur);
         });
         }
         */

        this.setState({
            focused: false
        });

    },

    onFocus: function () {
        /*
         this.mounted && this.setState({
         focused: true
         }, function () {
         document.addEventListener('click', this.onBlur);
         });
         */
        this.setState({
            focused: true
        });
    },

    render: function () {

        const {fontSize, date, focused} = this.state;

        const width = fontSize * 21;

        const style = {width, fontSize, outline: 'none'};

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
            <div className={styles['date-picker']} ref='comp' tabIndex="0" onFocus={this.onFocus}
                 onBlur={this.onBlur}>
                <div className={styles['input']} style={style}>
                    <span style={{padding: `0 ${fontSize}px`}}>{this.getDateText()}</span>
                </div>
                {focused &&
                <div className={styles['picker-wrapper']}>
                    <div className={styles['picker']} style={style}>
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