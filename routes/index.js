const express = require('express');
const router  = express.Router();

/* GET login/signup page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
