const express = require("express");
const router = express.Router();
var aws = require("aws-sdk");
var slugify = require("slugify");
const { auth } = require("../../middleware/auth");
// import Multer for Image uploads
const multer = require("multer");
var multerS3 = require("multer-s3");

// Models and Helpers
const Courses = require("../../models/course");

//Configuration for Multer

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  accessKeyId: process.env.AWS_KEY_ID,
  region: process.env.AWS_REGION,
});

var s3 = new aws.S3();
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "mm-courses",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
});

// Config your options for slug
const options = {
  replacement: "-", // replace spaces with replacement character, defaults to `-`
  remove: undefined, // remove characters that match regex, defaults to `undefined`
  lower: true, // convert to lower case, defaults to `false`
  strict: true, // strip special characters except replacement, defaults to `false`
  locale: "en", // language code of the locale to use
};
// Get all courses
router.get("/", async (req, res) => {
  const courses = await Courses.find();
  res.status(200).send(courses);
});

// Get a Specific course
router.get("/search/:course_query", async (req, res) => {
  const { course_query } = req.params;
  const courses = await Courses.find({
    name: course_query,
    category: course_query,
    createdBy: course_query,
  });
  res.status(200).send(courses);
});

// Get a Specific course by slug
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const courses = await Courses.findOne({ slug });
  res.status(200).send(courses);
});

// add new course
router.post(
  "/add-course",
  auth,
  upload.single("course-image"),
  async (req, res) => {
    const { file, body } = req;
    const {
      name,
      startDate,
      courseDescription,
      sections,
      category,
      rating,
      createdBy,
      price,
    } = body;
    let existingCourse = await Courses.find({ name });
    if (existingCourse.length > 0) {
      return res.status(400).send("Course Already Exist! Add another Course ");
    }
    const slug = slugify(name, options);
    const courseImage = "https://mm-courses.s3.amazonaws.com/" + req.file.key;
    const insertCourse = new Courses({
      courseImage,
      name,
      slug,
      startDate,
      courseDescription,
      sections,
      category,
      rating,
      createdBy,
      price,
    });
    let course = await insertCourse.save();
    if (!course) return res.status(400).send("Error Occured");
    res.status(200).send(course);
  }
);

module.exports = router;
