const express = require('express');
const router  = express.Router();
const User = require("../models/User")
const uploadCloud = require("../config/cloudinary");
const cloudinary = require('cloudinary');


//const Table = require("")
//const Match = require("")

/* Ensure logged in middleware */
function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect('/auth/login')
  }
}

router.get("/profile", ensureAuthenticated, (req,res,next) => {
  let user = req.user
  res.render("user/profile", {user});
})

router.get("/profile-edit", ensureAuthenticated, (req,res,next) => {
  let user = req.user
  res.render("user/profile-edit", {user});
})

router.post('/profile-edit', ensureAuthenticated, uploadCloud.single('photo'), (req, res, next) => {
  let id = req.user._id
  let update = {
    username: req.body.username, 
    team: req.body.team, 
    level: req.body.level,
  }
  if (req.file && req.file.url) {
    update.imgPath = req.file.url
  }
  User.findByIdAndUpdate(id, update)
  .then(user => {
    console.log(user)
    res.redirect('/profile')
  })
  .catch(error => {
    console.log(error)
  })
});




module.exports = router;

