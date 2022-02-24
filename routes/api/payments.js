const express = require("express");
const router = express.Router();
const { auth } = require("../../middleware/auth");

var Publishable_Key = process.env.Publishable_Key;
var Secret_Key = process.env.Secret_Key;

const stripe = require("stripe")(Secret_Key);

router.post("/", auth, async (req, res) => {
  const { firstName, lastName, email } = req.user;
  const { totalAmount, courseList } = req.body;
  console.log(firstName, lastName, email, totalAmount, courseList);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
module.exports = router;
