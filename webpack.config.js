const
  path = require('path'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')


module.exports = {
  mode: "development",
  entry: ["./src/wdc.js"],
  output: {
   path: path.resolve(__dirname, "dist"),
   filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env',{useBuiltIns: 'usage'}]],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inlineSource: /\.js$/,
      template: 'src/index.html'
    }),
    new HtmlWebpackInlineSourcePlugin()
  ],
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
}
