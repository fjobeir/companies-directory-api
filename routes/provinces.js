var express = require('express');
const { store, index, show, update, destroy } = require('../controllers/provinceController');
var router = express.Router();

const isAuthorized = require("../middlewares/isAuthorized");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { nameValidation } = require("../services/validationService");

router.post(
  "/",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, { admin: { matchId: false } }),
  nameValidation,
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