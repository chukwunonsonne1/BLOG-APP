
const express 		= require("express"); //NODE APPLICATION USED FOR INTERACTION
const app 			= express(); // ATTACHES EXPRESS TO OUR APP
const mongoose 		= require('mongoose');// DATABASE
var methodOverride 	= require('method-override')// OVERRIDES  POST REQUEST FROM USERS TO BECOME PUT AND DELETE
const bodyParser 	= require("body-parser");// EXPRESS MIDDLEWARE THAT ANALYZES CORRECT SYNTAX OF USER REQUEST AND ATTACHES IT TO BODY
const expressSanitizer = require('express-sanitizer');// EXPRESS MIDDLEWARE THAT GETS THE USER REQUEST AND INFO FROM BODY
const passport 		= require("passport");// FOR AUTHENTICATION
const passportLocalMongoose = require("passport-local-mongoose");//FRAMEWORK FOR PASSPORT TO INTERACT WITH MONGOOSE 
const flash 		=require("connect-flash");//DISPLAYS FLASH MESSAGES
const User 			=require("./models/users");
const Blog 			= require("./models/blog");
const Comment 		= require("./models/comment");
const route 		=require("./routes/routes");
const auth 			=require("./routes/auth");
const adminRoute 			=require("./routes/admin");
const commentRoute 		= require("./routes/comment");

//===============================================
//MONGOOSE CONNECTION
//========================================================
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


app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(express.static("public"));
//=================================================================================================================
//VARIABLES ATTACHED TO EXPRESS TO BE CALLED ANYWHERE IN THE CODE BEFORE MOVING TO THE NEXT FUNCTION
//======================================================================================================================
app.use(function(req, res, next){
	res.locals.currentUser = req.user //VARIABLE TO KEEP TRACK IF THE USER IS LOGGED IN
	res.locals.error = req.flash("error"); //KEEPS TRACK OF ERROR MESSAGES
	res.locals.success = req.flash("success");// KEEPS TRACK OF SUCCESS MESSAGES
	
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
	
