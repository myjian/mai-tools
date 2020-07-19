const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    "classic-layout": "./classic-layout/src/main.tsx",
    "rating-calculator": "./rating-calculator/src/main.ts",
    "rating-visualizer": "./rating-visualizer/src/main.tsx",
  },
  output: {
    path: __dirname,
    filename: (pathData) => {
      return pathData.chunk.name + "/dist/main.bundle.js";
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};
