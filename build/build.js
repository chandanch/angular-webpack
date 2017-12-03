const ora = require("ora")
const rm = require("rimraf")
const path = require("path")
const webpack = require("webpack")
const config = require("./config")
const webpack_config = require("./webpack_prod_config")

// use the ora spinner - the terminal spinner
// this indicates the processing with spinner and the title
const spinner = ora("Webpack is building the app for production")
spinner.start()

// remove all the assets under the dist folder first
// generate a new bundle again
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    // throw if any error while removing files
    if (err) throw err
    webpack(webpack_config, function (err, stats) {
        spinner.stop()
        if (err) throw err
        //using the node process API write to the terminal
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + "\n\n")

        console.log("Build complete.\n")
    })
})