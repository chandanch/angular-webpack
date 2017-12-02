const config = require("./config")
const path = require("path")
const express = require("express")
const webpack = require("webpack")
const webpack_config = process.env.NODE_ENV === 'testing'
  ? require('./webpack_prod_config')
  : require('./webpack_dev_config')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port

// create the express app
const app = express()

// insert the config for webpack
const compiler = webpack(webpack_config)

// configure the webpack-dev-middleware
const devMiddleware = require("webpack-dev-middleware")(compiler, {
    "publicPath": webpack_config.output.publicPath,
    "quiet": true,
})

// enable the hot middleware
const hotMiddleware = require("webpack-hot-middleware")(compiler, {
    "log": () => {}
})

// force page reload when html-webpack-plugin template changes
compiler.plugin("compilation", function (compilation) {
    compilation.plugin("html-webpack-plugin-after-emit", function (data, cb) {
        hotMiddleware.publish({ action: "reload" })
        cb()
    })
})

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// make app listen on specified port
module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }

    console.log(`listening on: http://localhost:${port}`)
})