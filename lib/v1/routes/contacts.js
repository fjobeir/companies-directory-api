var express = require("express");
var router = express.Router();

const isAuthorized = require("../middlewares/isAuthorized");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { errorResponse, phoneValdation, emailValidation, urlValidation, contactValidation } = require("../services/validationService");
const { store } = require("../controllers/contactController");
const { body } = require("express-validator");

router.post('/',
    isAuthenticated,
    (req, res, next) => isAuthorized(req, res, next, {
        company: {},
        user: {}
    }),
    contactValidation,
    store
)

module.exports = router