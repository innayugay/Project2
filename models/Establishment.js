const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const estSchema = new Schema({
  type: String,
  name: String,
  description: String,
  address: String,
  rating: Array,
  imgName: String,
  imgPath: String,
  // owner: String
});


const Establishment = mongoose.model("Establishment", estSchema);


module.exports = Establishment;