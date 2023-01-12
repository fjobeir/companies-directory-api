
const Models = require("../models");

const store = async (req, res, next) => {
    const result = {
        success: true,
        data: null,
        messages: [],
    };
    const {
        userId = "",
        companyId = "",
        comment = "",
        rate = "",
    } = req.body;
    const review = await Models.Review.create({
        userId,
        companyId,
        comment,
        rate,
    });
    if (review) {
        result.data = review;
        result.messages.push("Your review has been created successfuly");
    } else {
        (result.success = false), result.messages.push("Please try a gain");
    }
    return res.send(result);
};


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