import {PropTypes, Component} from 'react';
import {unmountComponentAtNode, findDOMNode, unstable_renderSubtreeIntoContainer} from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {autobind} from 'core-decorators';

import DateUtils from './utils/DateUtils';
import locale, {DEFAULT_LANGUAGE} from './locale';
import Picker, {PICKER_EMPTY_DATE, PICKER_DUMMY_FUNC} from './Picker';

import styles from './style.less';


/**
 * @class DatePicker
 * @export DatePicker
 * @export DatePicker
 * @extends React.Component
 */
export default class DatePicker extends Component {

    constructor(props) {
        super(props);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

        this.state = {
            fontSize: props.fontSize,
            date: props.date
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.fontSize !== this.props.fontSize || nextProps.date !== this.props.date) {
            this.setState({
                fontSize: nextProps.fontSize,
                date: nextProps.date
            });
        }
        this.setDropDownStyle();
    }


    /**
     *
     * @return {Element}
     */
    get node() {
        return this._node;
    }

    /**
     *
     * @param {Element} node
     */
    set node(node) {
        this._node = node;
    }

    /**
     *
     * @return {ReactElement}
     */
    get dropDown() {
        return this._dropDown;
    }

    /**
     *
     * @param {ReactElement} dropDown
     */
    set dropDown(dropDown) {
        this._dropDown = dropDown;
    }

    /**
     *
     * @return {boolean}
     */
    get inPicker() {
        return this._inPicker;
    }

    /**
     *
     * @param {boolean} inPicker
     */
    set inPicker(inPicker) {
        this._inPicker = inPicker;
    }

    componentDidMount() {

        const width = this.state.fontSize * 21;

        this.inPicker = false;

        this.node = document.createElement('div');
        this.node.className = styles['date-picker-drop-down'];
        this.setDropDownStyle();
        this.node.style.display = 'none';
        document.body.appendChild(this.node);
        this.dropDown = unstable_renderSubtreeIntoContainer(
            this,
            <div onMouseEnter={() => {
                this.inPicker = true;
            }} onMouseLeave={() => {
                this.inPicker = false;
            }}>
                <Picker lang={this.props.lang}
                        width={width}
                        date={this.state.date}
                        rule={this.props.rule}
                        onSelect={this.onSelect}/>
            </div>
            , this.node);
    }

    componentWillUnmount() {
        unmountComponentAtNode(this.node);
        document.body.removeChild(this.node);
        this.dropDown = null;
        this.node = null;
    }

    @autobind
    onBlur(event) {
        event.stopPropagation();
        if (this.inPicker) {
            findDOMNode(this).focus();
        } else {
            this.node && this.props.position.toLowerCase() != 'inline' && (this.node.style.display = 'none');
        }
    }

    @autobind
    onFocus(event) {
        event.stopPropagation();
        this.node && this.props.position.toLowerCase() != 'inline' && (this.node.style.display = 'block');
    }

    @autobind
    onSelect(year, month, day) {
        this.setState({
            date: {year, month, day}
        });
        this.props.onSelect(year, month, day);
    }

    getDateText() {
        const date = this.state.date;
        const language = locale[this.props.lang] || locale.en;
        if (!date.year || !date.month || !date.day) return language.placeholder;
        const dateObject = new Date();
        dateObject.setFullYear(date.year);
        dateObject.setMonth(date.month - 1);
        dateObject.setDate(date.day);
        dateObject.setHours(0);
        dateObject.setMinutes(0);
        dateObject.setSeconds(0);
        dateObject.setMilliseconds(0);
        return DateUtils.dateFormat(dateObject, this.props.format);
    }

    setDropDownStyle() {

        if (!this.node) return;

        const {fontSize} = this.state;

        const width = fontSize * 21;

        const style = {width, fontSize};

        const height = fontSize * 16.8 + 3;

        switch (this.props.position.toLowerCase()) {
            case 'top':
                style.top = 0 - height - 6;
                style.left = 0;
                break;
            case 'left':
                style.left = 0 - 3 - width;
                style.top = 0 - height / 2 + fontSize * 2.1 - 1;
                break;
            case 'right':
                style.left = 3 + width;
                style.top = 0 - height / 2 + fontSize * 2.1 - 1;
                break;
            case 'bottom':
            default:
                style.top = fontSize * 2.1 + 3;
                style.left = 0;
        }

        const thisNode = findDOMNode(this);
        const getLeft = (e) => {
            var offset = e.offsetLeft;
            if (e.offsetParent != null) offset += getLeft(e.offsetParent);
            return offset;
        };
        const getTop = (e) => {
            var offset = e.offsetTop;
            if (e.offsetParent != null) offset += getTop(e.offsetParent);
            return offset;
        };
        style.top += getTop(thisNode);
        style.left += getLeft(thisNode);

        this.node.style.top = style.top + 'px';
        this.node.style.left = style.left + 'px';
        this.node.style.fontSize = fontSize + 'px';
        this.node.style.width = width + 'px';
    }

    render() {

        const {fontSize, date} = this.state;

        const width = fontSize * 21;

        const style = {width, fontSize};

        switch (this.props.position.toLowerCase()) {
            case 'inline':
                return (
                    <span className={styles['date-picker']} tabIndex={this.props.tabIndex}>
                        <div className={styles['date-picker-inline']} style={style}>
                            <Picker lang={this.props.lang}
                                    width={width}
                                    date={date}
                                    rule={this.props.rule}
                                    onSelect={this.onSelect}
                            />
                        </div>
                    </span>
                );
                break;
            case 'top':
            case 'left':
            case 'right':
            case 'bottom':
            default:
                return (
                    <span className={styles['date-picker']} tabIndex={this.props.tabIndex}
                          onFocus={this.onFocus}
                          onBlur={this.onBlur}>
                        <div className={styles['input']} style={style}>
                            <span style={{padding: `0 ${fontSize}px`}}>{this.getDateText()}</span>
                        </div>
                    </span>
                );

        }
    }
}

/**
 * Prop types for DatePicker.
 * @type {{fontSize: (any), date: *, onSelect: (any), rule: (any), format: (any), lang: *, position: *}}
 */
DatePicker.propTypes = {
    tabIndex: PropTypes.number,
    fontSize: PropTypes.number,
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
    format: PropTypes.string,
    lang: PropTypes.oneOf(Object.keys(locale)),
    position: PropTypes.oneOf(['bottom', 'top', 'left', 'right', 'inline'])
};

/**
 * Default props for DatePicker.
 * @type {{fontSize: number, date: (any), onSelect: PICKER_DUMMY_FUNC, rule: PICKER_DUMMY_FUNC, format: string, lang, position: string}}
 */
DatePicker.defaultProps = {
    tabIndex: 1,
    fontSize: 12,
    date: PICKER_EMPTY_DATE,
    onSelect: PICKER_DUMMY_FUNC,
    rule: PICKER_DUMMY_FUNC,
    format: 'yyyy-MM-dd',
    lang: DEFAULT_LANGUAGE,
    position: 'bottom'
};

export const EMPTY_DATE = PICKER_EMPTY_DATE;
export const DUMMY_FUNC = PICKER_DUMMY_FUNC;
export const version = require('./../package.json').version;