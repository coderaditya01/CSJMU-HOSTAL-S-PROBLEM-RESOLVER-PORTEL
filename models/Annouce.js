const mongoose = require('mongoose');

//------------ User Schema ------------//
const AnnounceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  announce: {
    type: String,                                                                                          
    
  },
  post: {
    type: String,
    
  },
  phone_no: {
    type: String,
    
  },
  hostal: {
    type: String,
    
  },
  
}, { timestamps: true });


const Announces = mongoose.model('Announce', AnnounceSchema);

module.exports = Announces;