const express = require("express");
const router = express.Router();
const {auth} = require("../../middleware/auth");
// import Multer for Image uploads
const multer = require("multer");
const upload = multer({ dest: "uploads/images/courses" });
// Models and Helpers
const Courses = require("../../models/courses");

// Get all courses
router.get("/", auth ,async (req, res) => {
  const courses = await Courses.find();
  res.send(courses);
});


// Get a Specific course
router.get("/:course_query", auth ,async (req, res) => {
  const {course_query} = req.params;
  const courses = await Courses.find({
    name:course_query,
    category:course_query,
    createdBy:course_query
  });
  res.send(courses);
});
// 


// add new course
router.post("/add-course", auth ,upload.file("course-image"),async(req,res)=>{
const {file,body} = req;
console.log(req.body);
console.log(req.files);
res.json({ message: "Successfully uploaded files" });

});
module.exports = router;
