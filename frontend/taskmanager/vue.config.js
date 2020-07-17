
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? ''
    : '/',
  outputDir: 'dist',
  "devServer": {
    "proxy": "http://localhost:8080"
  },
  "transpileDependencies": [
    "vuetify"
  ]
}
