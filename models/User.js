const mongoose = require('mongoose');

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  course: {
    type: String,                                                                                          
    
  },
  batch: {
    type: String,
    
  },
  year: {
    type: String,
    
  },
  branch: {
    type: String,
    
  },
  phoneno: {
    type: String,
    required: true
  },
  phoneno1: {
    type: String,
  },
  hostal: {
    type: String
  },
  hostal_room_no: {
    type: String
  },
  post: {
    type: String
  },
  dob: {
    type: String
  },
  gender: {
    type: String
  },
  field: {
    type: String
  },
  role: {
    type: String,
    default: "user",
  },
  address: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  added_by: {
    type: String,
    required: true
  },

  verified: {
    type: Boolean,
    default: false
  },
  resetLink: {
    type: String,
    default: ''
  }
}, { timestamps: true });


const User = mongoose.model('User', UserSchema);

module.exports = User; 