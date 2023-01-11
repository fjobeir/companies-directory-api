var express = require("express");
var router = express.Router();
const multer = require("multer");
const {
  store,
  login,
  index,
  update,
  destroy,
  show,
  me,
} = require("../controllers/companyController");
const {
  nameValidation,
  emailValidation,
  passwordValidation,
  addressValdation,
  logoValdation,
  bannerValdation,
  checkUpload,
} = require("../services/validationService");
const { storage, uploadFilter } = require("../services/storageService");
const isAuthorized = require("../middlewares/isAuthorized");
const isAuthenticated = require("../middlewares/isAuthenticated");

const upload = multer({
  storage: storage,
  fileFilter: uploadFilter("image"),
  limits: { fileSize: 1_000_000 },
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

router.post(
  "/register",
  (req, res, next) => {
    upload(req, res, (err) => {
      console.log(req.files)
      checkUpload(err, next)
    });
  },
  logoValdation,
  bannerValdation,
  nameValidation,
  emailValidation,
  passwordValidation,
  addressValdation,
  store
);

router.post("/login", emailValidation, passwordValidation, login);

router.get("/", index);

router.put(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, {
      company: { matchId: true },
      admin: { matchId: false },
    }),
  (req, res, next) => {
    upload(req, res, (err) => checkUpload(err, next));
  },
  logoValdation,
  bannerValdation,
  nameValidation,
  emailValidation,
  passwordValidation,
  addressValdation,
  update
);

router.delete(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, {
      company: { matchId: true },
      admin: { matchId: false },
    }),
  destroy
);


router.get('/me', isAuthenticated, function(req, res, next) {
  isAuthorized(req, res, next, {company: {}})
}, me)

router.get(
  "/:id",
  show
);

module.exports = router;
