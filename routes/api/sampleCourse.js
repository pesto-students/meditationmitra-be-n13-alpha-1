var aws = require('aws-sdk')
var express = require('express')
const router = express.Router();
var multer = require('multer')
var multerS3 = require('multer-s3')


aws.config.update({
    secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    accessKeyId: 'XXXXXXXXXXXXXXX',
    region: 'us-east-1'
});

var s3 = new aws.S3()
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'mm-courses',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

router.post('/upload', upload.array('photos', 3), function(req, res, next) {
  res.send('Successfully uploaded ' + req.files.length + ' files!')
})

module.exports = router;
