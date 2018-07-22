
// var multer = require('multer');
// var _storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// })

// var upload = multer({ storage: _storage })
// var fs = require('fs');

// app.use('/user', express.static('uploads'));

// app.get('/upload', function (req, res) {
//     res.render('upload');
// });
// app.post('/upload', upload.single('userfile'), function (req, res) {
//     console.log(req.file);
//     res.send('Uploaded : ' + req.file.filename);
// });
var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

app.listen(3003, function () {
    console.log('Connected, 3003 port!');
})
