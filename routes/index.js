const router = require("express").Router();
const keys = require("../config/keys");
const userRoutes = require("./api/users");
const courseRoutes = require("./api/courses");
const categoriesRoutes = require("./api/categories");
const sampleCourse = require("./api/sampleCourse");
const paymentRoutes = require("./api/payments");

// api routes
router.use("/user", userRoutes);
router.use("/courses", courseRoutes);
router.use("/categories", categoriesRoutes);
router.use("/payments", paymentRoutes);
router.use("/sample-course", sampleCourse);
router.get("/", (req,res)=>{
    res.send("home api")
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Meditation Mitra Backend' });
});
module.exports = router;
