const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const Events = "models/Event"

const userSchema = new Schema({
  username: String,
  password: String,
  imgName: String,
  imgPath: String,
  events: [{type: Schema.Types.ObjectId, ref: "Event"}],
  establishments:[{type: Schema.Types.ObjectId, ref: "Establishment"}],
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;