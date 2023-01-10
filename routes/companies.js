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
    upload(req, res, (err) => checkUpload(err, next));
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

router.get("/", isAuthenticated, index);

router.post(
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

router.get(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, {
      company: { matchId: true },
      admin: { matchId: false },
    }),
  show
);

module.exports = router;
