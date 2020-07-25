const path = require("path");
const fs = require("fs")

const SCRIPTS_DIR = "./scripts";

const scriptEntryPoints = {};
fs.readdirSync(SCRIPTS_DIR).filter(
  (f) => f.endsWith(".ts")
).forEach(
  (f) => scriptEntryPoints[f.replace(".ts", "")] = "./" + path.join(SCRIPTS_DIR, f)
);

module.exports = {
  mode: "production",
  entry: {
    "bookmarklets": "./js/bookmarklets/main.tsx",
    "classic-layout": "./js/classic-layout/main.tsx",
    "rating-calculator": "./js/rating-calculator/main.ts",
    "rating-visualizer": "./js/rating-visualizer/main.tsx",
    ...scriptEntryPoints,
  },
  output: {
    path: __dirname,
    filename: (pathData) => {
      const chunkName = pathData.chunk.name;
      if (scriptEntryPoints[chunkName]) {
        return path.join(SCRIPTS_DIR, chunkName + ".js");
      }
      return chunkName + "/main.bundle.js";
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
