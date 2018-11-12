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

router.get("/profile", (req,res,next) => {
  res.render("user/profile-edit");
})

router.post('/profile-edit', uploadCloud.single('photo'), (req, res, next) => {
  const updateUser = new User({
    username: req.body.username, 
    teamName: "WeWork", 
    imgPath: req.file.url, 
  })
  updateUser.save()
  .then(user => {
    res.redirect('/')
  })
  .catch(error => {
    console.log(error)
  })
});


module.exports = router;

