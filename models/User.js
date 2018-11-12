const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: { 
    type: String, 
    unique: true,
    match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  },
  level: {
    type: String, 
    enum: ["beginner", "intermediate", "pro"], 
    default: "beginner",
  },
  location: { 
    type: { type: String }, 
    coordinates: [Number], 
    // If I want to put a default for coordinates number where do I specify that?
    // default: [52.5063688, 13.3711224,]
  },
  company: String,
  club: {type: String, default: "wework"},
  points: {type: Number, default: 0},
}, 
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
