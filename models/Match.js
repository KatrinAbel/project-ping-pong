const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const matchSchema = new Schema({
  _table: {type: Schema.Types.ObjectId, ref:"Table", required: true},
  _player1: {type: Schema.Types.ObjectId, ref:"User", required: true},
  _player2: {type: Schema.Types.ObjectId, ref:"User", required: true},
  message: {type: String, required: true},
  status: {
      type: String, 
      enum: ["pending", "open", "played"],
      default: "pending",
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
