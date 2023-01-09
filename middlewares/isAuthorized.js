const isAuthorized = (req, res, next, roles = {}) => {
    if (roles[req.user.type]) {
        const shouldMatch = roles[req.user.type].matchId
        if (!shouldMatch || (shouldMatch && req.user.id == req.params.id)) {
            return next()
        }
    }
    res.status(403)
    return res.send({
        success: false,
        messages: ['You are not authorized']
    })
}

module.exports = isAuthorized