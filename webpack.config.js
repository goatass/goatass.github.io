const path              = require('path');
const webpack           = require('webpack');
const merge             = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer      = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log('Start Webpack process...');

// Determine build env by npm command options
const TARGET_ENV = process.env.npm_lifecycle_event === 'build' ? 'production' : 'development';
const ENV = {};

// Common webpack config
const commonConfig = {

  // Directory to output compiled files
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name]-[hash].js',
  },

  entry: {
    index: [
      path.join( __dirname, 'src/index.js' )
    ],
    ga: [
      path.join( __dirname, 'src/js/ga.js' )
    ],
    inlineLabel: [
      path.join( __dirname, 'src/js/inline-label.js' )
    ],
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js'],
  },

  module: {
    loaders: [
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        loader: 'file-loader',
      },
      {
        test: /\.pug$/,
        loader: 'pug',
      },
      {
        test: /\.(jpg|jpeg|png)$/,
        loader: 'url'
      },
    ]
  },

  plugins: [
    // Compile static pages
    new HtmlWebpackPlugin({
      chunks: ['index', 'ga', 'inlineLabel'],
      template: 'src/pug/index.pug',
      inject:   'body',
      filename: 'index.html',
    }),

    // Inject variables to JS file.
    new webpack.DefinePlugin({
      'process.env': ENV
    }),
  ],

  postcss: () => [
    require('stylelint'),
    autoprefixer({ browsers: ['last 2 versions'] }),
    require('postcss-flexbugs-fixes'),
    require('postcss-reporter')({ clearMessages: true }),
  ],

}

// Additional webpack settings for local env (when invoked by 'npm start')
if (TARGET_ENV === 'development') {
  console.log('Serving locally...');
  const mapObjVals = (f, obj) =>
    Object.keys(obj).reduce((a, key) => {
      a[key] = f(obj[key]);
      return a;
    }, {});

  module.exports = merge(commonConfig, {

    entry: mapObjVals((v) =>
      ['webpack-dev-server/client?http://localhost:8080'],
      commonConfig.entry
    ),

    devServer: {
      contentBase: 'src',
      inline:   true,
      progress: true,
    },

    module: {
      loaders: [
        {
          test: /\.(css|scss)$/,
          loaders: [
            'style',
            'css',
            'resolve-url',
            'sass',
            'postcss',
          ]
        }
      ]
    }
  });
}

// Additional webpack settings for prod env (when invoked via 'npm run build')
if (TARGET_ENV === 'production') {
  console.log('Building for prod...');

  module.exports = merge(commonConfig, {

    module: {
      loaders: [
        {
          test: /\.(css|scss)$/,
          loader: ExtractTextPlugin.extract('style', [
            'css',
            'resolve-url',
            'sass',
            'postcss',
          ])
        }
      ]
    },

    plugins: [
      new CopyWebpackPlugin([
        {
          from: 'src/img/',
          to:   'img/',
        },
        {
          from: 'src/favicon.ico'
        },
      ]),

      new webpack.optimize.OccurenceOrderPlugin(),

      // Extract CSS into a separate file
      new ExtractTextPlugin( './[name]-[hash].css', { allChunks: true } ),

      // Minify & mangle JS/CSS
      new webpack.optimize.UglifyJsPlugin({
          minimize:   true,
          compressor: { warnings: false }
          // mangle:  true
      }),
    ]
  });
}
