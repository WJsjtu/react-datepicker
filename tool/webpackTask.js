'use strict';

const path = require('path'),
    webpack = require('webpack');

const pkgInfo = require('./../package.json');

const banner = `/**
* ${pkgInfo.name} v${pkgInfo.version}
*
* Copyright 2016-present, ${pkgInfo.author.name}, contributors.
* All rights reserved.
*
* This source code is licensed under the ${pkgInfo.license} license found in the
* LICENSE file in the root directory of this source tree.
*
*/`;

/**
 * Merge object deeply.
 * @param {object} target Target Object
 * @param {object} obj Source object.
 * @return {object} Merged object.
 */
const mergeObject = (target, obj) => {

    if (typeof target != 'object' || typeof obj != 'object') return;

    Object.keys(obj).forEach((key) => {

        if (target.hasOwnProperty(key)) {
            if (Array.isArray(target[key]) && Array.isArray(obj[key])) {
                target[key] = obj[key].concat(target[key]);
            } else if (typeof target[key] == 'object' && typeof obj[key] == 'object') {
                mergeObject(target[key], obj[key]);
            } else {
                target[key] = obj[key];
            }
        } else {
            target[key] = obj[key];
        }
    });

    return target;
};


/**
 * Build nested loaders string.
 * @deprecated
 * @param {object} loaders Loader objects.
 * @return {string} Loader string for webpack loader url.
 */
const buildLoaderString = (loaders) => {
    const result = [];
    Object.keys(loaders).forEach((key) => {

        const params = [];

        if (loaders[key] && typeof loaders[key] == 'object') {

            Object.keys(loaders[key]).forEach((paramName) => {
                const value = loaders[key][paramName];
                params.push(paramName + (value ? '=' + value.toString() : ''));
            });

        }

        result.push(
            key + (params.length ? '?' + params.join('&') : '')
        )
    });
    return result.join('!');
};


/**
 * Default webpack options for the project.
 */
const webpackOptions = {
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    entry: '',
    output: {},
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }, {
                test: /\.(less|css)$/,

                include: [
                    path.resolve(__dirname, '../src')
                ],
                exclude: [
                    path.resolve(__dirname, '../node_modules')
                ],

                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]',
                            minimize: true
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            }, {
                test: /\.(tmpl|txt)$/,
                exclude: /node_modules/,
                loader: 'raw-loader'
            }
        ]
    },
    plugins: [
        //new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.BannerPlugin({
            banner: banner,
            raw: true,
            entryOnly: true
        })
    ],

    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, '../src')
        ]
    },

    target: 'web',

    context: path.resolve(__dirname, '../src'),

    devtool: false//'source-map'
};

/**
 * @module WebpackTask
 * @exports WebpackTask
 * @param options {object} Webpack options
 * @return {Promise}
 */
module.exports = (options) => {

    options = mergeObject(webpackOptions, options);

    return new Promise((resolve, reject) => {
        webpack(options, (err, stats) => {
            if (err) {
                reject(err);
            } else if (stats.compilation.errors.length) {
                var messages = [];
                stats.compilation.errors.forEach((e) => {
                    messages.push(e.message);
                });
                reject(messages.join('\n'));
            } else {
                resolve();
            }
        });
    });
};