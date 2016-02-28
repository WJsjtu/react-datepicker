var path = require('path');

var ReactPropArray = [
    "Component",
    "createElement",
    "state",
    "props",
    "PropTypes",
    "bind",
    "setState",
    "stopPropagation",
    "preventDefault"
];

var ReactFuncArray = [
    "onClick",
    "render",
    "componentWillReceiveProps"
];

var propArr = [
    "current",
    "active",
    "activeDate",
    "currentDate",
    "_year",
    "_month",
    "isFocused",
    "findDOMNode",
    "push",
    "addEventListener",
    "attachEvent",
    "removeEventListener",
    "detachEvent",
    "parentElement",
    "target"
];

var funcArr = [
    "onNextClick",
    "onPrevClick",
    "onWheel",
    "onDaySelect",
    "onMonthSelect",
    "onYearSelect",
    "toDate",
    "fromDate",
    "compare",
    "dayCount",
    "setPicker",
    "input",
    "year",
    "month",
    "prev",
    "next",
    "picker",
    "onInputFocus",
    "closePicker"
];

var strArr = [
    "div",
    "th",
    "table",
    "thead",
    "tbody",
    "block",
    "none",
    "tr",
    "td",
    "dow",
    "datepicker-days",
    "datepicker-switch",
    "span",
    "5",
    "7",
    " today",
    " active",
    " disabled",
    "day",
    "month",
    "year",
    " old",
    " new",
    "click"
];

module.exports = {
    srcDir: path.join(__dirname, '../../src'),
    destDir: path.join(__dirname, '../../build'),
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    js: [
        ['DatePicker.js', {
            name: 'react-datepicker', useOptimization: {
                prop: ReactPropArray.concat(propArr),
                func: ReactFuncArray.concat(funcArr),
                str: strArr
            }
        }]
    ],
    less: [
        ['DatePicker.less', {name: 'react-datepicker'}]
    ]
};