const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/bootstrap.tsx",
  mode: "development",

  devServer: {
    port: 3003,
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
        exclude: /node_modules/
      }
    ]
  },

  output: {
    publicPath: "auto"
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "mfUser",
      filename: "remoteEntry.js",
      exposes: {
        "./UserApp": "./src/UserApp"
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true }
      }
    })
  ]
};