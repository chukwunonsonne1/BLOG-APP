const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/users");

//==================================
//REGISTER ROUTE
//==================================

router.get("/register", function(req, res){
	res.render("register")
});

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	if(req.body.admin === "admincode123"){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash('error', err.message);
			res.redirect("back");
			return;
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "You have Sucessfully signed up")
			res.redirect("blogs")
		})
	})
});

//===================
// LOGIN ROUTES
//===================
router.get("/login", function(req, res){
	res.render("login")
});

router.post("/login", passport.authenticate("local", {
			successRedirect:"/blogs",
			sucessFlash: true,
			failureRedirect: "/login",
			failureFlash:true
			 }),
		function(req, res){
})


//===================
// LOgout ROUTES
//===================
router.get("/logout", function(req, res){
		req.flash("success", "Succesfully logged out");
		req.logout();
		res.redirect("blogs");
});




module.exports = router;
