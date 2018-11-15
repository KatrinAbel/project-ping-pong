const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require("../config/cloudinary");
const cloudinary = require("cloudinary");
const Table = require("../models/Table");
const Match = require("../models/Match");

/* Ensure logged in middleware */
function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect("/auth/login");
  }
}

/* GET profile page */
router.get("/profile", ensureAuthenticated, (req, res, next) => {
  let user = req.user;
  res.render("user/profile", { user });
});

/* GET profile edit page */
router.get("/profile-edit", ensureAuthenticated, (req, res, next) => {
  let user = req.user;
  res.render("user/profile-edit", { user });
});

/* POST handle edit page submits */
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
    console.log(update)
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

/* POST deletes user profile */
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

/* GET pending invite page */
router.get("/pending-invite", ensureAuthenticated, (req, res, next) => {
  let id = req.user._id;
  Match.find({ _player2: id, status: "pending" })
    .populate("_player1")
    .populate("_table")
    .then(matchData => {
      console.log(matchData)
      res.render("match/pending-invite", { matchData });
    });
});

/* POST declining pending matches */
router.post(
  "/pending-invite/decline/:id",
  ensureAuthenticated,
  (req, res, next) => {
    let id = req.params.id;
    Match.findByIdAndDelete(id)
      .then(match => {
        res.redirect("/pending-invite");
      })
      .catch(error => {
        console.log(error);
      });
  }
);

/* POST accepting pending matches and changing status of match to open */
router.post(
  "/pending-invite/accept/:id",
  ensureAuthenticated,
  (req, res, next) => {
    let id = req.params.id;
    let update = {
      status: "open"
    };
    Match.findByIdAndUpdate(id, update)
      .then(match => {
        res.redirect("/pending-invite");
      })
      .catch(error => {
        console.log(error);
      });
  }
);

/* GET open games page */
router.get("/open-games", (req, res, next) => {
  let id = req.user._id;

  Match.find({$or: [{ _player2: id, status: "open" }, { _player1: id, status: "open" }]})
    .populate("_player1")
    .populate("_player2")
    .then(matchData => {
      res.render("match/open-games", { matchData });
    });
});

/* POST updating points of users based on form input and changing status of game to played */
router.post("/points-confirm", (req, res, next) => {

  // Defining ids of players and match
  let idPlayer1 = req.body.idPlayer1
  let idPlayer2 = req.user._id;
  let matchId = req.body.matchId;

  // Getting new points based on form input
  let newPointsPlayer1 = req.body.pointsPlayer1;
  let newPointsPlayer2 = req.body.pointsPlayer2;

  p1 = User.findOne({_id: idPlayer1})
  p2 = User.findOne({_id: idPlayer2})

  Promise.all([p1, p2])
  .then(values => {
    let playerData1 = values[0]
    let playerData2 = values[1]

    // Retrieving current points from database and adding the entered points value
    let currentPointsPlayer1 = playerData1.points
    let updatePointsPlayer1 = Number(currentPointsPlayer1) + Number(newPointsPlayer1)

    let currentPointsPlayer2 = playerData2.points
    let updatePointsPlayer2 = Number(currentPointsPlayer2) + Number(newPointsPlayer2)

    // Updating the database with the sum of current points and new points
    let p3 = User.findByIdAndUpdate(idPlayer1, { points: updatePointsPlayer1 });
    let p4 = User.findByIdAndUpdate(idPlayer2, { points: updatePointsPlayer2 });
    let p5 = Match.findByIdAndUpdate(matchId, { status: "played" });
  
    Promise.all([p3, p4, p5])
      .then(values => {
        res.redirect("/open-games");
      })
      .catch(err => {
        console.log(err);
      });
  })
});

/* POST deleting open matches */
router.post(
  "/points-confirm/delete/:id",
  ensureAuthenticated,
  (req, res, next) => {
    let id = req.params.id;
    console.log("debug id", id);
    Match.findByIdAndDelete(id)
      .then(match => {
        res.redirect("/open-games");
      })
      .catch(error => {
        console.log(error);
      });
  }
);

/* GET user profile overview */
router.get("/profile-overview", ensureAuthenticated, (req, res, next) => {
  User.find()
  .then(userData => {
  res.render("user/profile-overview", {userData})
  })
})

module.exports = router;
