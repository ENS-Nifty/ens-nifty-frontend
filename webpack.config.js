const webpack = require('webpack');

module.exports = {
  plugins: [new webpack.DefinePlugin({'global.GENTLY': false})],
  node: {
    __dirname: true,
  },
  externals: {
  electron: "electron",
  scrypt: "scrypt"
}
};
