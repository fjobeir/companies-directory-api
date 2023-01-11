var express = require("express");
var router = express.Router();

const isAuthorized = require("../middlewares/isAuthorized");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { errorResponse } = require("../services/validationService");
const { store } = require("../controllers/contactController");

router.post('/',
    isAuthenticated,
    (req, res, next) => isAuthorized(req, res, next, {
        company: {},
        user: {}
    }),
    errorResponse,
    store
)

module.exports = router