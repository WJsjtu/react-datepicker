var path = require('path'),
    fs = require('fs'),
    config = require('../../config/build'),
    logger = require('../utils/logger'),
    rmdir = require('../utils/rmdir');

module.exports = function (pathDir) {

    pathDir = pathDir || '';

    return new Promise(function (resolve, reject) {

        var targetDir = path.join(config.buildDir, pathDir);
        var taskLogger = logger('clean', pathDir).start();
        rmdir(targetDir).then(function () {
            fs.mkdirSync(targetDir);
            taskLogger.finish();
            resolve(targetDir);
        }, function () {
            reject(arguments);
            taskLogger.error(arguments);
        }).catch(function () {
            reject(arguments);
            taskLogger.error(arguments);
        });
    });
};