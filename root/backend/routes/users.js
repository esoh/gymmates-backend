// We could define router within ./app.js and pass it into
// app.use(/users, router) if we wanted, but instead we are returning the router
// from this file using module.exports

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/', (req, res, next) => {
   let newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
   });

   User.addUser(newUser, (err, user) => {
      if(err){
         res.json({success: false, msg: 'Failed to register user'});
      } else {
         res.json({success: true, msg: 'User registered'});
      }
   });
});

// Authenticate
/*
router.post('/authenticate', (req, res, next) => {
   const usernameOrEmail = req.body.usernameOrEmail;
   const password = req.body.password;

   User.getUserByUsernameOrEmail(usernameOrEmail, (err, user) => {
      if(err) throw err;

      if(!user){
         return res.json({success: false, msg: 'User not found'});
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
         if(err) throw err;
         if(isMatch){
            // we don't want the payload to contain any sensitive information.
            const payload = { username : user.username };
            const token = jwt.sign(payload, config.secret, {
               expiresIn: 604800 // 1 week
            });

            res.json({
               success: true,
               token: `Bearer ${token}`,
               user: {
                  id: user._id,
                  username: user.username,
                  email: user.email
               }
            });
         } else {
            return res.json({success: false, msg: 'Wrong password'});
         }
      });
   });
}); */

// Profile
// protect route with authentication token
/* router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
   res.json({user: req.user});
}); */

// Get another user
router.get('/:username', (req, res, next) => {
   passport.authenticate('jwt', (err, user, info) => {
      // throw errors first
      if(err) { return next(err); }

      // fetch target user info
      const targetUsername = req.params.username;
      User.getUserByUsernameOrEmail(targetUsername, (err, targetUser) => {
         if(err) { return next(err); }

         if(!targetUser){
            return res.json({success: false, msg: 'User not found'});
         }

         if(info && info.message !== 'No auth token') {
            return res.json({success: false, msg: info.message});
         }

         // put public-viewable info in
         var data = {
            username: targetUser.username
         };

         // put registered user viewable info in
         if(user){
            data.email = targetUser.email;
         }

         return res.json(data);
      });
   })(req, res, next);
});

// Check if email exists
/*router.head('/emails/:email', (req, res, next) => {
   User.emailExists(req.params.email, (err, foundUser) => {
      if(err) { return next(err); }

      if(!foundUser){
         return res.sendStatus(404);
      }

      return res.sendStatus(200);
   });
});*/

// module.exports is what is returned by this file when require is called on it.
module.exports = router;
