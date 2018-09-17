const mongoose = require('mongoose');
const Establishment = require('../models/Establishment');
const Event     = require('../models/Event')

const dbName = 'my-project';
mongoose.connect(`mongodb://localhost/${dbName}`);


const establishments = [
  { 
    type: "restaurant",
    name: "Olive Grove",
    description: "A very fancy Italian restaurant",
    address: "22 New Bond St",
    // rating: Number,
    // image: String,
  }
];

Establishment.create(establishments, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${establishments.length} establishments`)
  mongoose.connection.close()
});



const events = [
  { 
  type: "Food Festival",
  name: "Yummy fest",
  description: "The annual summer festival of food from all over the world",
  // location: {type: Schema.Types.ObjectId, ref: "Establishment"},
  // attendees: [{type: Schema.Types.ObjectId, ref: "User"}],
  // image: String,
  // host: {type: Schema.Types.ObjectId, ref: "User"}
  }
];

Event.create(events, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${events.length} events`)
  mongoose.connection.close()
});