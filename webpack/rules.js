// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [require.resolve("babel-loader")]
  },
  {
    test: /\.css$/,
    exclude: /index.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          importLoaders: 1,
          modules: true
        }
      },
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            path: path.resolve(__dirname, "..", "postcss.config.js")
          }
        }
      }
    ]
  },
  {
    test: /index.css$/,
    use: [MiniCssExtractPlugin.loader, "css-loader"]
  },
  {
    test: /\.svg$/,
    loader: "@svgr/webpack"
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/,
    type: "asset/resource",
    generator: {
      filename: "images/[hash][ext][query]"
    }
  }
];

module.exports = rules;
