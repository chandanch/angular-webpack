/**
 * setup the express server
 * this is to make the hot module reloading work
 */
const config = require("./config")
const path = require("path")
const express = require("express")
const webpack = require("webpack")
// use the webpack config based on the enviornment or build type
const webpack_config = process.env.NODE_ENV === 'testing'
  ? require('./webpack_prod_config')
  : require('./webpack_dev_config')

// specify port for listening to the incomming traffic
// if user specified port or default port
const port = process.env.PORT || config.dev.port

// create the express server
const app = express()

// add the webpack configuration depending on env
const compiler = webpack(webpack_config)

// a wrapper for webpack, servers files emitted by the webpack
// configure the webpack-dev-middleware
const devMiddleware = require("webpack-dev-middleware")(compiler, {
    // path reference of the output file
    "publicPath": webpack_config.output.publicPath,
    // display all information to console
    "quiet": true,
})

// enable the hot middleware
const hotMiddleware = require("webpack-hot-middleware")(compiler, {
    "log": () => {}
})

// refresh page when the template changes
compiler.plugin("compilation", function (compilation) {
    compilation.plugin("html-webpack-plugin-after-emit", function (data, cb) {
        // action when the template is updated
        // basically refreshes the page 
        hotMiddleware.publish({ action: "reload" })
        // informs compiler that the async cycle is finished
        cb()
    })
})

// serve bundled output generated by webpack
app.use(devMiddleware)

// enable hmr and state-preserving
// display error on compilation
app.use(hotMiddleware)

// port that the app listens
// can be default or user specified port
module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }

    console.log(`listening on: http://localhost:${port}`)
})