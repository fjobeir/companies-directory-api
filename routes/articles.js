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
} = require("../controllers/articleController");
const {
  titleValidation,
  contentValidation,
} = require("../services/validationService");

router.post(
  "/",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, {
      company: { matchId: false },
    }),
  titleValidation,
  contentValidation,
  store
);

router.get("/", index);

router.get("/:id", show);

router.put(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isAuthorized(req, res, next, {
      company: { matchId: false },
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
      // company id does not have to match the resource id, BUT
      // a relation of it (e.x: companyId of the article)
      // done in controller
      company: { matchId: false },
    }),
  destroy
);

module.exports = router;
