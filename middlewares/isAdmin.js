const isAuthorized = require('./isAuthorized')

const isAdmin = (req, res, next) => {
    return isAuthorized(req, res, next, {
        admin: {matchId: false}
    })
}

module.exports = isAdmin