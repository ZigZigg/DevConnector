const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
var nodemailer = require("nodemailer");
// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  console.log("signup", req.body);
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        role: 0,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                  user: "hungnd@beetsoft.com.vn",
                  pass: "beetsoft123"
                }
              });

              let mailOptions = {
                from: "hungnd@beetsoft.com.vn",
                to: req.body.email,
                subject: "Welcome to Ecomig Project",
                html: `<p>It is nice to have you on board, ${
                  req.body.name
                }</p> <p>Thank you for signing up for Ecomig Project</p>`
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return console.log(error.message);
                }
                console.log("success");
              });
              const payload = {
                id: user._id,
                name: user.name,
                avatar: user.avatar,
                role: user.role
              };
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token,
                    authentication_token: token,
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role
                  });
                }
              );
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          phone: user.phone
        }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              authentication_token: token,
              id: user.id,
              name: user.name,
              avatar: user.avatar,
              role: user.role
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   PUT api/users/update
// @desc    Update User
// @access  Private
router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user.id)
      .then(async user => {
        if (user) {
          let userName = null;
          let userAddress = null;
          let userPhone = null;
          let userPassword = null;
          if (req.body.name) userName = req.body.name;
          if (req.body.address) userAddress = req.body.address;
          if (req.body.phone) userPhone = req.body.phone;
          if (req.body.password) {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) throw err;
                userPassword = hash;
                User.findOneAndUpdate(
                  { _id: req.user.id },
                  {
                    name: userName ? userName : user.name,
                    address: userAddress
                      ? userAddress
                      : user.address
                      ? user.address
                      : null,
                    phone: userPhone
                      ? userPhone
                      : user.phone
                      ? user.phone
                      : null,
                    password: userPassword
                  },
                  { new: true }
                ).then(user => res.json(user));
              });
            });
          } else {
            User.findOneAndUpdate(
              { _id: req.user.id },
              {
                name: userName ? userName : user.name,
                address: userAddress
                  ? userAddress
                  : user.address
                  ? user.address
                  : null,
                phone: userPhone ? userPhone : user.phone ? user.phone : null
              },
              { new: true }
            ).then(user => res.json(user));
          }
          // Update
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      address: req.user.address ? req.user.address : "",
      phone: req.user.phone ? req.user.phone : ""
    });
  }
);
// @route   GET api/users/:user_id
// @desc    Get User detail by Id
// @access  Public

router.get("/:user_id", (req, res) => {
  const errors = {};
  User.findById(req.params.user_id)
    .then(user => {
      if (!user) {
        errors.email = "User not found";
        return res.status(404).json(errors);
      }

      res.json(user);
    })
    .catch(err => res.status(404).json({ user: "User not found" }));
});
module.exports = router;
