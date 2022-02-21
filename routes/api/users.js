const express = require("express");
const router = express.Router();
var aws = require('aws-sdk')
const { crossOriginResourcePolicy } = require("helmet");
// Models and Helpers
const {auth,generateToken} = require("../../middleware/auth");
const Course = require("../../models/course");
const User = require("../../models/user");

// import Multer for Image uploads
const multer = require("multer");
var multerS3 = require('multer-s3')

// // Get all users
// router.get("/", async (req, res) => {
//   const users = await User.find().populate("courses");
//   res.send(users);
// });

//Configuration for Multer

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  accessKeyId: process.env.AWS_KEY_ID,
  region: process.env.AWS_REGION
});

var s3 = new aws.S3()
var upload = multer({
storage: multerS3({
  s3: s3,
  bucket: 'mm-users',
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString()+file.originalname)
  }
})
})

// Login post
router.post("/login",upload.single("course-image"),async (req, res) => {
  const {email,firstName,lastName} = req.body;
  let isNewUser=false;
  
  let use̥r =  await User.findOne({email}).catch((err)=>{console.log(err)});
  if(!user){
   const avatar ='https://mm-users.s3.amazonaws.com/'+ req.file.key ;
   
   const newUser = new User({email,firstName,lastName,avatar});
    user = await newUser.save().catch((err)=>{console.log(err)});
    isNewUser= true;
  }
  const token = generateToken(user);
  res.status(200).send({user,isNewUser,token});
});

// Signup Post
router.post("/update-role",auth, async (req, res, next) => {
  const {email} = req.user;
  const {role} = req.body;
 let user = await User.findOne({ email })
 if(user.length > 0){ 
  user.role = role;
  await user.save();
  return res.status(200).send({user});
 }
  res.status(400).send("Invalid User");
});

// Get user ENrolled courses
router.get("/entrolled", auth, async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email }).select({ courses: 1 }); 
  const { courses } = user;
  const coursesList = await Courses.find({ _id: { $in: courses } });
  res.status(200).send(coursesList);
});


// Get Specific User
router.get("/profile",auth,async (req, res) => {
  const {email} = req.user;
  const user = await User.findOne({email});
  const courses = await Course.find({ _id: { $in: user.courses } })
  user.courses= courses;
  res.status(200).send(user);
});
module.exports = router;
