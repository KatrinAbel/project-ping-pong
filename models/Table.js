const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableSchema = new Schema(
  {
    location: {
      type: { type: String },
      coordinates: [Number] 
    },
    team: String,
    address: String,
    description: String,
    type: { type: String, enum: ["public", "private"] }
});

const Table = mongoose.model("Table", tableSchema);
module.exports = Table;
