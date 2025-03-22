const mongoose = require('mongoose');

const examinerSchema = new mongoose.Schema({
  examinerID: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  module: {
    type: [String], // Changed from String to an array of Strings
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  }
});

const Examiner = mongoose.model('Examiner', examinerSchema);
module.exports = Examiner;
