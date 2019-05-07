const withTypescript = require('@zeit/next-typescript')
const withSass = require('@zeit/next-sass')
const eyeglass = require("eyeglass");

module.exports = withTypescript(withSass({
  sassLoaderOptions: eyeglass()
}))