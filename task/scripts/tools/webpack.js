var path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    config = require('../../config/build'),
    logger = require('../utils/logger');

var defaultOptions = {
    externals: config.externals,
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                join_vars: true
            }
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react', 'stage-0'],
                plugins: [
                    'transform-es3-member-expression-literals',
                    'transform-es3-property-literals',
                    'transform-es5-property-mutators',
                    'transform-class-properties'
                ]
            },
            include: config.srcDir,
            exclude: [config.nodeDir]
        }, {
            test: /\.less$/, loader: 'style-loader!css-loader!less-loader',
            include: config.srcDir,
            exclude: [config.nodeDir]
        }]
    }
};

module.exports = function (filePath, options) {
    return new Promise(function (resolve, reject) {
        var targetDir = path.join(config.buildDir, filePath);
        targetDir = targetDir.substr(0, targetDir.lastIndexOf('/'));
        var targetFile = filePath.substr(filePath.lastIndexOf('/') + 1).replace(/\.(js|jsx)/, '.js');

        var taskLogger = logger('webpack', filePath).start();
        filePath = path.join(config.srcDir, filePath);
        var webpackOptions = Object.assign({
            entry: filePath,
            output: {
                path: targetDir,
                filename: targetFile
            }
        }, defaultOptions, options);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            webpack(webpackOptions, function (err, stats) {
                if (err) {
                    taskLogger.error(err);
                    reject(err);
                } else if (stats.compilation.errors.length) {
                    var messages = [];
                    stats.compilation.errors.forEach(function (e) {
                        messages.push(e.message);
                    });
                    taskLogger.error(messages.join('\n'));
                    reject(messages.join('\n'));
                } else {
                    taskLogger.finish();
                    resolve(path.join(targetDir, targetFile), stats);
                }
            });
        } else {
            taskLogger.error('file not found');
            reject('file not found');
        }
    });
};