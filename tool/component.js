var fs = require('fs');
var path = require('path');
var log = require('./log');
var mkdir = require('./mkdir');
var webpack = require('./webpack');


var distPath = path.join(__dirname, './../dist/components/');
mkdir(distPath);

var argsFiles = process.argv.splice(2);
var componentName = argsFiles[0];
var logger = log('component-' + componentName, 'src/' + componentName + '/index.js');
logger.start();
webpack(
    path.join(__dirname, './../test/' + componentName + '/index.js'),
    path.join(__dirname, './../dist/components/' + componentName + '.js')
).then(function () {
    logger.finish();
}, function (e) {
    logger.error(e);
});