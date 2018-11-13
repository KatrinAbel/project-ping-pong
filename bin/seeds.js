// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const Table = require("../models/Table");

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

// Tables to be created
let table = [
  {
    location: {
      type: "Point",
      coordinates: [52.4986316, 13.3642971]
    },
    team: "wework, at Atrium Tower",
    address: "Eichhornstraße 3, 10785 Berlin",
    description: "Located in the 21st floor at the coworking space WeWork",
    type: "private"
  },
  {
    location: {
      type: "Point",
      coordinates: [52.508391, 13.3702326]
    },
    team: "wework, Potsdamer Platz",
    address: "Stresemannstraße 123, 10963 Berlin",
    description: "Located on the public floor at the coworking space WeWork",
    type: "private"
  },
];

// Function to create tables
Table.create(table)
  .then(tableCreated => {
    console.log(`${tableCreated.length} table created with the following id:`);
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect();
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });
