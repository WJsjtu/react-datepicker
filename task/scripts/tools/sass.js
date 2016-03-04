var path = require('path'),
    fs = require('fs'),
    sass = require('node-sass'),
    config = require('../../config/build'),
    logger = require('../utils/logger'),
    cat = require('../utils/cat'),
    mkdir = require('../utils/mkdir');

var defaultOptions = {
    includePaths: [config.srcDir],
    outputStyle: 'compressed'
};

module.exports = function (filePath, options) {
    return new Promise(function (resolve, reject) {

        var targetDir = path.join(config.buildDir, filePath);
        targetDir = targetDir.substr(0, targetDir.lastIndexOf('/'));
        var targetFile = filePath.substr(filePath.lastIndexOf('/') + 1).replace(/\.s(a|c)ss$/, '.css');
        var targetPath = path.join(targetDir, targetFile);

        var taskLogger = logger('sass', filePath).start();
        filePath = path.join(config.srcDir, filePath);

        var lessOptions = Object.assign({
            file: filePath,
            outFile: targetPath
        }, defaultOptions, options);

        sass.render(lessOptions, function (err, result) {
            if (err || !result.css) {
                reject(err);
            } else {
                mkdir(targetDir).then(function () {
                    fs.writeFile(targetPath, result.css, {flag: 'w+'}, function (e) {
                        if (e) {
                            reject(e);
                            taskLogger.error(e);
                        } else {
                            taskLogger.finish();
                            resolve(path.join(targetDir, targetFile), result.css);
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
    });
};