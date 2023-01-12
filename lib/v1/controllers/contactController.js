const models = require('../models')

const store = async (req, res) => {
    const { type = '', value = '' } = req.body
    let instance
    if (req.user.type == 'company') {
        instance = await models.Company.findByPk(req.user.id)
    } else {
        instance = await models.User.findByPk(req.user.id)
    }
    await instance.createContact({
        type,
        value
    })
}

module.exports = {
    store
}