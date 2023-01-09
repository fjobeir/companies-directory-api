var express = require("express");
var router = express.Router();
var {
  store,
  login,
  index,
  update,
  destroy,
  show,
} = require("../controllers/companyController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

router.post("/register", store);
router.post("/login", login);
router.get("/", index);
router.put("/:id",
  isAuthenticated,
  function (req, res, next) {
    isAuthorized(req, res, next, {
      admin: {
        matchId: false
      },
      company: {
        matchId: true
      }
    })
  },
  update);
router.delete("/:id", destroy);
router.get("/:id", show);


module.exports = router;