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

/* GET player page */
router.get('/player', (req, res, next) => {
  let p1 = Table.find()
  let p2 = User.find()
  Promise.all([p1, p2])
  .then(values => {

    // Displaying selected table
    let tableData = values[0][0].address

    // Passing userData to be able to select direct user
    let userData = values[1]

    // Defining randomUser
    // Put this here or define as third promise and pass in promise.all?
    User.find()
    .then(data => {
      let usernames = []
      for (let i = 0; i<data.length; i++) {
        usernames.push(data[i].username)
      }
      let randomName = usernames[Math.floor(Math.random()*usernames.length)]
      console.log("debug randomName", randomName)
      
      // Render match/player site
      console.log("player table passed", tableData)
      console.log("player user passed", userData)
      console.log("player random passed", randomName)
      res.render('match/player', {tableData, userData, randomName});
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
router.post("/confirm/direct", ensureAuthenticated, (req, res, next) => {
 p1 = Table.find()
  // .then(tableData => {
  // let table = tableData[0]
  // console.log("confirm debug table id", table._id)
  // console.log("confirm debug table address", table.address)
  // res.render('match/confirm', {table});
  // })

p2 = User.findOne({username: req.body.directOpponent})
//  // Passing entire user object to confirm page
//  .then(opponentDirect => {
//    console.log("confirm debug direct opponent", opponentDirect)
//    res.render("match/confirm", {opponentDirect})
//  })

 Promise.all([p1, p2])
 .then(values => {
   let table = values[0][0]
   let opponentDirect = values[1]
   res.render("match/confirm", {table, opponentDirect})
 })
})

/* POST handle input random player */
router.post("/confirm/random", ensureAuthenticated, (req, res, next) => {
  p1 = Table.find()
  p2 = User.findOne({username: req.body.randomOpponent})
  // // Passing entire user object to confirm page
  // .then(opponentRandom => {
  //   console.log("debug random opponent", opponentRandom)
  //   res.render("match/confirm", {opponentRandom})
  // })

  Promise.all([p1, p2])
  .then(values => {
    let table = values[0][0]
    let opponentRandom = values[1]
    res.render("match/confirm", {table, opponentRandom})
  })
 })

/* POST handle match input and send confirmation e-mail */
router.post("/confirm/submit", ensureAuthenticated, (req, res, next) => {

  // define variables for new match
  let table = req.body.table
  console.log("debug table", table)
  let playerOne = req.user._id
  console.log("debug playerOne", playerOne)
  // let playerTwo = () => {
  //     if (req.body.opponentDirect) {
  //       req.body.opponentDirect
  //     }
  //     else {req.body.opponentRandom}
  //   }
  let playerTwo = req.body.opponentDirect
  // let playerTwo = req.body.opponentRandom
  console.log("debug playerTwo", playerTwo)
  let message = req.body.message
  console.log("debug message", message)

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
      console.log("debug user mail", email)
      let opponentUsername = userData.username
      console.log("debug user name", opponentUsername)

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

      .then(info => res.render('/homepage'))
      .catch(error => console.log("Error sending mail", error))
    })
  })
      
})

module.exports = router;
