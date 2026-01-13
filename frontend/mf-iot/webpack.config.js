const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: "./src/bootstrap.tsx",

  mode: "development",

  devServer: {
    port: 3002,
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
      name: "mfIoT",
      filename: "remoteEntry.js",
      exposes: {
        "./IoTApp": "./src/IoTApp"
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true }
      }
    })
  ]
};