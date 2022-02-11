const express = require("express");
const router = express.Router();

// Models and Helpers
const User = require("../../models/users");

router.get("/", async (req, res) => {
  const users = await User.find()
  res.send(users);
});

module.exports = router;
