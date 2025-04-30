/* eslint-env node */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');

const DOMPurify = require('isomorphic-dompurify');
const { marked } = require('marked');
const getMarkdownFiles = require('./src/webpack-getMarkdown.cjs');
const htmlLoader = require('html-loader');

const isDevelopment = process.env.NODE_ENV === 'development';


const config = {
  mode: isDevelopment? 'development' : 'production',

  // watch: true,

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

      // NON FUNZIONA
      // =>> rules: markdown (marked + html-loader)
      // https://github.com/webpack-contrib/html-loader
      // https://marked.js.org/
      // https://github.com/cure53/DOMPurify
      // {
      //   test: /(\.md)$/i,
      //   // type: 'asset/source',
      //   use: [
      //     {
      //       loader: "html-loader",
      //       options: {
      //         esModule: false,
      //         preprocessor: (content, loaderContext) => {
      //           console.log(loaderContext);
      //           try {
      //             // return DOMPurify.sanitize(marked.parse(content));
      //             return marked.parse(content);

      //           } catch (error) {
      //             loaderContext.emitError(error);
      //             return content;
      //           }
      //         },
      //       },
      //     },
      //   ],
      // },

      // =>> rules: markdown (html-loader + marked)
      // https://github.com/peerigon/markdown-loader
      {
        test: /\.md$/,
        use: [
          {
            loader: "html-loader",
          },
          {
            loader: "markdown-loader",
            options: {
              // Pass options to marked
              // See https://marked.js.org/using_advanced#options
            },
          },
        ],
      },
      // =>> rules: ejs
      // https://www.npmjs.com/package/ejs-loader
      // NON FUNZIONA
      // {
      //   test: /(\.ejs)$/,
      //   use: [
      //     {
      //       loader: 'ejs-loader',
      //       options: {}
      //     }
      //   ]
      // },

      // https://github.com/snoleo/ejs-easy-loader
      // NON FUNZIONA
      // {
      //   test: /\.ejs$/i,
      //   use: [

      //     {
      //       loader: 'ejs-easy-loader'
      //     }
      //   ]
      // },


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
    // https://github.com/jantimon/html-webpack-plugin#html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.ejs',
      inject: false,
      title: 'text Markdown',
      // chunks: ['app'],
      minify: false,

      // NON RISOLVE i percorsi dei file inclusi
      templateParameters: {
        mdContent: getMarkdownFiles() || ''
      }

      // NON FUNZIONA
      // templateParameters: async (compilation, assets, assetTags, options) => {
      //   const dynamicHtml = getMarkdownFiles() || '';

      //   if (typeof dynamicHtml !== 'string') {
      //     throw new Error('dynamicHtml deve essere una stringa valida');
      //   }

      //   // Elabora la stringa HTML con html-loader
      //   const moduleCode = await htmlLoader.call(
      //     // Simula il contesto `this` per html-loader
      //     {
      //       getOptions: () => ({ esModule: false }), // Disabilita gli ES Modules
      //       resourcePath: 'dynamic.html', // Nome fittizio per il file
      //       context: path.resolve(__dirname, './src'), // Contesto del progetto
      //       emitFile: (name, content) => compilation.emitAsset(name, new webpack.sources.RawSource(content)),
      //       rootContext: path.resolve(__dirname),
      //       fs: compilation.inputFileSystem, // File system virtuale di Webpack
      //       addDependency: () => {}, // Stub per evitare errori
      //       emitError: console.error, // Per gestire eventuali errori
      //     },
      //     dynamicHtml
      //   );
      //   const processedHtml = eval(moduleCode); // Usa eval per eseguire il modulo e ottenere l'HTML
      //   return {
      //     mdContent: processedHtml,

      //     // Altri parametri
      //     compilation: compilation,
      //     webpackConfig: compilation.options,
      //     htmlWebpackPlugin: {
      //       tags: assetTags,
      //       files: assets,
      //       options: options,
      //     },
      //   };
      // },
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
