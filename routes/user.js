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
  Match.find({_player2: id})
  .populate("_player1")
  .then(matchData => {
    res.render("match/pending-invite", {matchData});
  })
})

// GET matches from database
router.get('/', (req, res, next) => {
  Match.find()
  .then(() => {
    res.render('pending-invite');
  })
  .catch((error) => {
    console.log(error)
  })
});


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
    console.log(user)
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
    // console.log(user)
    res.redirect('/auth/signup')
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

router.post(
  "/profile-edit",
  ensureAuthenticated,
  uploadCloud.single("photo"),
  (req, res, next) => {
    let id = req.user._id;
    let update = {
      username: req.body.username,
      team: req.body.team,
      level: req.body.level
    };
    if (req.file && req.file.url) {
      update.imgPath = req.file.url;
    }
    User.findByIdAndUpdate(id, update)
      .then(user => {
        console.log(user);
        res.redirect("/profile");
      })
      .catch(error => {
        console.log(error);
      });
  }
);

module.exports = router;
