const path = require('path');

module.exports = {
  mode: "production",
  entry: './classic-layout/src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'classic-layout/dist'),
    filename: 'main.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
}
