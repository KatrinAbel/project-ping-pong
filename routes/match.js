const express = require('express');
const router  = express.Router();
const Table = require("../models/Table")
const User = require("../models/User")
const nodemailer = require("nodemailer")
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
    let tableData = values[0]

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
      console.log("debug usernames", usernames)
    })
    let randomName = usernames[Math.floor(Math.random()*usernames.length)]
    console.log("debug randomName", randomName)

    // Render match/player site
    res.render('match/player', {tableData, userData, randomName});
  })
});

/* GET confirm page */
router.get('/confirm', (req, res, next) => {
  res.render('match/confirm');
});

/* POST handle input direct player */
router.post("/confirm", ensureAuthenticated, (req, res, next) => {
 let opponentDirect = User.findOne({username: req.body.directOpponent})
 console.log("debug direct opponent", opponentDirect)
})

/* POST handle input random player */
router.post("/confirm", ensureAuthenticated, (req, res, next) => {
  let opponentRandom = User.findOne({username: req.body.directOpponent})
  console.log("debug random opponent", opponentRandom)
 })

/* POST handle match input and send confirmation e-mail */
router.post("/confirm", ensureAuthenticated, (req, res, next) => {

  let table = req.body.table
  let playerOne = req.user._id
  let playerTwo = req.body.opponent
  let message = req.body.message

  // create new match based on input
  let newMatch = new Match ({
    _table: table,
    player1: playerOne,
    player2: playerTwo,
    message: message,
  })
  console.log("debug newMatch", newMatch)

  // save new match
  newMatch.save()
  .then(matchData => {
    let email = User.findById(playerTwo).email
    let opponentUsername = User.findById(playerTwo).username
      
      transporter.sendMail({
       from: '" " <lab-nodemailer@project.com>',
       to: email, 
       subject: "Your next Ping Pong match is waiting for you", 
       html:
       `
       <b>Hello ${opponentUsername}, you have been challenged!</b>
       <p>${req.user.username} has invited you to join a Ping Pong match! Head to our site and confirm the match now :) </p>
       `,
     })
    
     .then(info => 
       res.render('/homepage')
       )
     .catch(error => console.log("Error sending mail", error))
    res.redirect("/homepage")
  })

  .catch(error => console.log("Error creating new match", error))
})




module.exports = router;