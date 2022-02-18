const express = require("express");
const router = express.Router();
const {auth} = require("../../middleware/auth");

var Publishable_Key = process.env.Publishable_Key
var Secret_Key = process.env.Secret_Key
  
const stripe = require('stripe')(Secret_Key)

router.post('/', function(req, res){
  
    const {name, email,amount,courseName}= req.body;
    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: email,
        source: req.body.stripeToken,
        name: name ,
        address: {
            line1: '9/4 MES colony',
            postal_code: '431005',
            city: 'Pune',
            state: 'Maharashtra',
            country: 'India',
        }
    })
    .then((customer) => {
  
        return stripe.charges.create({
            amount: amount,     
            description: courseName,
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.send("Payment Successful Course Added")  // If no error occurs

    })
    .catch((err) => {
        res.send(err)       // If some error occurs
    });
})
module.exports = router;
