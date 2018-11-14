const express = require("express");
const router = express.Router();
const Table = require("../models/Table")
const Match = require("../models/Match")
// const User = require("../model/User")

/* GET login/signup page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* GET homepage */
// Pass number of pending and open games
router.get("/homepage", (req, res, next) => {
	let id = req.user._id
	let pending = 	Match.find({ _player2: id, status: "pending"})
	let open = 	Match.find({ _player2: id, status: "open"})
	Promise.all([pending, open])
	.then(matchData => {
		let pendingNumber = matchData[0].length
		let openNumber = matchData[1].length
		res.render("homepage", {pendingNumber,openNumber})
	})
})
 

//Integrating marker data
// for deployment where do we get the data from?
// right now it is accesible via http://localhost:3000/api
router.get('/api', (req, res, next) => {
	Table.find({}, (error, tablesFromDB) => {
		if (error) {
			next(error);
		} else {
			res.json({ tables:  tablesFromDB});
		}
	});
});

module.exports = router;
