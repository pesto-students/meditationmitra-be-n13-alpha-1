const express = require("express");
const router = express.Router();

// Models and Helpers
const Categories = require("../../models/categories");

// Get all Categories
router.get("/", async (req, res) => {
    const categories = await Categories.find();
    res.send(categories);
});
module.exports = router;
