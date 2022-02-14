const Mongoose = require("mongoose");

const { Schema } = Mongoose;

// Courses Schema
const CourseSchema = new Schema({
  _id: Mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  startDate: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  section: {
    type: Array,
    default: [0],
  },
  createdBy:{
    type: Mongoose.Schema.Types.ObjectId,
    ref:  "User"
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Courses", CourseSchema);
