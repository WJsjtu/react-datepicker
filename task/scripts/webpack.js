var path = require('path');
var webpack = require('webpack');
var Q = require('q');
var buildConfig = require('./config.js');
var optimization = require('./optimization');
var recurseTask = require('./recursion');
var options = require('./../config/options');

var webpackTask = function (srcPath, options) {
    var srcDir = srcPath.substr(0, srcPath.lastIndexOf('/'));
    var srcFile = srcPath.substr(srcPath.lastIndexOf('/') + 1);
    var destDir = path.join(buildConfig.destDir, srcDir.replace(buildConfig.srcDir, ''));
    var destFile = options.name ? options.name + '.js' : srcFile;
    var destPath = path.join(destDir, destFile);

    var webpackConfig = {
        entry: srcPath,
        externals: buildConfig.externals,
        output: {
            path: destDir,
            filename: destFile
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify('production')
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
                include: buildConfig.srcDir,
                exclude: ['node_modules']
            }, {
                test: /\.less$/, loader: 'style-loader!css-loader!less-loader',
                include: buildConfig.srcDir,
                exclude: ['node_modules']
            }]
        }
    };

    var deferred = Q.defer();

    webpack(webpackConfig, function (err, stats) {
        if (err) {
            deferred.reject(err);
        } else if (stats.compilation.errors.length) {
            stats.compilation.errors.forEach(function (e) {
                deferred.reject(e.message);
            });
        } else {
            if (options.useOptimization) {
                optimization(destPath, options.useOptimization, function (_err) {
                    if (_err) {
                        deferred.reject(_err);
                    } else {
                        deferred.resolve(stats);
                    }

                });
                deferred.resolve(stats);
            } else {
                deferred.resolve(stats);
            }
        }
    });

    return deferred.promise;
};

module.exports = function (srcNames) {

    var build = recurseTask(function (filePath, options) {
        webpackTask(filePath, options).then(function () {
            console.log("==> Webpack finished:\n\t" + filePath);
        }, function (rejected) {
            console.error(rejected);
        });
    });

    var cwd = buildConfig.srcDir;
    if (srcNames == '*') {
        var rawList = buildConfig.js;
        for (var index in rawList) {
            if (rawList.hasOwnProperty(index)) {
                build(path.join(cwd, index), rawList[index]);
            }
        }
    } else if (srcNames.length) {
        srcNames.forEach(function (srcName) {
            var buildOption = buildConfig.js[srcName] ? buildConfig.js[srcName] : options.webpack || {};
            build(path.join(cwd, srcName), buildOption);
        });
    }
};
