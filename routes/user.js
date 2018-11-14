const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require("../config/cloudinary");
const cloudinary = require("cloudinary");
const Table = require("../models/Table");
const Match = require("../models/Match");

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
router.get("/pending-invite", ensureAuthenticated, (req, res, next) => {
  let id = req.user._id;
  Match.find({ _player2: id, status: "pending" })
    .populate("_player1")
    .then(matchData => {
      res.render("match/pending-invite", { matchData });
    });
});

// Lets the user update their profile
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
        res.redirect("/profile");
      })
      .catch(error => {
        console.log(error);
      });
  }
);

// Delete logged in user-profile from DB
router.post("/profile-delete", ensureAuthenticated, (req, res, next) => {
  let id = req.user._id;
  User.findByIdAndDelete(id)
    .then(user => {
      res.redirect("/auth/signup");
    })
    .catch(error => {
      console.log(error);
    });
});

// POST
// delete match if user presses the "decline match" button
router.post(
  "/pending-invite/decline/:id",
  ensureAuthenticated,
  (req, res, next) => {
    let id = req.params.id;
    console.log("debug id", id);
    Match.findByIdAndDelete(id)
      .then(match => {
        res.redirect("/homepage");
      })
      .catch(error => {
        console.log(error);
      });
  }
);

// POST
// accept match if user presses the "accept match" button
// uptates the status of the user in a specitic match
router.post("/pending-invite/accept/:id", ensureAuthenticated, (req, res, next) => {
    let id = req.params.id;
    let update = {
      status: "open"
    };
    Match.findByIdAndUpdate(id, update)
    .then(match => {
      res.redirect("/pending-invite")
    })
    .catch(error => {
      console.log(error);
    });
  }
);

router.get("/profile", ensureAuthenticated, (req, res, next) => {
  let user = req.user;
  res.render("user/profile", { user });
});

router.get("/profile-edit", ensureAuthenticated, (req, res, next) => {
  let user = req.user;
  res.render("user/profile-edit", { user });
});

router.get("/open-games", (req, res, next) => {
  let id = req.user._id;

  Match.find({ _player2: id, status: "open" })
    .populate("_player1")
    .populate("_player2")
    .then(matchData => {
      res.render("match/open-games", { matchData });
    });
});

router.post("/points-confirm", (req, res, next) => {
  let idPlayer1 = req.body.idPlayer1
  let idPlayer2 = req.user._id;
  let matchId = req.body.matchId;
  console.log("debug matchId", matchId);

  let newPointsPlayer1 = req.body.pointsPlayer1;
  let newPointsPlayer2 = req.body.pointsPlayer2;

 /*  User.findOne({_id: idPlayer1})
  .then(playerData1 => {
   let currentPointsPlayer1 = playerData1.points
   console.log("debug currentpoints", currentPointsPlayer1)
   let updatePoints = Number(currentPointsPlayer1) + Number(newPointsPlayer1)
   console.log("debug update points", updatePoints)
  })

  User.findOne({_id: idPlayer2})
  .then(playerData2 => {
   let currentPointsPlayer2 = playerData2.points
   console.log("debug currentpoints", currentPointsPlayer2)
   let updatePoints = Number(currentPointsPlayer2) + Number(newPointsPlayer2)
   console.log("debug update points", updatePoints)
  }) */

  let p1 = User.findByIdAndUpdate(idPlayer1, { points: newPointsPlayer1 });

  let p2 = User.findByIdAndUpdate(idPlayer2, { points: newPointsPlayer2 });

  let p3 = Match.findByIdAndUpdate(matchId, { status: "played" });

  Promise.all([p1, p2, p3])
    .then(values => {
      res.redirect("/homepage");
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
