var fs = require('fs');
var path = require('path');
var less = require('less');
var Q = require('q');
var buildConfig = require('./config.js');
var recurseTask = require('./recursion');
var mkdir = require('./mkdir');
var options = require('./../config/options');
var logger = require('./console');

var lessTask = function (srcPath, options) {
    var srcDir = srcPath.substr(0, srcPath.lastIndexOf('/'));
    var srcFile = srcPath.substr(srcPath.lastIndexOf('/') + 1);
    var destDir = path.join(buildConfig.destDir, srcDir.replace(buildConfig.srcDir, ''));
    var destFile = options.name ? options.name + '.css' : srcFile.replace(/\.less$/, '.css');
    var destPath = path.join(destDir, destFile);

    var deferred = Q.defer();

    fs.readFile(srcPath, {encoding: 'utf8'}, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            less.render(data, {
                paths: [srcDir],
                filename: destFile,
                compress: true
            }, function (e, output) {
                if (e) {
                    deferred.reject(e.message);
                } else {
                    mkdir(destDir);
                    fs.writeFile(destPath, output.css, {flag: 'w+'}, function (_err) {
                        if (err) {
                            deferred.reject(_err);
                        } else {
                            deferred.resolve(output.css);
                        }
                    });
                }
            });
        }
    });

    return deferred.promise;
};

module.exports = function (srcNames) {

    var build = recurseTask(function (filePath, options) {
        var startObject = logger.start('less', filePath.replace(buildConfig.srcDir, 'src'));
        lessTask(filePath, options).then(function () {
            logger.end(startObject);
        }, function (rejected) {
            console.error(rejected);
        });
    });

    var cwd = buildConfig.srcDir;
    if (srcNames == '*') {
        var rawList = buildConfig.less;
        for (var index in rawList) {
            if (rawList.hasOwnProperty(index)) {
                build(path.join(cwd, index), rawList[index]);
            }
        }
    } else if (srcNames.length) {
        srcNames.forEach(function (srcName) {
            var buildOption = buildConfig.less[srcName] ? buildConfig.less[srcName] : options.less || {};
            build(path.join(cwd, srcName), buildOption);
        });
    }
};