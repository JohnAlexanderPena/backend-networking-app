 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

//Create Scheme
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  zipcode: {
    type: Number,
    required: true
  }
});

module.exports = User = mongoose.model('users', UserSchema)
