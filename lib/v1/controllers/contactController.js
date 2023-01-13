const models = require('../models')

const store = async (req, res) => {
    const { type = '', value = '' } = req.body
    let instance
    if (req.user.type == 'company') {
        instance = await models.Company.findByPk(req.user.id)
    } else {
        instance = await models.User.findByPk(req.user.id)
    }
    const contact = await instance.createContact({
        type,
        value
    })
    if (contact) {
        return res.send({
            success: true
        })
    } else{
        return res.send({
            success: false,
            messages: ['Could not create this record']
        })
    }
}

module.exports = {
    store
}