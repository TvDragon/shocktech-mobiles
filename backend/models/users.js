const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new Schema({
  firstname: {
    type: String,
    default: "Hello",
  },
  lastname: {
    type: String,
    default: "World",
  },
  email: {
    type: String,
    default: "Test",
  },
  password: {
    type: String,
    default: "One",
  }
}, { versionKey: false });

UserSchema.statics.findUser = function(email) {
  return this.findOne({email: email});
}

const User = mongoose.model('User', UserSchema, "Users");

module.exports = User;