const Mongoose = require("mongoose");

const { Schema } = Mongoose;

// Categories Schema
const CategoriesSchema = new Schema({
  _id: Mongoose.Schema.Types.ObjectId,
  categoryTitle: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

module.exports = Mongoose.model("Categories", CategoriesSchema);
