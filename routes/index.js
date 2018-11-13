const express = require("express");
const router = express.Router();

/* GET login/signup page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/homepage", (req, res, next) => {
  res.render("homepage");
});


module.exports = router;
