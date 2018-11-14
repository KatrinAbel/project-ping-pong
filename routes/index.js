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

<<<<<<< HEAD
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

=======
>>>>>>> 53aa594d12a4a763324bf1e538418dd59d6b418e

module.exports = router;
