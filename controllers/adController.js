const { Op } = require("sequelize");
const models = require("../models");
const { adsTransformer } = require("../transformers/adTransformer");

const store = async (req, res, next) => {
    const httpResponse = {
        success: true,
        data: null,
        messages: [],
    };
    const {
        startDate,
        endDate,
        target,
    } = req.body;

    const ad = await models.Ad.create({
        companyId: req.user.id,
        startDate,
        endDate,
        photo: req.file.filename,
        target
    })
    if (ad) {
        httpResponse.data = ad,
        httpResponse.messages.push('Ad added successfully')
    } else {
        httpResponse.success = false
        httpResponse.messages.push('Please try again later')
    }
    return res.send(httpResponse);
};


const index = async (req, res, next) => {
    const httpResponse = {
        success: true,
        data: null,
        messages: [],
    };
    let where = {}
    if (req.user.type != 'admin') {
        const today = new Date().toJSON().substring(0, 10)
        where = {
            [Op.and]: [
                {
                    startDate: {
                        [Op.lte]: today
                    },
                    endDate: {
                        [Op.gte]: today
                    }
                }
            ]
        }
    }
    const ads = await models.Ad.findAll({
        where
    })
    httpResponse.data = adsTransformer(ads)
    return res.send(httpResponse)

};
const update = async (req, res, next) => {

};
const destroy = async (req, res, next) => {

};
const show = async (req, res, next) => {

};
module.exports = {
    store,
    index,
    update,
    destroy,
    show
};