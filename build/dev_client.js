const hotClient = require("webpack-hot-middleware/client?noInfo=true&reload=true")
// subscibe for reload events emitted by hot middleware client
hotClient.subscribe(function (event) {
    if (event.action === "reload") {
        // for reload event refresh the page
        window.location.reload()
    }
})