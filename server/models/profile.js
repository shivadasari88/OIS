const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  username: {
     type: String, 
     required: true,
     unique: true },
  email: { 
       type: String,
       required: true,
       unique: true },
  gender: {  
       type: String,
       required: true },
  phone: {
     type: String,
      required: true },
});

module.exports = mongoose.model('profile',ProfileSchema);
