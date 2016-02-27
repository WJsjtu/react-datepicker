var path = require('path');
var webpack = require('webpack');
var optimization = require('./optimization');
var zlib = require('zlib');
var fs = require('fs');
var less = require('less');
var fstream = require('fstream');
var tar = require('tar');
var exec = require('child_process').exec;

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


var rm_rf = function (path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

var buildTasks = function () {
    webpack(config, function (err, stats) {
        if (err) {
            console.error(err);
        } else if (stats.compilation.errors.length) {
            stats.compilation.errors.forEach(function (e) {
                console.error(e.message);
            });
        } else {
            console.info('==> JS build success!');
            var filePath = path.join(config.output.path, config.output.filename);
            optimization(filePath, {
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
            }, function (_err) {

                if (_err) {
                    console.error(_err);
                } else {
                    console.log("==> Optimization finished!");
                    fstream.Reader({
                        path: config.output.path,
                        type: 'Directory'
                    }).pipe(
                        tar.Pack()
                    ).pipe(
                        zlib.Gzip()
                    ).pipe(
                        fstream.Writer({
                            path: path.join(config.output.path, 'react-datepicker.tar.gz')
                        })
                    );
                    console.log("==> Tar gzip finished!");
                }
            });
        }
    });

    less.render('@import "DatePicker.less";', {
        paths: [path.join(__dirname, '../src')],  // Specify search paths for @import directives
        filename: 'style.less', // Specify a filename, for better error messages
        compress: true          // Minify CSS output
    }, function (e, output) {
        if (e) {
            console.error(e.message);
        } else {
            fs.writeFile(path.join(__dirname, '../build/react-datepicker.css'), output.css, {flag: 'w+'}, function (err) {
                if (err) throw err;
                console.info('==> CSS build success!');
            });
        }
    });
};


var buildPath = path.join(__dirname, '../build');
if (fs.existsSync(buildPath)) {
    exec('rm -rf ' + buildPath, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Cleaning...');
            fs.mkdirSync(buildPath);
            buildTasks();
        }
    });
}