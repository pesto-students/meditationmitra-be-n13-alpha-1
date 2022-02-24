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
  let user = await User.findOne({ email });
  if (!user) {
    const newUser = new User({ email, firstName, lastName, avatar });
    user = await newUser.save();
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

router.post("/enroll-course", auth, async (req, res) => {
  const { email } = req.user;
  const courseIds = req.body;
  const user = await User.findOne({ email });
  if (user) {
    if (user.courses) {
      if (courseIds.length) {
        courseIds.forEach((id) => user.courses.push(id));
      }
    }
    await user.save();
    return res.status(200).send("course enrolled successfully");
  }
  res.status(401).send("Unathorized user");
});
module.exports = router;
