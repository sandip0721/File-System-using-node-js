const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
const fs = require('fs')



const app = express();
const port = 5000;

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100000,
  },
  fileFilter:function(req, file, cb){
    checkFileType(file,cb);
  }
}).single("image");

function checkFileType(file,cb){
    const fileypes = /jpeg|png|jpg/;
    const ext = fileypes.test(path.extname(file.originalname).toLowerCase());
    const mime = fileypes.test(file.mimetype);

    if(ext && mime){
        return cb(null,true)
    }
    else{
        cb('Error: Images Only With jpeg and png Extension')
    }
}


app.set("view engine", "ejs");

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", {
        msg: err,
      });
    } else {
     if(req.file == undefined){
        res.render("index", {
            msg: 'Error: No File Selected',
          });
     } 
     else{
        res.render("index", {
            msg: `${req.file.filename} Uploaded`,
          });
     } 
    }
  });
});

app.delete('/delete/:file', (req, res, next) => {
    deletefile = 'public/uploads/'+ req.params.file;
    fs.unlink(deletefile, (err) => {
        if (err) {return err}
        fs.readdir('public/uploads', (err, files) => {
            res.send( req.params.file + ' is Deleted')
        })  
    })
})
app.listen(port, () => {
  console.log("Server is running on PORT " + port);
});
