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

// Login post
router.post("/login", async (req, res) => {
  const { file, body } = req;
  const { email, firstName, lastName, avatar } = req.body;
  let isNewUser = false;

  const newUser = new User({ email, firstName, lastName, avatar });
  await newUser.save(function (err) {
    if (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        // Duplicate username
        return res.status(422).send({ isNewUser, user: "User already exist!" });
      }
      // Some other error
      return res.status(422).send(err);
    }
    const token = generateToken(user);
    isNewUser = true;
    res.status(200).send({ user, isNewUser, token });
  });
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

// Get user ENrolled courses
router.get("/enrolled", auth, async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email }).select({ courses: 1 });
  const { courses } = user;
  const coursesList = await Courses.find({ _id: { $in: courses } });
  res.status(200).send(coursesList);
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
