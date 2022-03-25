const Mongoose = require("mongoose");

const { Schema } = Mongoose;

// Categories Schema
const CategoriesSchema = new Schema({
  categoryTitle: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Categories", CategoriesSchema);
