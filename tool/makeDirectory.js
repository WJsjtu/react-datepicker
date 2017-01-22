'use strict';

const fs = require('fs');
const path = require('path');

/**
 * @module makeDirectory
 * @exports makeDirectory
 * @param {string} dirPath
 */
module.exports = (dirPath) => {

    if (!dirPath || typeof dirPath !== 'string' || fs.existsSync(dirPath)) return;

    dirPath = dirPath.replace(/\/$/, '');

    var pathArray = dirPath.split('/');

    var currentPath = pathArray[0] + '/';

    for (let i = 1, l = pathArray.length; i < l; i++) {
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }
        currentPath = path.join(currentPath, pathArray[i]) + '/';
    }
    if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
    }
};