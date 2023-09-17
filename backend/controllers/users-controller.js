const User = require("../models/users");
const bcrypt = require('bcryptjs');

module.exports.register = async function(req, res) {

  const user = await User.findUser(req.body.email);

  if (user) {
    return res.json({msg: "User already exists!"});
  }

  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = await new User({
    firstname: req.body.fname,
    lastname: req.body.lname,
    email: req.body.email,
    password: hashedPassword
  });

  newUser.save();
  
  return res.json({success: "Success"});
}