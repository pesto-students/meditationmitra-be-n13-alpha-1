const express = require("express");
const router = express.Router();
const {auth} = require("../../middleware/auth");
// import Multer for Image uploads
const multer = require("multer");
// Models and Helpers
const Courses = require("../../models/course");

//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/images/courses");
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


// Get all courses
router.get("/" ,async (req, res) => {
  const courses = await Courses.find();
  res.send(courses);
});


// Get a Specific course
router.get("/search/:course_query" ,async (req, res) => {
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

  const protocol = req.protocol;
  const host = req.hostname;
  const {name,startDate,courseDescription,section,category,rating,createdBy,price}= body;
  let existingCourse = await Courses.find({name})
  if(existingCourse){
   return  res.status(503).send('Course Already Exist! Add another Course ');
  }
  const courseImage = `${protocol}://${host}`+`/uploads/courses/`+file.filename;
  const insertCourse = new Courses({courseImage,name,startDate,courseDescription,section,category,rating,createdBy,price}) ;
  let course = await insertCourse.save();
  if(!course) return res.status(400).send('Error Occured');
  res.status(200).send(course);                 
});
module.exports = router;

