const express = require('express');
const router  = express.Router();

/* GET login/signup page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/homepage', (req, res, next) => {
  res.render('homepage');
});

router.get('/profile', (req, res, next) => {
  res.render('profile');
});

router.get('/find-a-match', (req, res, next) => {
  res.render('match');
});

router.get('/open-games', (req, res, next) => {
  res.render('openGames');
});

router.get('/pending-request', (req, res, next) => {
  res.render('pendingRequest');
});


module.exports = router;
