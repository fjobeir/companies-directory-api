const jwt = require('jsonwebtoken')

const getToken = (data) => {
    return jwt.sign(
        { ...data },
        process.env.tokenKey,
        { expiresIn: 60 * 60 * 24 * 7 }
    )
}
const verifyToken = (token) => {
    let result = null
    try {
        const payload = jwt.verify(token, process.env.tokenKey)
        if (payload) {
            result = payload
        }
    } catch(e) {
        
    }
    return result
}
module.exports = {
    getToken,
    verifyToken
}