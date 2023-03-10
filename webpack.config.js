'use strict'

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const localReactAssetsUpdate = require('./localReactAssetsUpdate');
const path = require('path');

module.exports = (env, argv) => {
    const NODE_ENV = (argv.mode && argv.mode === 'production') ? 'production' : 'development';

    return {
        mode: NODE_ENV,

        entry: {
			'react-app/examples' : './resources/app/components/baseComponents/examples/app.tsx',
        },

        output: {
            publicPath: '/assets/',
            path: __dirname + '/public/assets',
            //path: path.resolve(__dirname, 'public/assets'),

            chunkFilename: '[name].[contenthash].js',
            filename: '[name].[contenthash].js',
            //assetModuleFilename: '[name].[contenthash][ext][query]',
            //sourceMapFilename: '[name].js.map'
            clean: {
                keep: /backgrounds/
            }, //очистка public перед рендером
        },

        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/, // matches .js, .ts, and .tsx files
                    loader: 'babel-loader', // uses babel-loader for the specified file types (no ts-loader needed)
                    exclude: /node_modules/,
                },
                /*
                {
                    test: /\.(ttf|eot|svg|png|gpg)/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name].[contenthash][ext][query]'
                    }
                },*/
                {
                    type: 'asset',
                    resourceQuery: /url/, // *.svg?url
                },
                {
                    test: /\.svg$/i,
                    issuer: /\.[jt]sx?$/,
                    use: ['@svgr/webpack'],
                },

                /* {
                     test: /\.ts(x?)$/,
                     exclude: /node_modules/,
                     use: [
                        {
                             loader: "ts-loader",
                         },
                     ],
                 },*/
                {
                    test: /\.(css|scss)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {loader: 'css-loader', options: {url: false}}, //url: false - для того, чтобы не пытался определять пути в css (например, background-image url). Когда они там относительные, выходит ошибка.
                        {loader: "sass-loader"}
                    ]
                },
            ]
        },

        resolve: {
            extensions: ['*', ".ts", ".tsx", ".js", ".jsx"],
            alias: {
                App: path.resolve(__dirname, 'resources/app/'),
                Pages: path.resolve(__dirname, 'resources/app/pages'),
                components: path.resolve(__dirname, 'resources/app/components'),
				baseComponents: path.resolve(__dirname, 'resources/app/components/baseComponents'),
				helpers: path.resolve(__dirname, 'resources/app/components/baseComponents/libs/helpers'),
            },
        },

        watch: NODE_ENV === 'development', //после запуска webpack он будет висеть в фоне и автоматически мониторить и перекомпилировать изменения (только в режиме разработки)

        devtool: NODE_ENV === 'development' ? "eval-source-map" : false,

        optimization: {
            minimize: NODE_ENV === 'production', //сжатие
            minimizer: [
                new TerserPlugin({
                    extractComments: false, //не вытаскивать комментарии в отдельный файл
                    terserOptions: {
                        format: {
                            comments: /@license/i, //сохранять комментарии только  в части лицензий
                        },
                    },
                }),
            ],
        },

        target: ['web', 'es5'],
        plugins: [
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(NODE_ENV),
            }),
            /*new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.$': 'jquery',
                'window.jQuery': 'jquery'
            }),*/
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].[contenthash].css',
                chunkFilename: "[name].[contenthash].js",
            }),

            new WebpackManifestPlugin({
                basePath: '/assets/',
                publicPath: '/assets',
                fileName: __dirname + '/public/mix-manifest.json',
            }),

			new WebpackShellPluginNext({
				onBuildStart:{
					scripts: ['echo "Webpack Start"'],
					blocking: true,
					parallel: false
				},
				onAfterDone:{
					scripts: [localReactAssetsUpdate],
					blocking: false,
					parallel: true
				},

				//onDoneWatch
			}),
            //new BundleAnalyzerPlugin(),
        ],
    }
}

