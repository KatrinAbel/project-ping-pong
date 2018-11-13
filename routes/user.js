const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require("../config/cloudinary");
const cloudinary = require('cloudinary');
const Table = require("../models/Table")
const Match = require("../models/Match")

//const Table = require("")
//const Match = require("")

/* Ensure logged in middleware */
function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect("/auth/login");
  }
}

// GET profile page
router.get("/pending-invite", ensureAuthenticated, (req,res,next) => {
  let id = req.user._id
  Match.find({_player2: id, status: "pending"})
  .populate("_player1")
  .then(matchData => {
    res.render("match/pending-invite", {matchData});
  })
})

// Lets the user update their profile
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
    res.redirect('/profile')
  })
  .catch(error => {
    console.log(error)
  })
});

// Delete logged in user-profile from DB
router.post('/profile-delete', ensureAuthenticated, (req, res, next) => {
  let id = req.user._id
  User.findByIdAndDelete(id)
  .then(user => {
    res.redirect('/auth/signup')
  })
  .catch(error => {
    console.log(error)
  })
});

// POST 
// delete match if user presses the "decline match" button
router.post('/pending-invite/decline/:id', ensureAuthenticated, (req,res,next) =>{
  let id = req.params.id
  console.log("debug id", id)
  Match.findByIdAndDelete(id)
  .then(match => {
    res.redirect('/homepage') 
  })
  .catch(error => {
    console.log(error)
  })
})

// POST 
// accept match if user presses the "accept match" button
// uptates the status of the user in a specitic match
router.post('/pending-invite/accept/:id', ensureAuthenticated, (req,res,next) =>{
  let id = req.params.id
  let update = {
    status: "open"
} 
  Match.findByIdAndUpdate(id, update)
  .then(match => {
    res.redirect('/homepage') 
  })
  .catch(error => {
    console.log(error)
  })
});

router.get("/profile", ensureAuthenticated, (req, res, next) => {
  let user = req.user;
  res.render("user/profile", { user });
});

router.get("/profile-edit", ensureAuthenticated, (req, res, next) => {
  let user = req.user;
  res.render("user/profile-edit", { user });
});

module.exports = router;
