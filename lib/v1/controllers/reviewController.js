
const models = require("../models");
const { getInstanceById } = require("../services/modelService");


const store = async (req, res) => {
    const { rate, comment, companyId } = req.body
    const user = await models.User.findByPk(req.user.id)
    const company = await getInstanceById(companyId, 'Company')
    if (company.success) {
        const [review, created] = await models.Review.findOrCreate({
            where: {
                userId: req.user.id,
                companyId
            },
            defaults: {
                rate,
                comment
            }
        })
      if (created) {
        return res.send({
          success: true,
          messages: ['Review added successfully']
        })
      } else {
        return res.send({
          success: false,
          messages: ['You have already added a review to this company']
        })
      }
    }
    return res.send({
      success: false,
      messages: ['The company you are trying to add is invalid']
    })
  }

const index = async (req, res, next) => {

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