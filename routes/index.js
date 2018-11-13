const express = require("express");
const router = express.Router();

/* GET login/signup page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/homepage", (req, res, next) => {
  res.render("homepage");
});

router.get("/open-games", (req, res, next) => {
  res.render("../views/match/open-games.hbs");
});

module.exports = router;
