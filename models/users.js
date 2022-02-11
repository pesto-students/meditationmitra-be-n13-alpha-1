const Mongoose = require("mongoose");

const { Schema } = Mongoose;

// User Schema
const UserSchema = new Schema({
  email: {
    type: String,
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
    default: "ROLE_MEMBER",
    enum: ["ROLE_MEMBER", "ROLE_COACH"],
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("User", UserSchema);
