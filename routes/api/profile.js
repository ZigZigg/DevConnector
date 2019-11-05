const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const _ = require("lodash");
// Load Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");
// Post model
const Post = require("../../models/Post");
// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar", "email"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};
  const { perPage, selected, filter, keyWord } = req.query;
  let currentFilter = parseInt(filter);
  Profile.find()
    .populate("user", ["name", "avatar", "email"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      Promise.all(
        profiles.map(item => {
          if (currentFilter === 1) {
            return Post.find({ user: item.user._id }).then(post => {
              if (post.length > 0) {
                return { user_data: item, posts_size: post.length };
              } else {
                return { user_data: item, posts_size: 0 };
              }
            });
          }
        })
      ).then(data => {
        const datas = _.orderBy(data, ["posts_size"], ["desc"]);
        if (currentFilter === 0) {
          profiles = profiles.reverse();
        } else if (currentFilter === 1) {
          let currentData = [];
          datas.map(value => {
            currentData.push(value.user_data);
          });
          profiles = currentData;
        }
        const size = profiles.length;
        const offset = Math.ceil(parseInt(selected) * parseInt(perPage));
        const selectData = Math.ceil(offset + parseInt(perPage));
        const profileArray = profiles.slice(offset, selectData);
        const profileData =
          keyWord !== ""
            ? _.filter(profileArray, item => {
                return item.user.name.search(keyWord) !== -1;
              })
            : profileArray;
        console.log("PROFILE ARRAY", profileData);
        res.json({ profileData, total: size });
      });
    })
    .catch(err => res.status(404).json({ profile: "There are no profiles" }));
});

// @route   GET api/profile/report
// @desc    Get report profiles
// @access  Public
router.get("/report", async (req, res) => {
  try {
    const profiles = await Profile.find();
    const mapSkill = profiles.map(value => {
      let parseSkill = value.skills.map(value => {
        return value.label;
      });
      return parseSkill;
    });

    const concatSkill = [].concat.apply([], mapSkill);
    let uniq = concatSkill
      .map(name => {
        return {
          count: 1,
          name: name
        };
      })
      .reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count;
        return a;
      }, {});
    const totalCV = await Profile.count();
    const totalUser = await User.count();
    const totalPost = await Post.count();
    const pendingPost = await Post.find({
      published: false
    }).count();
    const result = {
      totalCV,
      totalUser,
      totalPost,
      pendingPost,
      skill: uniq
    };
    res.json(result);
  } catch (error) {
    return res.status(404).json({ profile: "There are no profiles" });
  }
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.disable = false;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.skills) profileFields.skills = req.body.skills;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    // if (typeof req.body.skills !== "undefined") {
    //   profileFields.skills = req.body.skills.split(",");
    // }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);
// @route   POST api/profile
// @desc    Disable Profile
// @access  Private
router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.body.userId })
      .then(profile => {
        if (profile) {
          // Update
          Profile.findOneAndUpdate(
            { user: req.body.userId },
            { disable: req.body.disable },
            { new: true }
          ).then(profile => res.json(profile));
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      res.json({ success: true });
    });
  }
);

module.exports = router;
