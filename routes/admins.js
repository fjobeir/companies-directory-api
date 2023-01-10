var express = require("express");
var router = express.Router();
const {store, login, index, update, destroy, show, } = require("../controllers/adminController");
const { nameValidation, emailValidation, passwordValidation, phoneValdation } = require("../services/validationService");
const isAuthorized = require("../middlewares/isAuthorized");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post(
  "/register",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: false } }),
  nameValidation,
  emailValidation,
  passwordValidation,
  phoneValdation,
  store
);

router.post("/login", emailValidation, passwordValidation, login);

router.get(
  "/",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: false } }),
  index
);

router.put(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: true } }),
  nameValidation,
  emailValidation,
  passwordValidation,
  phoneValdation,
  update
);

router.delete(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: true } }),
  destroy
);

router.get(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: true } }),
  show
);

module.exports = router;