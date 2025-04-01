const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { fileURLToPath } = require('url');
const { dirname } = require('path');


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

module.exports = {
  entry: './src/main.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true,
    hot: true, 
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], 
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};