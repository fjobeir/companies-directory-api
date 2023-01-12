var express = require("express");
var router = express.Router();
const multer = require('multer')
const {
    imageValdation,
    checkUpload,
    dateValidation,
    dateAfter,
    urlValidation,
    errorResponse,
  } = require("../services/validationService");
const isAuthorized = require("../middlewares/isAuthorized");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { check, body } = require("express-validator");
const { store, index } = require("../controllers/adController");
const { storage, uploadFilter } = require("../services/storageService");
const hasUser = require("../middlewares/hasUser");
const upload = multer({
    storage: storage,
    fileFilter: uploadFilter("image"),
    limits: { fileSize: 1_000_000 },
}).single("photo");

router.post('/',
    isAuthenticated,
    (req, res, next) => isAuthorized(req, res, next, { company: {} }),
    (req, res, next) => {
        upload(req, res, (err) => checkUpload(err, next));
    },
    imageValdation,
    check('startDate', 'Start date should match the YYYY-MM-DD syntaxt').custom((value) => {
        return dateValidation(value)
    }),
    check('endDate', 'End date should match the YYYY-MM-DD syntaxt').custom((value) => {
        return dateValidation(value)
    }),
    check('datesOrder', 'The end date should be after the start date')
        .custom((value, { req }) => {
            return dateAfter(req.body.startDate, req.body.endDate)
        }),
    body('target', 'Please enter a valid target URL').custom((value) => {
        return urlValidation(value)
    }),
    errorResponse,
    store
)
router.get('/', hasUser, index)


module.exports = router;