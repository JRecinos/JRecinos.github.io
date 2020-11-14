const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const host = process.env.HOST || 'localhost'

module.exports = {
  entry: {
    'compi-app': './src/components/compi-app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist', '.'),
    filename: '[name]-[hash].js',
    chunkFilename: '[chunkhash].js'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.js']
  },
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        include: path.join(__dirname, 'imgs'),
        loader: 'url-loader?limit=30000&name=imgs/[name].[ext]',
        test: /\.(png|svg|jpg|gif)$/
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: process.cwd(),
    compress: true,
    hot: true,
    host,
    port: 2000,
    watchContentBase: true
  },
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, './node_modules/viz.js/viz.js'),
          to: 'node_modules/viz.js/viz.js'
        }
      ]
    })
  ]
}
