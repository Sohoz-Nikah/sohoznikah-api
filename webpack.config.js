import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import nodeExternals from "webpack-node-externals";
import CopyPlugin from "copy-webpack-plugin";

export default {
  mode: "production",
  entry: "./src/server.ts",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/config/keys/private.key",
          to: "../config/keys/private.key",
        },
        { from: "src/config/keys/public.key", to: "../config/keys/public.key" },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  output: {
    filename: "server.bundle.js",
    path: path.resolve("./dist/server"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  target: "node",
};
