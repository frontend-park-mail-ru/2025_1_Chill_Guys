import HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import path, { dirname } from "path";
import proxy from "express-http-proxy";
import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";

const __dirname = dirname("./");

export default {
    mode: 'production',

    plugins: [
        new HtmlBundlerPlugin({
            entry: {
                index: './public/index.html',
                sw: "./public/sw.ts"
            },
            favicon: "./public/favicon.ico",
            manifest: "./public/manifest.webmanifest"
        }),
        new CopyPlugin({
            patterns: [
                { from: "./public/icons", to: "./icons" },
            ],
        }),
        new MiniCssExtractPlugin(),
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            "imagemin-mozjpeg",
                            "imagemin-pngquant",
                            "imagemin-svgo",
                        ],
                    },
                },
            }),
        ],
    },

    output: {
        path: path.resolve(__dirname, './build'),
        publicPath: '/',
    },

    module: {
        rules: [
            {
                test: /\.(png|jpg?)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'font/[hash][ext][query]'
                }
            },
            {
                test: /\.(webmanifest|ico?)$/i,
                type: 'asset/resource',
                generator: {
                    filename: "[name][ext]",
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
                use: [
                    { loader: 'css-loader', options: { sourceMap: false } },
                    { loader: 'sass-loader', options: { sourceMap: false } },
                ]
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
        setupMiddlewares: (middlewares, devServer) => {
            middlewares.unshift({
                name: "default-image",
                path: '/media/product-default',
                middleware: (req, res) => {
                    res.sendFile("./src/shared/images/cover.jpeg", {
                        root: path.join(__dirname)
                    });
                },
            });
            middlewares.unshift({
                name: "ad",
                path: '/ad/',
                middleware: proxy("https://re-target.ru", {
                    proxyReqPathResolver: (req) => {
                        return "https://re-target.ru/api/v1" + req.url;
                    },
                }),
            });
            middlewares.unshift({
                name: "api",
                path: '/api/',
                middleware: proxy("http://localhost:8080", {
                    proxyReqPathResolver: (req) => {
                        return "http://localhost:8080/api" + req.url;
                    },
                }),
            });
            middlewares.unshift({
                name: "ad-api",
                path: '/api/',
                middleware: proxy("https://re-target.ru", {
                    filter: (req) => {
                        return req.headers.referer.includes("/ad/");
                    },
                    proxyReqPathResolver: (req) => {
                        return "https://re-target.ru/api" + req.url;
                    },
                }),
            });
            return middlewares;
        },
        historyApiFallback: true,
        compress: true,
        port: 7500,
        host: '0.0.0.0',
        allowedHosts: ['all'],
    },

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};