var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var buildConfig = require('./build');

module.exports = function (entries, port) {
    port = port || 3000;
    entries = entries.length || [path.join(buildConfig.srcDir, 'index')];

    var config = {
        entry: {
            vendor: [
                'react-hot-api',
                'react-hot-loader',
                'webpack-dev-server/client?http://localhost:' + port,
                'webpack/hot/only-dev-server'
            ].concat(Object.keys(buildConfig.externals)),
            app: entries
        },
        output: {
            path: buildConfig.buildDir,
            filename: 'bundle.js',
            publicPath: '/build/'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: Infinity,
                filename: 'common.js'
            }),
            new webpack.optimize.OccurenceOrderPlugin()
        ],
        module: {
            loaders: [{
                test: /\.less$/, loader: 'style!css!less',
                exclude: ['node_modules']
            }, {
                test: /\.js$/,
                loader: 'react-hot',
                include: buildConfig.srcDir,
                exclude: [buildConfig.nodeDir]
            }, {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: [
                        'transform-es3-member-expression-literals',
                        'transform-es3-property-literals',
                        'transform-es5-property-mutators',
                        'transform-class-properties'
                    ]
                },
                include: buildConfig.srcDir,
                exclude: [buildConfig.nodeDir]
            }]
        }
    };

    new WebpackDevServer(webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,
        noInfo: false,
        stats: {colors: true},
        open: true,
        historyApiFallback: true
    }).listen(port, 'localhost', function (error) {
        if (error) {
            console.error(error);
        }
        console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
    });
};


