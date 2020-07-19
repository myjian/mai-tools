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
    "classic-layout": "./classic-layout/src/main.tsx",
    "rating-calculator": "./rating-calculator/src/main.ts",
    "rating-visualizer": "./rating-visualizer/src/main.tsx",
    ...scriptEntryPoints,
  },
  output: {
    path: __dirname,
    filename: (pathData) => {
      const chunkName = pathData.chunk.name;
      if (scriptEntryPoints[chunkName]) {
        return path.join(SCRIPTS_DIR, chunkName + ".js");
      }
      return chunkName + "/dist/main.bundle.js";
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
