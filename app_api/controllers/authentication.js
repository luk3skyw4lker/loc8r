const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');

const register = (req, res) => {
  if(!req.body.name || !req.body.email || !req.body.password){
    return res.status(400).json({ "Error": "All fields required" });
  }
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save((err) => {
    if(err){
      res.status(400).json({ "Error": "Bad request" });
    } else {
      const token = user.generateJwt();
      res.status(201).json({ token });
    }
  });
};

const login = (req, res) => {
  if(!req.body.email || !req.body.password){
    return res.status(400).json({ "Error": "All fields required" });
  }
  
  passport.authenticate('local', (err, user, info) => {
    let token;
    console.log(user);
    if(err){
      console.log(err);
      return res.status(500).json({ "Error": "Internal error on authenticating" });
    }
    if(user){
      token = user.generateJwt();
      res.status(200).json({ token });
    } else {
      res.status(404).json({ "Error": "Not found" });
    }
  }) (req, res);
};

module.exports = {
  register,
  login
};
