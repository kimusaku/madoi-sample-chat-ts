module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
  output: {
    library: "main"
  },
  devServer: {
    contentBase: "dist",
    watchContentBase: true,
    open: true,
    port: 9000
    }
};
