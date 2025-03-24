import HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path, { dirname } from "path";

const __dirname = dirname("./");

console.log(__dirname)

export default {
    mode: 'production',

    plugins: [
        new HtmlBundlerPlugin({
            entry: {
                index: './public/index.html',
            },
        }),
    ],

    output: {
        path: path.resolve(__dirname, './build'),
    },

    module: {
        rules: [
            {
                test: /\.(png|jpg|svg?)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext][query]',
                }
            },
            {
                test: /\.(eot|ttf|woff2?)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext][query]',
                }
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
                test: /\.hbs$/,
                loader: "handlebars-template-loader",
            },
            {
                test: /\.ts$/,
                use: ["ts-loader", {
                    loader: 'babel-loader',
                    options: {
                        targets: "defaults",
                        presets: [
                            ["@babel/preset-typescript"]
                        ]
                    }
                }]
            },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        targets: "defaults",
                        presets: [
                            ['@babel/preset-env']
                        ]
                    }
                },
            }
        ],
    },
};