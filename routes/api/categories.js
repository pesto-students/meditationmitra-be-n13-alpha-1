const express = require("express");
const router = express.Router();

// Models and Helpers
const Categories = require("../../models/categories");
const Meeting = require('google-meet-api').meet;


// Get all Categories
router.get("/", async (req, res) => {
    const categories = await Categories.find();
    res.send(categories);
});
router.get("/g", (req, res) => {
    Meeting({
      clientId:
        "349205355478-t21dp0v6hvo31gh642nj1apnest444e9.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken:
        "1//0ghiSQ1hAq9ZsCgYIARAAGBASNwF-L9Irz1sH4KznaD8H6fCg_6v88fbF7kqrmg65Kqu_40utAfyhaL1hVjBQScYDn7krn3qFOMc",
      date: "2022-02-22",
      time: "10:59",
      summary: "Meditation Mitra Session",
      location: "Pune",
      description: "description",
    }).then(function (result) {
      console.log(result);
      res.status(200).send(result);
    }).catch((e) => console.log(e));
    // console.log(gmeetlink());
  });
module.exports = router;
