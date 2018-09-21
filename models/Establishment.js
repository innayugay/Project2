const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const estSchema = new Schema({
  type: String,
  name: String,
  description: String,
  location: { type: { type: String }, coordinates: [Number] },
  rating: Array,
  // totalRating: 0,
  avgRating : {type: Number, default: 0},
  imgName: String,
  imgPath: String,
  // owner: String
});


const Establishment = mongoose.model("Establishment", estSchema);


module.exports = Establishment;