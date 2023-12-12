const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResetPasswordSchema = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'User'
  },
  resetPasswordCode: {
    type: String,
    default: "",
  }
}, { versionKey: false, strict: false });

ResetPasswordSchema.statics.resetPasswordLink = async function(userId, code) {
  const newResetPass = await new ResetPassword({
    userID: userId,
    resetPasswordCode: code,
  });

  newResetPass.save();
}

// Create model for ResetPassword Table
const ResetPassword = mongoose.model('ResetPassword', ResetPasswordSchema, "ResetPasswords");

module.exports = ResetPassword;