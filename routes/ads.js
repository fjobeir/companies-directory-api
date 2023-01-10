var express = require("express");
var router = express.Router();
const {
    imageValdation,
    checkUpload,
  } = require("../services/validationService");
const isAuthorized = require("../middlewares/isAuthorized");
const isAuthenticated = require("../middlewares/isAuthenticated");
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
)


module.exports = router;