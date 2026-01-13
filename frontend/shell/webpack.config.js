const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: "./src/main.tsx",
  mode: "development",

  devServer: {
    port: 3000,
    historyApiFallback: true
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ]
  },

  output: {
    publicPath: "auto"
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        mfContent: "mfContent@http://localhost:3001/remoteEntry.js",
        mfIoT: "mfIoT@http://localhost:3002/remoteEntry.js",
        mfUser: "mfUser@http://localhost:3003/remoteEntry.js"
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true }
      }
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new ForkTsCheckerWebpackPlugin()
  ]
};