var express = require("express");
var router = express.Router();
const isAuthorized = require("../middlewares/isAuthorized");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  nameValidation,
  languageDirectionValidation,
  codeValidation,
} = require("../services/validationService");
const {
  store,
  index,
  show,
  update,
  destroy
} = require("../controllers/languagesController");

router.post(
  "/",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: false } }),
  nameValidation,
  languageDirectionValidation,
  codeValidation,
  store
);

router.get("/", isAuthenticated, index);

router.get("/:id", isAuthenticated, show);

router.put(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: false } }),
  nameValidation,
  languageDirectionValidation,
  codeValidation,
  update
);

router.delete(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: false } }),
  destroy
);
module.exports = router;
