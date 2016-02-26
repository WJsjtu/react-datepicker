var path = require('path');
var webpack = require('webpack');
var optimization = require('./optimization');

var config = {
    entry: './src/DatePicker',
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    output: {
        path: path.join(__dirname, '../build'),
        filename: 'react-datepicker.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react']
            },
            include: path.join(__dirname, '../src'),
            exclude: ['node_modules']
        }, {
            test: /\.less$/, loader: 'style-loader!css-loader!less-loader',
            include: path.join(__dirname, '../src'),
            exclude: ['node_modules']
        }]
    }
};

webpack(config, function (err, stats) {
    if (err) {
        console.error(err);
    } else if (stats.compilation.errors.length) {
        stats.compilation.errors.forEach(function (e) {
            console.error(e.message);
        });
    } else {
        console.info('==> JS build success!');
        optimization(path.join(config.output.path, config.output.filename), {
            onNextClick: "onNextClick",
            onPrevClick: "onPrevClick",
            onWheel: "onWheel",
            onDaySelect: "onDaySelect",
            onMonthSelect: "onMonthSelect",
            onYearSelect: "onYearSelect",
            toDate: "toDate",
            fromDate: "fromDate",
            compare: "compare",
            dayCount: "dayCount",
            setIsEnter: "setIsEnter",
            setPicker: "setPicker",
            input: "input",
            year: "year",
            month: "month",
            prev: "prev",
            next: "next"
        }, {
            current: "current",
            active: "active",
            activeDate: "activeDate",
            currentDate: "currentDate",
            _year: "_year",
            _month: "_month",
            isFocused: "isFocused",
            findDOMNode: "findDOMNode",
            prop_push: "push"
        }, {
            div: "div",
            th: "th",
            table: "table",
            thead: "thead",
            tbody: "tbody",
            block: "block",
            tr: "tr",
            td: "td",
            dow: "dow",
            datepicker_days: "datepicker-days",
            datepicker_switch: "datepicker-switch",
            span: "span",
            5: "5",
            7: "7",
            _today: " today",
            _active: " active",
            _disabled: " disabled",
            day: "day",
            month: "month",
            year: "year",
            _old: " old",
            _new: " new"
        });
    }
});

var fs = require('fs');
var less = require('less');

less.render('@import "DatePicker.less";', {
    paths: [path.join(__dirname, '../src')],  // Specify search paths for @import directives
    filename: 'style.less', // Specify a filename, for better error messages
    compress: true          // Minify CSS output
}, function (e, output) {
    if (e) {
        console.error(e.message);
    } else {
        var buildPath = path.join(__dirname, '../build');
        if (!fs.existsSync(buildPath)) {
            fs.mkdirSync(buildPath);
        } else {
            var info = fs.statSync(buildPath);
            if (!info.isDirectory()) {
                fs.unlinkSync(buildPath);
                fs.mkdirSync(buildPath);
            }
        }
        fs.writeFile(path.join(__dirname, '../build/style.css'), output.css, {flag: 'w+'}, function (err) {
            if (err) throw err;
            console.info('==> CSS build success!');
        });
    }
});