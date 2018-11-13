const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    imgPath: {
      type: String,
      default: "../images/default-user.png"
    },
    email: {
      type: String,
      unique: true,
      match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "pro"],
      default: "beginner"
    },
    location: {
      type: { type: String },
      coordinates: [Number]
    },
    company: String,
    team: { type: String, default: "wework" },
    points: { type: Number, default: 0 }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
