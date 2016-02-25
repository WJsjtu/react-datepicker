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
            test: /\.less$/, loader: "style-loader!css-loader!less-loader",
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
        optimization(path.join(config.output.path, config.output.filename));
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