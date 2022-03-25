const Mongoose = require("mongoose");

const { Schema } = Mongoose;

// User Schema
const UserSchema = new Schema({
  // _id: Mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    default: "member",
    enum: ["member", "coach"],
  },
  courses: {
    type: Array,
    default: [],
  },
  userUpdated: Date,
  userCreated: {
    type: Date,
    default: Date.now,
  },
  coursesMeetLinks: {
    type: Array,
    default: [],
  },
});

module.exports = Mongoose.model("User", UserSchema);
