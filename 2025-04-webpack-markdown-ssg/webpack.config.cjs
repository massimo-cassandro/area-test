/* eslint-env node */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const PACKAGE = require('./package.json');
const path = require('path');
// const fs = require('fs');

const DOMPurify = require('isomorphic-dompurify');
const { marked } = require('marked');
const getMarkdownFiles = require('./src/webpack-getMarkdown.cjs');

const isDevelopment = process.env.NODE_ENV === 'development';


const config = {
  mode: isDevelopment? 'development' : 'production',

  watch: true,

  devtool: isDevelopment? 'inline-source-map' : false,

  // =>> entry
  // https://webpack.js.org/configuration/entry-context/
  entry: {
    'test': './src/index.js',

  },

  // =>> output
  // https://webpack.js.org/configuration/output/
  output: {
    path: path.resolve(__dirname, './build'), // path.resolve(__dirname, `./public/${output_dir}` ),
    // filename: '[name].js',
    filename: '[name].[contenthash].js',
    publicPath: './', // `/${output_dir}/`, // usato per i percorsi degli elementi importati nei js
    clean: true, //!isDevelopment,
  },

  // =>> optimization
  // https://webpack.js.org/configuration/optimization/
  optimization: {
    minimize: !isDevelopment,
    minimizer: [
      new TerserPlugin({
        // terserOptions: {
        //   format: {
        //     comments: false,
        //   },
        // },
        extractComments: false,
      }),
    ],
    runtimeChunk: 'single',
    // runtimeChunk: false,
    // runtimeChunk: { name: entrypoint => `runtime~${entrypoint.name}`,
    // splitChunks: { chunks: 'all', },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    usedExports: true,
  }, // end optimization

  // =>> performance
  // https://webpack.js.org/configuration/performance/
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  }, // end perfomance


  // =>> devServer
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, '/'),
      serveIndex: true,
    },

    open: true, // oppure nel comando cli: --open | --no-open, cambia browser: --open-app-name 'Google Chrome'
    compress: true,
    hot: true,
    // host: '0.0.0.0',
    port: 5500,
    // devMiddleware: { writeToDisk: true } // forza la scrittura su disco anche in modalità dev
  },

  module: {

    // =>> rules
    // Determine how modules within the project are treated
    rules: [

      // =>> rules: markdown (marked + html-loader)
      // https://github.com/webpack-contrib/html-loader
      // https://marked.js.org/
      // https://github.com/cure53/DOMPurify
      {
        test: /(\.md)$/i,
        // type: 'asset/source',
        use: [
          {
            loader: "html-loader",
            options: {
              preprocessor: (content, loaderContext) => {
                console.log( content);
                try {
                  console.log( DOMPurify.sanitize(marked.parse(content)));
                  return DOMPurify.sanitize(marked.parse(content));

                } catch (error) {
                  loaderContext.emitError(error);
                  return content;
                }
              },
            },
          },
        ],
      },
      // {
      //   test: /(\.md)$/i,
      //   use: [
      //     {
      //       loader: "html-loader",
      //     },
      //     {
      //       loader: "markdown-loader",
      //       options: {
      //         // Pass options to marked
      //         // See https://marked.js.org/using_advanced#options
      //       },
      //     },
      //   ],
      // }

      // =>> rules: Images / pdf
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|avif|pdf)$/i,
        // type: 'asset/resource',
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash].[ext]',
              outputPath: 'imgs/',
              esModule: false,
            }
          }
        ]
      }, // end Images / pdf

    ], // end rules
  }, // end module


    // =>> plugins
  plugins: [

    // =>> HtmlWebpackPlugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
        template: './src/index.ejs',
        inject: false,
        title: 'text Markdown',
        // chunks: ['app'],
        minify: false,
        templateParameters: {
          mdContent: getMarkdownFiles(),
        }
    }), // end HtmlWebpackPlugin
  ],

  // =>> resolve
  resolve: {
    fallback: {
      'fs': false,
      'util': false
    },
    modules: ['./', 'node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.mjs', '.cjs', '.jsx', '.json', '.scss', '.css'],
    alias: {
      '@': './',
    },
    // alias: aliases
  }

};


module.exports = config;
