const path = require("path")
const config = require("./config")
const base_webpack_config = require("./webpack_base_config")

const webpack = require("webpack")
const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")
const WebpackBuildNotifierPlugin = require("webpack-build-notifier")


// add entry chunks to hot-module-relod
Object.keys(base_webpack_config.entry).forEach(function (name) {
    base_webpack_config.entry[name] = [path.join(__dirname, "dev_client")].concat(base_webpack_config.entry[name])
})


// extend the config from webpack_base_config
module.exports = merge(base_webpack_config, {
    "plugins": [
        // defines the global constants
        new webpack.DefinePlugin({
            // set the node env as development
            "process.env": config.dev.env
        }),
        
        //overriding the inferred information or context
        new webpack.ContextReplacementPlugin(
            // get the correct current folder or context for angular libraries
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(__dirname, "..", "src")
        ),

        // notifies webpack build errors: success or error or waring
        // uses the title option to specify the notification title
        new WebpackBuildNotifierPlugin({ "title": "Webpack finished building" }),
        
        // enable the HMR
        new webpack.HotModuleReplacementPlugin(),
        
        new webpack.NoEmitOnErrorsPlugin(),
        
        new HtmlWebpackPlugin({
            "filename": "index.html",
            "template": "../index.html",
            "inject": true
        }),
        
        new FriendlyErrorsPlugin()
    ]
})
