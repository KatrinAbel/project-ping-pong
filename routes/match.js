const express = require('express');
const router  = express.Router();
const nodemailer = require("nodemailer")
const User = require("../models/User")
const Table = require("../models/Table")
const Match = require("../models/Match")

/* Ensure logged in middleware */
function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect("/auth/login");
  }
}

/* Transporter = use Gmail server and stated user credentials for sending e-mails */
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD, 
  }
});

/* GET table page */
router.get('/match', ensureAuthenticated, (req, res, next) => {
  Table.find()
  .then(tableData => {
    res.render("match/table", {tableData})
  })
})

/* GET player page */
router.get('/match/:id', ensureAuthenticated, (req, res, next) => {
  let id = req.params.id

  // Passing selected table
  Table.findById(id)
  .then(tableData => {
    let tableTeam = tableData.team
    
    // Defining randomUser based on selected table
    User.find({team: tableTeam, _id: {$ne: req.user._id}})
    .then(userData=> {
      let usernames = []
      for (let i = 0; i<userData.length; i++) {
        usernames.push(userData[i].username)
      }
      let randomName = usernames[Math.floor(Math.random()*usernames.length)]

      res.render("match/player", {tableData, randomName})
    })
  })
});

/* GET confirm page */
// NOT NEEDED since the route should only be accessible through the player site
// router.get('/confirm', (req, res, next) => {
//   Table.find()
//   .then(tableData => {
//   let table = tableData[0]
//   console.log("confirm debug table id", table._id)
//   console.log("confirm debug table address", table.address)
//   res.render('match/confirm', {table});
//   })
// });

/* POST handle input direct player */
router.post("/match/:id/direct", ensureAuthenticated, (req, res, next) => {
  let id = req.params.id
  p1 = Table.findById(id)
  p2 = User.findOne({username: req.body.directOpponent})

 Promise.all([p1, p2])
 .then(values => {
   let tableData = values[0]
   let opponentDirect = values[1]
   // put in if statement if (!opponentDirect) res.render("match/:id") again
   res.render("match/confirm", {tableData, opponentDirect})
 })
})

/* POST handle input random player */
router.post("/match/:id/random", ensureAuthenticated, (req, res, next) => {
  let id = req.params.id
  p1 = Table.findById(id)
  p2 = User.findOne({username: req.body.randomOpponent})

 Promise.all([p1, p2])
 .then(values => {
   let tableData = values[0]
   let opponentRandom = values[1]
   console.log("debug user", opponentRandom)
   res.render("match/confirm", {tableData, opponentRandom})
 })
})

/* POST handle match input and send confirmation e-mail */
router.post("/confirm", ensureAuthenticated, (req, res, next) => {

  // define variables for new match
  let table = req.body.table

  let playerOne = req.user._id
 
  let playerTwo;
    if(req.body.opponentDirect){
      playerTwo = req.body.opponentDirect
      } else {
      playerTwo = req.body.opponentRandom
      }

  let message = req.body.message

  // create new match based on input
  let newMatch = new Match ({
    _table: table,
    _player1: playerOne,
    _player2: playerTwo,
    message: message,
  })
  console.log("debug newMatch", newMatch)

  // save new match
  newMatch.save()

  // send confirmation mail to opponent
  .then(matchData => {
    
    User.findById(playerTwo)
    .then(userData => {
      let email = userData.email
      let opponentUsername = userData.username

      transporter.sendMail({
        from: '"Pingpong" <message@pingpong.com>',
        to: email, 
        subject: "Your next Ping Pong match is waiting for you", 
        html:
        `
        <b>Hello ${opponentUsername}, you have been challenged!</b>
        <p>${req.user.username} has invited you to join a Ping Pong match! Head to our site and confirm the match now :) </p>
        `,
      })

      .then(info => res.render('homepage'))
      .catch(error => console.log("Error sending mail", error))
    })
  })
      
})

module.exports = router;
