import HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import path, { dirname } from "path";
import express from "express";

const __dirname = dirname("./");

// console.log(__dirname)

export default {
    mode: 'production',

    plugins: [
        new HtmlBundlerPlugin({
            entry: {
                index: './public/index.html',
            },
            favicon: "./public/favicon.ico"
        }),
    ],

    output: {
        path: path.resolve(__dirname, './build'),
        publicPath: '/',
    },

    module: {
        rules: [
            {
                test: /\.(png|jpg|ico?)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'font/[hash][ext][query]'
                }
            },
            {
                test: /\.(eot|ttf|woff2?)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'font/[hash][ext][query]'
                }
            },
            {
                test: /\.(png|jpg|svg?)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'images',
                },
            },
            {
                test: /\.(s(a|c)ss)$/,
                use: ['css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                loader: "css-loader",
            },
            {
                test: /\.(ts|tsx)$/,
                use: ['babel-loader', "ts-loader"]
            },
            {
                test: /\.(?:js|mjs|cjs|jsx)$/,
                use: {
                    loader: 'babel-loader',
                },
            }
        ],
    },

    resolve: {
        extensions: ['.tsx', '.jsx', '.ts', '.js'],
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
            serveIndex: true,
        },
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:8080',
            }
        ],
        setupMiddlewares: (middlewares, devServer) => {
            middlewares.unshift({
                name: "p",
                path: '/media/product-default',
                middleware: (req, res) => {
                    res.sendFile("./src/shared/images/cover.jpeg", {
                        root: path.join(__dirname)
                    });
                },
            });
            return middlewares;
        },
        historyApiFallback: true,
        compress: true,
        port: 7500,
        host: '0.0.0.0',
        allowedHosts: ['all']
    },
};