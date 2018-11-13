// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const Table = require("../models/Table");

const bcryptSalt = 10;

mongoose
  .connect(
    "mongodb://localhost/project-ping-pong",
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

let table = [
  {
    location: {
      type: "Point",
      coordinates: [52.4986316, 13.3642971]
    },
    address: "Eichhornstraße 3, 10785 Berlin",
    description: "Located in the 21st floor at the coworking space WeWork",
    type: "private"
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
];

Table.deleteMany()
  .then(() => {
    return Table.create(table);
  })
  .then(tableCreated => {
    console.log(`${tableCreated.length} table created with the following id:`);
    console.log(tableCreated.map(u => u._id));
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect();
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });
