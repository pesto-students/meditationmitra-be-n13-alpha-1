const express = require("express");
const router = express.Router();
const {auth} = require("../../middleware/auth");
// import Multer for Image uploads
const multer = require("multer");

//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/courses");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});
//Calling the "multer" Function
const upload = multer({
  storage: multerStorage,
});

// Models and Helpers
const Courses = require("../../models/course");

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
router.post("/add-course", auth ,upload.single("course-image"),async(req,res)=>{
const {file,body} = req;
console.log(req.body);
console.log(req.files);
res.json({ message: "Successfully uploaded files" });

});
module.exports = router;
