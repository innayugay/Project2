const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
  type: String,
  name: String,
  description: String,
  location: {type: Schema.Types.ObjectId, ref: "Establishment"},
  date: Date,
  attendees: [{type: Schema.Types.ObjectId, ref: "User"}],
  imgName: String,
  imgPath: String,
  host: {type: Schema.Types.ObjectId, ref: "User"}
}, {
timestamps: {
  createdAt: "created_at",
  updatedAt: "updated_at"
}
});


const Event = mongoose.model("Event", eventSchema);


module.exports = Event;