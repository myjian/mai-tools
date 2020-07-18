const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    "classic-layout": "./classic-layout/src/main.tsx",
    "rating-calculator": "./rating-calculator/src/main.js",
  },
  output: {
    path: __dirname,
    filename: (pathData) => {
      switch (pathData.chunk.name) {
        case "classic-layout":
          return "classic-layout/dist/main.bundle.js";
        case "rating-calculator":
          return "rating-calculator/dist/main.bundle.js";
      }
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
