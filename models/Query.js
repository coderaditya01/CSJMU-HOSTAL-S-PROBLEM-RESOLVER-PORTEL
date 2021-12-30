const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
  
  email1: {
    type: String,
   
  },
  name: {
    type: String,
    
  },
  query: {
    type: String,
    
  
  },
  phone_no: {
    type: String,
    
  },
  phone_no1: {
    type: String,
  
  },
  hostal: {
    type: String,
    
  },
  hostal_room_no: {
    type: String,
  },
  related_to: {
    type: String,
    
  },
  status: {
    type: String,
    default: "inprocess",
  },
  assigner_reply:{
    type: String
  }, 
  incharge_reply:{
    type: String
  },
  final_feedback: {
    type: String
  },
  incharge_name: {
    type: String
  },
  incharge_email: {
    type: String
  },
  incharge_field: {
    type: String
  },
  incharge_phone_no: {
    type: String,
  },
  assigner_name: {
    type: String,
  },
  assigner_phone_no: {
    type: String,
  },
  assigner_post: {
    type: String,
  },
  assigner_email: {
    type: String,
  }
}, { timestamps: true });


const Queryy = mongoose.model('Query', QuerySchema);

module.exports = Queryy;