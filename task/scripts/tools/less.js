var path = require('path'),
    fs = require('fs'),
    less = require('less'),
    config = require('../../config/build'),
    logger = require('../utils/logger'),
    cat = require('../utils/cat'),
    mkdir = require('../utils/mkdir');

var defaultOptions = {
    paths: [config.srcDir],
    compress: true
};

module.exports = function (filePath, options) {
    return new Promise(function (resolve, reject) {

        var targetDir = path.join(config.buildDir, filePath);
        targetDir = targetDir.substr(0, targetDir.lastIndexOf('/'));
        var targetFile = filePath.substr(filePath.lastIndexOf('/') + 1).replace(/\.less$/, '.css');

        var lessOptions = Object.assign({
            filename: targetFile
        }, defaultOptions, options);
        var taskLogger = logger('less', filePath).start();
        filePath = path.join(config.srcDir, filePath);

        cat(filePath).then(function (data) {
            less.render(data, lessOptions, function (err, output) {
                if (err) {
                    reject(err.message);
                } else {
                    mkdir(targetDir).then(function () {
                        fs.writeFile(path.join(targetDir, targetFile), output.css, {flag: 'w+'}, function (e) {
                            if (e) {
                                reject(e);
                                taskLogger.error(e);
                            } else {
                                taskLogger.finish();
                                resolve(path.join(targetDir, targetFile), output.css);
                            }
                        });
                    }, function () {
                        reject(arguments);
                        taskLogger.error(arguments);
                    }).catch(function () {
                        reject(arguments);
                        taskLogger.error(arguments);
                    });
                }
            });
        }, function () {
            reject(arguments);
            taskLogger.error(arguments);
        }).catch(function () {
            reject(arguments);
            taskLogger.error(arguments);
        });
    });
};