const isAuthenticated = require("./isAuthenticated")
const hasUser = (req, res, next) => {
    const auth = req?.headers?.authorization
    if (auth) {
        isAuthenticated(req, res, next)
        return
    }
    // guest
    req.user = {
        type: 'guest'
    }
    return next()
}
module.exports = hasUser