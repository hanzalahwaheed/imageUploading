const express = require('express')
const multer = require('multer');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const imgSchema = require('./model.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.set("view engine", "ejs");
app.use(express/*bodyParser*/.urlencoded({ extended: false }));
app.use(express/*bodyParser*/.json());

mongoose.connect(process.env.MONGO_URL)
    .then(console.log("DB Connected"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: storage });

////////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
    imgSchema.find()
        .then((data, err) => {
            if (err) {
                console.log(err);
            }
            res.render('imagepage', { items: data })
        })
});
////////////////////////////////////////////////////////////////////////////////////////
app.post('/', upload.single('image'), (req, res) => {

    const obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    imgSchema.create(obj)
        .then((err, item) => {
            if (err) {
                // console.log(err);
            }
            else {
                // item.save();
                res.redirect('/');
            }
        });
});
///////////////////////////////////////////////////////////////////////////////////////////
const port = process.env.PORT || '3000';
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
});
