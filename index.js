var express = require("express");
var mongoose =require("mongoose");
var app = express()
var passport = require("passport");
var localStrategy = require("passport-local")
var passmonlocal = require("passport-local-mongoose");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var Usar = require("./models/user.js");
var members = require("./models/members.js");
var multer = require("./config/multer");
var middleware = require("./middleware/index.js");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

var db = process.env.db
mongoose.connect(db)
var cloud_api_secret = process.env.cloud_api_secret
var cloud_name = process.env.cloud_name
var cloud_api_key = process.env.cloud_api_key

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine" , "ejs")
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
  secret:"I love my mum",
  resave: false,
  saveUninitialized: false
 }));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(Usar.authenticate()));
passport.serializeUser(Usar.serializeUser())
passport.deserializeUser(Usar.deserializeUser())

app.use(function(req , res , next){
  res.locals.currentUser = req.user;
  res.locals.error= req.flash("error");
  res.locals.success= req.flash("success");
  next();
});


cloudinary.config({
  cloud_name:cloud_name,
  api_key:cloud_api_key,
  api_secret:cloud_api_secret
});


app.get("/", function(req,res){
    res.render("home")
})

app.get("/member-list", function(req,res){
  members.find({}, function(err,members){
     if(err){console.log(err)}
     else{ res.render("members" , {members:members})}
  })
})

app.get("/members/:id/:username", function(req,res){
  members.findById(req.params.id, function(err,member){
     if(err){console.log(err)}
     else{res.render("profile" , {member:member})}
  })
})


app.get("/login" , function(req,res){
  res.render("login")
})

app.get("/logout", function(req, res){
      req.logout(function(err){
        if(err){return(err)}
        res.redirect("/")
      })
})

app.post("/login", passport.authenticate("local" , {
      successRedirect: "/admin",
      failureRedirect: "/login"
}), function(req,res){
})

 app.get("/admin",middleware.isLoggedin, (req,res)=>{
  members.find({}, function(err,members){
    if(err){console.log(err)}
    else{ res.render("admin" , {members:members})}
 })
})

app.post("/add-member",middleware.isLoggedin,multer.upload.single("image"),function(req,res){
    // Upload file to Cloudinary
    cloudinary.uploader.upload(req.file.path, (error, result) => {
      if (error) {
        // Handle upload error
        console.error(error);
        res.status(500).json({ error: 'Failed to upload file' });
      } else {
   members.create({
       name:req.body.name,
       rank:req.body.rank,
       kills:req.body.kills,
       avatar:result.url,
       wins:req.body.wins,
       position:req.body.position}, function(err, member){
    if(err){console.log(err)}
    else{ 
      // File uploaded successfully
      console.log(result); 
      req.flash("success", "You have successfully added" + "" +  member.name + "" + "to the clan")
      res.redirect("/admin")}
      })
      }
    });
  });

app.post("/member/:id/image",middleware.isLoggedin,multer.upload.single("image"),function(req,res){
    // Upload file to Cloudinary
    cloudinary.uploader.upload(req.file.path, (error, result) => {
      if (error) {
        // Handle upload error
        console.error(error);
        res.status(500).json({ error: 'Failed to upload file' });
      } else {
     members.findByIdAndUpdate(req.params.id, {avatar:result.url}, function(err){
          if(err){console.log(err)}
          else{res.redirect("/admin")}
       })}
     })
   })

app.post("/member/:id/edit",middleware.isLoggedin, function(req,res){
  members.findByIdAndUpdate(req.params.id, req.body.member, function(err){
     if(err){console.log(err)}
     else{res.redirect("/admin")}
  })
})

app.post("/member/:id/delete", middleware.isLoggedin,function(req,res){
  members.findByIdAndDelete(req.params.id, function(err){
     if(err){console.log(err)}
     else{res.redirect("/admin")}
  })
})

const port = 8200 || process.env.port
app.listen( port, function(){
    console.log("Server is live")
  })