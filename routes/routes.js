var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config/database');

module.exports = function (app, passport) {
  // app.get('/', function (req, res) {
  //   res.json('Welcome to my App Json Web Token');
  // });

  app.post('/signup', function (req, res) {
    let newUser = new User({
      email: req.body.email,
      password: req.body.password
    });

    User.createUser(newUser, function (err, user) {
      if (err) res.json({ success: false, msg: 'fail' });
      res.json({ success: true, msg: 'success' })
    });
  });

  app.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    User.getUserByEmail(email, function(err, user){
      if(err) throw err;
      if(!user){
        return res.json({success:false, message:'No user found'});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          const token = jwt.sign(user.toJSON(), config.secret, {expiresIn:600000});
          res.json({success:true, token:token, user:{
            id: user._id,
            email: user.email
          }});
        }else{
          res.json({success:false, message:'Password is not Match'});
        }
      });
    })
  });

  app.get('/profile', passport.authenticate('jwt', {session: false}), function(req, res){
    res.json({
      user: {
        _id: req.user._id,
        email: req.user.email
      }
    });
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}