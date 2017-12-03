const webpack = require("webpack")
const path = require("path")
const config = require("./config")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    // entry files
    "entry": {
        "polyfills": path.join(__dirname, "..", "src", "polyfills.ts"),
        "vendor": path.join(__dirname, "..", "src", "vendor.ts"),
        "client": path.join(__dirname, "..", "src", "app", "root.ts"),
    },
    
    "cache": true,
    "output": {
       // use the build asset root as path
        "path": config.build.assetsRoot,
        // use the same name as the existing one
        "filename": "[name].js",
        // check the env and select path
        "publicPath": process.env.NODE_ENV === "production"
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    // acceptable extensions for resolution
    "resolve": {
        "extensions": [".ts", ".js"]
    },
    /**
     * Loaders used: typescript loader *sass-loader: css-loader
     * html-loader
     * file-loader(to load fonts)
     */
    "module": {
        "rules": [
            {
                "test": /\.ts$/,
                "loaders": [
                    {
                        "loader": "awesome-typescript-loader",
                        "options": {
                            // typescript configurations for the loader
                            "configFileName": path.join(__dirname, "..", "tsconfig.json")
                        }
                    },
                    "angular2-template-loader"
                ]
            },
            {
                // html loader
                "test": /\.html$/,
                "loaders": ["html-loader"]
            },
            {
                "test": /\.scss|\.css$/,
                // extract the css as text
                "loader": ExtractTextPlugin.extract({
                    "fallback": "style-loader",
                    "use": ["css-loader", 
                        {
                            "loader": "sass-loader"
                        }]
                })
            },
            {
                // load fonts using the font loader
                "test": /\.(ttf|eot|svg|woff|woff2)$/,
                "loader": "file-loader?name=fonts/[name].[ext]"
            }
        ]
    },

    /**
     * Plugins used: extract-text-webpack-plugin, common-chunks-webpack-plugin
     */
    "plugins": [
        // all styles will be bundled on to the style.css
        new ExtractTextPlugin({ "filename": "style.css", "allChunks": true }),
        
        // creating chunks for entries
        new webpack.optimize.CommonsChunkPlugin({
            "name": ["client", "vendor", "polyfills", "styles"]
        }),
    ]
}
