var aws = require('aws-sdk')
var express = require('express')
const router = express.Router();
var multer = require('multer')
var multerS3 = require('multer-s3')


aws.config.update({
    secretAccessKey: 'BTW9pmLVscPUbqkfthMGZJYlXM7PdNL8uYfnQcqA',
    accessKeyId: 'AKIA6CY5JJA6JJLWFT3N',
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
      cb(null, Date.now().toString()+file.originalname)
    }
  })
})

router.post('/upload', upload.single('image-course'), function(req, res, next) {

  res.send('Successfully uploaded ' + 'https://mm-courses.s3.amazonaws.com/'+ req.file.key + ' files!')
})
router.get('/', (req,res) =>{
  res.send('Resources Updated');
})
module.exports = router;
