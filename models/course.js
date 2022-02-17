const Mongoose = require("mongoose");

const { Schema } = Mongoose;

// Courses Schema
const CourseSchema = new Schema({
  _id: Mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
  },
  startDate: {
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
    type: String,
    default:  "0.00",
  }, 
  createdBy:{
    type: Mongoose.Schema.Types.ObjectId,
    ref:  "User"
  },
  price:{
    type: String,
    default:  "0.00",
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Course", CourseSchema);
