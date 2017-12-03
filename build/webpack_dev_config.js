const path = require("path")
const config = require("./config")
const base_webpack_config = require("./webpack_base_config")

const webpack = require("webpack")
const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")
const WebpackBuildNotifierPlugin = require("webpack-build-notifier")


Object.keys(base_webpack_config.entry).forEach(function (name) {
    base_webpack_config.entry[name] = [path.join(__dirname, "dev_client")].concat(base_webpack_config.entry[name])
})


module.exports = merge(base_webpack_config, {
    "plugins": [
        new webpack.DefinePlugin({
            "process.env": config.dev.env
        }),
        
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(__dirname, "..", "src")
        ),

        new WebpackBuildNotifierPlugin({ "title": "build complete" }),
        
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
