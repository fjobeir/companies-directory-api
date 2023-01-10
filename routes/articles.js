var express = require("express");
var router = express.Router();
const isAuthorized = require("../middlewares/isAuthorized");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  store,
  index,
  show,
  update,
  destroy
} = require("../controllers/ArticleController");
const {
  titleValidation,
  contentValidation,
} = require("../services/validationService");

router.post(
  "/",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, {
      admin: { matchId: false },
      company: { matchId: false },
    }),
  titleValidation,
  contentValidation,
  store
);

router.get("/", isAuthenticated, index);

router.get("/:id", isAuthenticated, show);

router.put(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, {
      admin: { matchId: false },
      company: { matchId: true },
    }),
  titleValidation,
  contentValidation,
  update
);

router.delete(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, {
      admin: { matchId: false },
      company: { matchId: true },
    }),
  destroy
);

module.exports = router;
