'use strict';

const clc = require('cli-color');

/**
 * @class Logger
 */
class Logger {

    /**
     * @constructor
     * @param {string} taskName
     * @param {string} fileName
     */
    constructor(taskName, fileName) {

        this.taskName = taskName;
        this.fileName = fileName;
    }

    /**
     * Get current time string.
     * @param {Date} current Current Date object.
     * @return {string}
     */
    static getTimeString(current) {
        return ['hour', 'minute', 'second'].map((name) => {
            const capitalFirstLetter = name.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
                return $1.toUpperCase() + $2;
            });
            return +current['get' + capitalFirstLetter + 's']();
        }).map((value) => (value < 10 ? '0' : '') + value).join(':');
    }

    /**
     *
     * @return {string}
     */
    get taskName() {
        return this._taskName;
    }

    /**
     *
     * @param {string} taskName
     */
    set taskName(taskName) {
        this._taskName = taskName;
    }

    /**
     *
     * @return {string}
     */
    get fileName() {
        return this._fileName;
    }

    /**
     *
     * @param {string} fileName
     */
    set fileName(fileName) {
        this._fileName = fileName;
    }

    /**
     *
     * @param {Date} finishTime
     */
    set finishTime(finishTime) {
        this._finishTime = finishTime;
    }

    /**
     *
     * @return {Date}
     */
    get finishTime() {
        return this._finishTime;
    }

    /**
     *
     * @param {Date} startTime
     */
    set startTime(startTime) {
        this._startTime = startTime;
    }

    /**
     *
     * @return {Date}
     */
    get startTime() {
        return this._startTime;
    }

    /**
     *
     * @return {Logger}
     */
    start() {
        this.startTime = new Date();
        console.log(
            '[' + clc.blackBright(Logger.getTimeString(this.startTime)) + '] ' +
            'Starting \'' + clc.cyan(this.taskName) + '\'...'
        );
        return this;
    }

    /**
     *
     * @return {Logger}
     */
    finish() {
        this.finishTime = new Date();
        console.log(
            '[' + clc.blackBright(Logger.getTimeString(this.finishTime)) + '] ' +
            clc.green('Finished') + ' \'' +
            clc.cyan(this.taskName) +
            '\' after ' +
            clc.magenta('' + this.finishTime.getTime() - this.startTime.getTime() + ' ms ') +
            clc.blue(this.fileName)
        );
        return this;
    }

    /**
     *
     * @param {*} args
     * @return {Logger}
     */
    error(args) {
        this.finishTime = new Date();
        console.error(
            '[' + clc.blackBright(Logger.getTimeString(this.finishTime)) + '] ' +
            clc.red('Error') +
            '\' after ' +
            clc.magenta('' + this.finishTime.getTime() - this.startTime.getTime() + ' ms ') +
            clc.blue(this.fileName) +
            clc.red(' ' + args.toString())
        );
        return this;
    }

}


module.exports = Logger;