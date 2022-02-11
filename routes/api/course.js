const express = require("express");
const router = express.Router();

// Models and Helpers
const Courses = require("../../models/courses");

router.get("/", async (req, res) => {
  const courses = await Courses.find();
  res.send(courses);
});

router.post("/");
module.exports = router;
