var fs = require('fs');
var path = require('path');
var log = require('./log');
var mkdir = require('./mkdir');
var webpack = require('./webpack');

var distPath = path.join(__dirname, './../dist/');
mkdir(distPath);

var logger = log('build:datepicker', 'index.js');
logger.start();
webpack(
    path.join(__dirname, './../index.js'),
    path.join(__dirname, './../dist/datepicker.js'),
    true
).then(function () {
    logger.finish();
}, function (e) {
    logger.error(e);
});
webpack(
    path.join(__dirname, './../index.js'),
    path.join(__dirname, './../dist/datepicker.min.js')
).then(function () {
    logger.finish();
}, function (e) {
    logger.error(e);
});