const express = require("express");
const router = express.Router();
const Table = require("../models/Table")

/* GET login/signup page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/homepage", (req, res, next) => {
  res.render("homepage");
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
