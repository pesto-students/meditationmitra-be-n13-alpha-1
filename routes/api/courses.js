const express = require("express");
const router = express.Router();
var aws = require("aws-sdk");
var slugify = require("slugify");
const { auth } = require("../../middleware/auth");
// import Multer for Image uploads
const multer = require("multer");
var multerS3 = require("multer-s3");
const Meeting = require("google-meet-api").meet;

// Models and Helpers
const Course = require("../../models/course");
const User = require("../../models/user");

const courseKey = process.env.AWS_COURSES_KEY;
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
    bucket: courseKey,
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
  const { search, filter } = req.query;

  let query = [];
  let courses = [];
  if (search) {
    let regex = new RegExp(`.*${search}.*`, "i");
    query.push({ name: { $regex: regex } });
  }
  if (filter) {
    const filterData = JSON.parse(filter);
    const { category, rating, price } = filterData;
    if (category) {
      query.push({ category });
    }
    if (rating?.length) {
      query.push({ rating: { $in: rating } });
    }
    if (price) {
      query.push({ price: { $lte: price.max, $gte: price.min } });
    }
  }
  if (query.length) {
    courses = await Course.find().and(query);
  } else {
    courses = await Course.find();
  }
  res.status(200).send(courses);
});

// Get user ENrolled courses
router.get("/enrolled", auth, async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email }).select({ courses: 1 });
  const { courses } = user;
  const coursesList = await Course.find({ _id: { $in: courses } });
  res.status(200).send(coursesList);
});

// Get a Specific course by slug
router.get("/enrolled/:slug", auth, async (req, res) => {
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  if (req.user) {
    const { email } = req.user;
    const user = await User.findOne({ email }).select({ courses: 1 });
    const { courses } = user;
    console.log(courses);
    if (courses.find((id) => id === course._id.toString())) {
      course.isPurchased = true;
      console.log(course);
    }
  }
  res.status(200).send(course);
});

// Get a Specific course by slug
router.get("/slug/:slug", async (req, res) => {
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  res.status(200).send(course);
});

// add new course
router.post(
  "/add-course",
  auth,
  upload.single("course-image"),
  async (req, res) => {
    const { file, body } = req;
    const { _id, firstName } = req.user;
    const { name, startDate, courseDescription, sessions, category, price } =
      body;
    let existingCourse = await Course.find({ name });
    if (existingCourse.length > 0) {
      return res.status(400).send("Course Already Exist! Add another Course ");
    }
    const createdBy = _id;
    const author = firstName;
    const rating = Math.floor(Math.random() * 5) + 1;
    const slug = slugify(name, options);
    const sections = [];
    const sessionsObj = JSON.parse(sessions);
    const keys = Object.keys(sessionsObj);
    keys.forEach((key) => {
      const section = sessionsObj[key];
      section.isLocked = false;
      sections.push(section);
    });
    const courseImage = `https://${courseKey}.s3.amazonaws.com/` + req.file.key;
    const insertCourse = new Course({
      courseImage,
      name,
      slug,
      startDate,
      courseDescription,
      sections,
      category,
      author,
      rating,
      createdBy,
      price,
    });
    let course = await insertCourse.save();
    if (!course) return res.status(400).send("Error Occured");
    res.status(200).send(course);
  }
);

router.get("/g", (req, res) => {
  Meeting({
    clientId:
      "349205355478-t21dp0v6hvo31gh642nj1apnest444e9.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//0ghiSQ1hAq9ZsCgYIARAAGBASNwF-L9Irz1sH4KznaD8H6fCg_6v88fbF7kqrmg65Kqu_40utAfyhaL1hVjBQScYDn7krn3qFOMc",
    date: "2022-02-24",
    time: "08:59",
    summary: "Meditation Mitra Session",
    location: "Pune",
    description: "description",
  })
    .then(function (result) {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((e) => console.log(e));
  // console.log(gmeetlink());
});

module.exports = router;
