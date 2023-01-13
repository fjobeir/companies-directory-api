var express = require("express");
const { body } = require("express-validator");
const { store } = require("../controllers/reviewController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");
const { commentValidation, errorResponse } = require("../services/validationService");
var router = express.Router();

router.post(
    '/',
    isAuthenticated,
    function(req, res, next) {
        isAuthorized(req, res, next, {user: {}})
    },
    commentValidation,
    body('rate', 'Rate must be between 1 and 5').custom((value) => {
        return (value > 0 && value < 6)
    }),
    errorResponse,
    store
)

module.exports = router