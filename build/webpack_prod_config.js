const path = require("path")
const config = require("./config")
const base_webpack_config = require("./webpack_base_config")

const webpack = require("webpack")
const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WebpackBuildNotifierPlugin = require("webpack-build-notifier")
const CompressionWebpackPlugin = require("compression-webpack-plugin")

// extend the config from webpack_base_config
module.exports = merge(base_webpack_config, {
    "plugins": [
        
       // defines the global constants
        new webpack.DefinePlugin({
            // set the node env as production
            "process.env": config.build.env
        }),
        
        // minify the bundle
        // remove unused or unreachable code
        new webpack.optimize.UglifyJsPlugin({
            // use the compress option to compress warnings, errors
            "compress": { "warnings": false },
            // generate source map: false
            "sourceMap": false,
            // remove comments: false
            "comments": false,
            // disable mangler: false
            "mangle": true,
            "minimize": true
        }),
    
        //overriding the inferred information or context
        new webpack.ContextReplacementPlugin(
             // get the correct current folder or context for angular libraries
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(__dirname, "..", "src")
        ),

        // notifies webpack build errors: success or error or waring
        // uses the title option to specify the notification title
        new WebpackBuildNotifierPlugin({ "title": "webpack build completed" }),
        
       // skip emiting if there are errors during compilation, 
        //ensures that no assets are emitted that has errors
        new webpack.NoEmitOnErrorsPlugin(),
        
        // Generate HTML dynamically.
        // all the chunks are automatically injected
        new HtmlWebpackPlugin({
            "filename": "index.html",
            "template": "../index.html",
            "inject": true
        }),
        
        // compress the assets
        new CompressionWebpackPlugin({
            // add path of the origin asset
            asset: "[path].gz[query]",
            // compression algorithm to use
            algorithm: "gzip",
            // assets matching the regex are processsed
            test: new RegExp(
                "\\.(" + config.build.productionGzipExtensions.join("|") +")$"
            ),
            // assers bigger than the below size are only processed
            threshold: 10240,
            // assets than compress better than the specified ratio are compressed
            minRatio: 0.8
        }),
    ]
})
