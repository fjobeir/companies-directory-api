var express = require("express");
const { store, index, update, destroy, show } = require("../controllers/categoryController");
var router = express.Router();
const { body, checkSchema, check } = require('express-validator');
const multer = require('multer');
const isAdmin = require("../middlewares/isAdmin");
const { storage, uploadFilter } = require("../services/uploadService");

const upload = multer({
    storage: storage,
    fileFilter: uploadFilter('image'),
    limits: {
        fileSize: 1_000_000
    }
}).single('icon')

let errors = ''

router.post("/",
    isAdmin,
    function (req, res, next) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                errors = err.message
            } else if (err) {
                errors = 'file is required to be an image'
            }
            return next()
        })
    },
    check('icon').custom((value, { req }) => {
        if (req.file) {
            return true
        }
        return false
    }).withMessage(function () {
        return `The icon is invalid: ${errors?.toLocaleLowerCase() || ''}`
    }),
    body('name', 'Name length should be between 2 and 20').isLength({ min: 2, max: 20 }),
    body('description', 'Description length should be between 2 and 20').isLength({ min: 2, max: 20 }),
    store
);
router.get("/", index);
router.put("/:id", update);
router.delete("/:id", destroy);
router.get('/:id', show);

module.exports = router;