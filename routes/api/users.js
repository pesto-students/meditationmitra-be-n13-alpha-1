const express = require("express");
const router = express.Router();
const { crossOriginResourcePolicy } = require("helmet");
// Models and Helpers
const { auth, generateToken } = require("../../middleware/auth");
const Course = require("../../models/course");
const User = require("../../models/user");
// // Get all users
router.get("/", async (req, res) => {
  const users = await User.find().populate("courses");
  res.send(users);
});
// user login
router.post("/login", async (req, res) => {
  const { email, firstName, lastName, avatar } = req.body;
  let isNewUser = false;
  let user = await User.findOne({ email }).catch((err) => {
    console.log(err);
  });
  if (!user) {
    const newUser = new User({ email, firstName, lastName, avatar });
    user = await newUser.save().catch((err) => {
      console.log(err);
    });
    isNewUser = true;
  }
  const token = generateToken(user);
  res.status(200).send({ user, isNewUser, token });
});
// Signup Post
router.post("/update-role", auth, async (req, res, next) => {
  const { email } = req.user;
  const { role } = req.body;
  let user = await User.findOne({ email });
  if (user.length > 0) {
    user.role = role;
    await user.save();
    return res.status(200).send({ user });
  }
  res.status(400).send("Invalid User");
});

// Get Specific User
router.get("/profile", auth, async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  const courses = await Course.find({ _id: { $in: user.courses } });
  user.courses = courses;
  res.status(200).send(user);
});
module.exports = router;
