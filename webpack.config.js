const path = require('path');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');

const SCRIPTS_INPUT_DIR = './src/scripts';
const SCRIPTS_OUTPUT_DIR = './scripts';

const scriptEntryPoints = {};
fs.readdirSync(SCRIPTS_INPUT_DIR)
  .filter((f) => f.endsWith('.ts'))
  .forEach(
    (f) => (scriptEntryPoints[path.basename(f, '.ts')] = './' + path.join(SCRIPTS_INPUT_DIR, f))
  );

module.exports = (env) => ({
  mode: env.development ? 'development' : 'production',
  entry: {
    'chart-info': './src/chart-info/main.ts',
    'classic-layout': './src/classic-layout/main.tsx',
    'dx-achievement': './src/dx-achievement/main.tsx',
    'index-page': './src/index-page/main.tsx',
    'plate-progress': './src/plate-progress/main.tsx',
    'rating-calculator': './src/rating-calculator/main.ts',
    'rating-visualizer': './src/rating-visualizer/main.tsx',
    ...scriptEntryPoints,
  },
  output: {
    path: `${__dirname}/build`,
    filename: (pathData) => {
      const chunkName = pathData.chunk.name;
      if (scriptEntryPoints[chunkName]) {
        return path.join(SCRIPTS_OUTPUT_DIR, chunkName + '.js');
      }
      return chunkName + '/main.bundle.js';
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{from: 'public/', to: './'}],
    }),
  ],
});
