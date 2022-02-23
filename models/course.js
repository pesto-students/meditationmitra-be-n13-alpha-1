const Mongoose = require("mongoose");

const { Schema } = Mongoose;

// Courses Schema
const CourseSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique:true,
  },
  startDate: {
    type: String,
  },
  courseDescription: {
    type: String,
  },
  section: {
    type: Array,
    default: [],
  },
  category: {
    type: String,
    default:  "",
  },
  rating:{
    type: Number,
    default:  0,
  }, 
  createdBy:{
    type: Mongoose.Schema.Types.ObjectId,
    ref:  "User"
  },
  price:{
    type: Number,
    default:  0,
  },
  courseImage:{
    type: String
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Course", CourseSchema);
