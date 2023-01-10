var express = require("express");
var router = express.Router();
const {
  nameValidation,
  imageValdation,
  checkUpload,
  descriptionValdation,
} = require("../services/validationService");
const multer = require("multer");
const { storage, uploadFilter } = require("../services/storageService");
const isAuthorized = require("../middlewares/isAuthorized");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  store,
  index,
  update,
  destroy,
  show,
} = require("../controllers/categoryController");

const upload = multer({
  storage: storage,
  fileFilter: uploadFilter("image"),
  limits: { fileSize: 1_000_000 },
}).single("icon");

router.post(
  "/",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: false } }),
  (req, res, next) => {
    upload(req, res, (err) => checkUpload(err, next));
  },
  imageValdation,
  nameValidation,
  descriptionValdation,
  store
);
router.get("/", isAuthenticated, index);

router.put(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: false } }),
  (req, res, next) => {
    upload(req, res, (err) => checkUpload(err, next));
  },
  imageValdation,
  nameValidation,
  descriptionValdation,
  update
);

router.delete(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: false } }),
  destroy
);

router.get("/:id", isAuthenticated, show);

module.exports = router;
