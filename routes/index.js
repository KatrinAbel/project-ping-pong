const express = require("express");
const router = express.Router();
const Table = require("../models/Table")
const Match = require("../models/Match")
// const User = require("../model/User")

/* GET login/signup page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//GET homepage
//GET numbers of pending matches 
router.get("/homepage", (req, res, next) => {
	res.render("homepage")
// 	let idPlayer2 = req.user._id
// 	Match.aggregate(
// [
// 	{$match: {status: "pending"}},
// 	{$group: {_id: idPlayer2, total: {$sum: "pending"}}}
// ]
// 	)
});

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
