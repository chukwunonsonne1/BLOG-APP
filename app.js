
const express 		= require("express");
const app 			= express();
const mongoose 		= require('mongoose');
var methodOverride 	= require('method-override')
const bodyParser 	= require("body-parser");
const expressSanitizer = require('express-sanitizer');
const passportLocalMongoose = require("passport-local-mongoose");
const flash 		=require("connect-flash");
const User 			=require("./models/users");
const Blog 			= require("./models/blog");
const Comment 		= require("./models/comment");
const route 		=require("./routes/routes");
const auth 			=require("./routes/auth");
const adminRoute 			=require("./routes/admin");
const commentRoute 		= require("./routes/comment");
const passport 		= require("passport");
const LocalStrategy = require("passport-local");





mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});
var db 				= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected")
});


//=================================
//Passport Authentication
//=================================
app.use(require("express-session")({
	secret:"Es You're doing good",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//ejs connection
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(function(req, res, next){
	res.locals.currentUser = req.user
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	
	next();
});

// methodOverride
app.use(methodOverride('_method'));

//Routes
app.use(route);
app.use(auth);
app.use(commentRoute);
app.use(adminRoute);


//Local host connection
app.listen(3000, function(){
	console.log("Server has started");
});
	
