const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const matchSchema = new Schema({
  _table: {type: Schema.Types.ObjectId, ref:"Table"},
  _player1: {type: Schema.Types.ObjectId, ref:"User"},
  _player2: {type: Schema.Types.ObjectId, ref:"User"},
  message: String,
  status: {
      type: String, 
      enum: ["pending", "open", "played"]
  },
},
{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}
);

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
