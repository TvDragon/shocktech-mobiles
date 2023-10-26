const User = require("../models/users");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config({path: __dirname + '/../.env' }); // Used to fetch constant variables from the .env file

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

module.exports.login = async function(req, res) {
  try {
    const user = await User.findUser(req.body.email);
    
    if (!user) {
      return res.json({error: "User not found"});
    }

    const samePassword = await bcrypt.compare(req.body.password, user.password);

    if (!samePassword) {
      return res.json({error: "Incorrect username or password"});
    }

    const token = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return res.json({success: "Successful Login!", token: token});
  } catch (err) {
    return res.json({error: "Error checking user credentials while logging in"});
  }
}

module.exports.validateToken = async (req, res) => {
  try{
    const tokenReceived = req.body.token; // Get token if exists

    // If token doesn't exist, return 400 response
    if(!tokenReceived){
      return res.status(400).json({msg: "No auth token found!"});
    }
  
    const verifiedToken = await jwt.verify(tokenReceived, process.env.JWT_SECRET); // Verify and decrpyt the JWT token
  
    // Check if token has expired
    if(Date.now() >= verifiedToken.exp * 1000){
      // If true, token has expired, delete from user's cache. (Custom HTTP code 499)
      return res.status(499).json({msg: "Token has expired"});
    }
  
    // If token is invalid, return 400 response
    if(!verifiedToken){
      return res.status(400).json({msg: "Provided token not valid"});
    }
    
    // If all is good, return 
    return res.status(200).json({msg: "Success"});
  } catch(err){

    return res.status(499).json({msg: "Invalid Token/ unable to validate token"});
  }
}

module.exports.getUserFromToken = async (req, res) => {
  try{
    const tokenReceived = req.body.token;

    // If token doesn't exist, return 400 response
    if(!tokenReceived){
      return res.status(400).json({msg: "No auth token found!"});
    }
  
    const verifiedToken = await jwt.verify(tokenReceived, process.env.JWT_SECRET); // Verify and decrpyt the JWT token
  
    // Check if token has expired
    if(Date.now() >= verifiedToken.exp * 1000){
      // If true, token has expired, delete from user's cache. (Custom HTTP code 499)
      return res.status(499).json({msg: "Token has expired"});
    }
  
    // If token is invalid, return 400 response
    if(!verifiedToken){
      return res.status(400).json({msg: "Provided token not valid"});
    }
    
    // If all is good, return the decrpyted token (user)
    return res.status(200).json({msg: "Success", token: verifiedToken});
  } catch(err){
    return res.status(404).json({msg: err});
  }
}