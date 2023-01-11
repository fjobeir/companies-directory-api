var express = require("express");
var router = express.Router();
const { nameValidation, emailValidation,  passwordValidation, imageValdation, checkUpload, errorResponse} = require("../services/validationService");
const multer = require("multer");
const { storage, uploadFilter  } = require("../services/storageService");
const isAuthorized = require("../middlewares/isAuthorized");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { store, login, index, update, destroy, show, like, view } = require("../controllers/userController");
const { getInstanceById } = require("../services/modelService");
const { body } = require("express-validator");

const upload = multer({
  storage: storage,
  fileFilter: uploadFilter("image"),
  limits: { fileSize: 1_000_000 },
}).single("avatar");

router.post(
  "/register",
  (req, res, next) => {
    upload(req, res, (err) => checkUpload(err, next));
  },
  imageValdation,
  nameValidation,
  emailValidation,
  passwordValidation,
  store
);

router.post("/login", 
  emailValidation, 
  passwordValidation, 
  login);

router.get("/", 
  isAuthenticated, (req, res, next) =>
  isAuthorized(req, res, next, {admin:{matchId: false}}), 
  index);

router.put(
  "/:id",
  isAuthenticated,
  (req, res, next) => isAuthorized(req, res, next, { user: { matchId: true } , admin:{matchId: false}}),
  (req, res, next) => { upload(req, res, (err) => checkUpload(err, next));},
  imageValdation,
  nameValidation,
  emailValidation,
  passwordValidation,
  update
);

router.delete(
  "/:id",
  isAuthenticated,
  (req, res, next) => isAuthorized(req, res, next, { user: { matchId: true } , admin:{matchId: false}}),
  destroy
);

router.get(
  "/:id",
  isAuthenticated,
  (req, res, next) => isAuthorized(req, res, next, { user: { matchId: true } , admin:{matchId: false}}),
  show
);

router.post(
  '/like',
  isAuthenticated,
  (req, res, next) => isAuthorized(req, res, next, { user: { matchId: false }}),
  body('companyId', 'Please enter a valid company id').custom(async value => {
    const companyExists = await getInstanceById(value, 'Company')
    return companyExists.success
  }),
  errorResponse,
  like
)

router.post(
  '/view',
  isAuthenticated,
  (req, res, next) => isAuthorized(req, res, next, { user: { matchId: false }}),
  body('companyId', 'Please enter a valid company id').custom(async value => {
    const companyExists = await getInstanceById(value, 'Company')
    return companyExists.success
  }),
  errorResponse,
  view
)

module.exports = router;
