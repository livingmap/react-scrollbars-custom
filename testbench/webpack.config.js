const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dist = path.join(__dirname, "dist");

module.exports = {
  mode: "development",
  devtool: "source-map",
  target: "web",
  entry: {
    "dist/bundle.js": path.join(__dirname, "app/index.tsx")
  },
  output: {
    path: dist,
    filename: "[name]",
    publicPath: "/"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  optimization: {
    minimize: false,
    noEmitOnErrors: true,
    nodeEnv: "production"
  },
  devServer: {
    contentBase: dist,
    port: 3000,
    compress: true,
    //open:        true,
    progress: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "/app/index.html"),
      inject: false
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: "html-loader"
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            comments: true,
            cacheDirectory: false,
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: [
                      "Chrome >= 52",
                      "FireFox >= 44",
                      "Safari >= 7",
                      "Explorer 11",
                      "last 4 Edge versions"
                    ]
                  }
                }
              ],
              "@babel/preset-typescript",
              "@babel/preset-react"
            ],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-object-rest-spread"
            ]
          }
        }
      }
    ]
  }
};
