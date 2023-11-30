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
  },
  admin: {
    type: Boolean,
    default: false
  }
}, { versionKey: false });

UserSchema.statics.findUser = function(email) {
  return this.findOne({email: email});
}

UserSchema.statics.findUserById = function(userId) {
  return this.findOne({_id: userId});
}

UserSchema.statics.updateProfile = async function(currEmail, newEmail, fname, lname) {
  await this.findOneAndUpdate(
    {email: currEmail},
    {$set: {
      email: newEmail,
      firstname: fname,
      lastname: lname
    }}
  );
}

UserSchema.statics.changePassword = async function(email, newPassword) { 
  await this.findOneAndUpdate(
    {email: email},
    {$set: {password: newPassword}}
  );
}

const User = mongoose.model('User', UserSchema, "Users");

module.exports = User;