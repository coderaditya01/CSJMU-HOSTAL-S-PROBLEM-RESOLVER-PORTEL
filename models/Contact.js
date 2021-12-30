const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String
  },
  phone:
  {
    type: String
  },
  message:
  {
    type: String
  },
  
}, { timestamps: true });


const Contactss = mongoose.model('Contact', ContactSchema);

module.exports = Contactss ;