const Mongoose = require("mongoose");

const { Schema } = Mongoose;

// Courses Schema
const CourseSchema = new Schema({
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  startdate: {
    type: String,
  },
  createdat: {
    type: String,
  },
  section: {
    type: Array,
    default: "No Sections",
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Courses", CourseSchema);
