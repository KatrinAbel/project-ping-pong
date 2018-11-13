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
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Table = mongoose.model("Table", tableSchema);
module.exports = Table;
