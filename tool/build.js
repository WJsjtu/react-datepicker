const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const FrequencyManglePlugin = require('frequency-mangle-plugin');

const Logger = require('./Logger');
const makeDirectory = require('./makeDirectory');
const webpackTask = require('./webpackTask');

const distPath = path.resolve(__dirname, '../dist/');
const sourcePath = path.resolve(__dirname, '../src/');

const version = require('./../package.json').version;

makeDirectory(distPath);

const ChainedPromise = require('./ChainedPromise');

ChainedPromise(
    () => {
        const logger = new Logger('build-uncompressed: date-picker', 'index.js');
        logger.start();

        return webpackTask(
            {
                entry: path.join(sourcePath, 'index.js'),
                output: {
                    path: distPath,
                    filename: 'date-picker.js',
                    library: 'DatePicker',
                    libraryTarget: 'umd'
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            NODE_ENV: JSON.stringify('development'),
                            LIB_VERSION: JSON.stringify(version)
                        }
                    })
                ],
                devtool: 'source-map'
            }
        ).then(logger.finish.bind(logger), logger.error.bind(logger));
    },
    () => {
        const logger = new Logger('build-compressed: date-picker', 'index.js');
        logger.start();
        return webpackTask(
            {
                entry: path.join(sourcePath, 'index.js'),
                output: {
                    path: distPath,
                    filename: 'date-picker.min.js',
                    library: 'DatePicker',
                    libraryTarget: 'umd'
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            NODE_ENV: JSON.stringify('production'),
                            LIB_VERSION: JSON.stringify(version)
                        }
                    }),
                    new webpack.optimize.UglifyJsPlugin({
                        sourceMap: true,
                        compress: {
                            dead_code: true,
                            drop_debugger: true,
                            unused: true,
                            if_return: true,
                            warnings: false,
                            join_vars: true
                        },
                        output: {
                            comments: false
                        }
                    })
                ],
                devtool: 'source-map'
            }
        ).then(logger.finish.bind(logger), logger.error.bind(logger));
    }
);
