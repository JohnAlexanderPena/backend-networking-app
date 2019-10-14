const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport')
// Load User Model
const User = require('../../models/User')

// @route       GET to api/users/test
// @description Test users route
// @access      Public

router.get('/test', (req, res) => res.json({msg: "User Works"}));


// @route       GET to api/users/register
// @description Register user
// @access      Public

router.post('/register', (req, res) => {
  User.findOne({  email: req.body.email }).then(user => {
      if(user) {
        return res.status(400).json({email: 'Email already exists'});
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          zipcode: req.body.zipcode,
          avatar,
          password: req.body.password
        });

        //Hash the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
});

//@route Get api/users/login
//@desc  Login User / Return JWT Token
//@acces Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email

  User.findOne({email})
  .then(user => {
    // Check for user
    if(!user) {
      return res.status(404).json({email: 'User Email not found'})
    }

    // Check password
    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if(isMatch){
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar } // Create JWT Payload

        //Sign Token
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token
          });
        });
      } else {
        return res.status(400).json({password: 'Incorrect Password'})
      }
    });
  })
});

// @route       GET to api/users/current
// @description Return current user
// @access      Private
//
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});
module.exports = router;
