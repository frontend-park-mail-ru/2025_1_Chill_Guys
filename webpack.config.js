import HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import path, { dirname } from "path";

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
    ],

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
        port: 7501,
        host: '0.0.0.0',
        allowedHosts: ['all'],
    },

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};