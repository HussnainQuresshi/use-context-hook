// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { DIR } = process.env;

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: `./examples/${DIR}/src/index.jsx`,
  output: {
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `./examples/${DIR}/public/index.html`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "use-context-hook": `${__dirname}/dist`,
      components: `${__dirname}/examples/${DIR}/src/components`,
    },
  },
  devServer: {
    port: process.env.PORT || "3000",
    static: {
      directory: `./examples/${DIR}/public`,
    },
    historyApiFallback: true,
  },
};
