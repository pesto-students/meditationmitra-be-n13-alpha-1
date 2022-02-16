var express = require('express');
var router = express.Router();

// api routes

router.use("/user", userRoutes);
// router.use("/course", courseRoutes);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Meditation Mitra Backend' });
});

module.exports = router;
