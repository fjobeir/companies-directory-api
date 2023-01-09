const models = require('../models')
const { getInstanceById } = require('../services/modelService')
const { validateName } = require('../services/validationService')

const store = async (req, res, next) => {
    const result = {
        success: true,
        data: null,
        messages: []
    }
    const { name = '', provinceId = null } = req.body
    const province = await getInstanceById(provinceId, 'Province')
    if (!province.success) {
        res.status(province.status)
        result.success = false
        result.messages.push('Please enter a valid province id')
    }
    if (!result.success) {
        // validation failed
        res.send(result)
        return
    }
    const city = await models.City.create({
        name,
        provinceId
    })
    if (city) {
        result.data = city
        result.messages.push('City created successfully')
    } else {
        result.success = false
        result.messages.push('Please try again later')
    }
    return res.send(result)
}
const index = async (req, res, next) => {
    const result = {
        success: true,
        data: null,
        messages: []
    }
    const cities = await models.City.findAll({
        include: [
            models.Province
        ]
    })
    result.data = cities
    return res.send(result)
}
const show = async (req, res, next) => {
    const result = {
        success: false,
        data: null,
        messages: []
    }
    const item = await getInstanceById(req.params.id, 'City')
    if (item.success) {
        result.success = true
        result.data = item.instance.dataValues
        result.data.Province = await item.instance.getProvince({raw: true})
    }
    result.messages = [...item.messages]
    res.status(item.status)
    return res.send(result)
}
const update = async (req, res, next) => {
    const result = {
        success: false,
        data: null,
        messages: []
    }
    const { name = '', provinceId = null } = req.body
    const province = await getInstanceById(provinceId, 'Province')
    const item = await getInstanceById(req.params.id, 'City')
    if (!province.success) {
        result.messages.push('Please enter a valid province id')
    } else {
        
        if (item.success) {
            if (!validateName(name)) {
                result.messages.push('Please enter a valid city name')
            } else {
                result.success = true
                await item.instance.update({
                    name,
                    provinceId
                })
                result.data = item.instance
                result.messages.push('City updated successfully')
            }
        } else {
            result.messages = [...item.messages]
        }
    }


    res.status(item.status)
    return res.send(result)
}
/*
const destroy = async (req, res, next) => {
    const result = {
        success: true,
        data: null,
        messages: []
    }
    const id = +req.params.id
    if (typeof id === 'number' && id > 0) {
        const province = await models.Province.findByPk(id)
        if (province) {
            await province.destroy()
            result.messages.push('Province deleted successfully')
        } else {
            res.status(404)
            result.success = false
            result.messages.push('Province not found')
        }
    } else {
        res.status(422)
        result.success = false
        result.messages.push('Please provide a valid id')
    }
    return res.send(result)
}
*/

const destroy = async (req, res, next) => {
    const result = {
        success: false,
        data: null,
        messages: []
    }
    const item = await getInstanceById(req.params.id, 'City')
    if (item.success) {
        result.success = true
        await item.instance.destroy()
        result.messages.push('City deleted successfully')
    } else {
        result.messages = [...item.messages]
    }
    res.status(item.status)
    return res.send(result)
}

module.exports = {
    store,
    index,
    show,
    update,
    destroy
}