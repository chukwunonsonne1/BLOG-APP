const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/users");
const middleWare = require("../middleware")
//ADMIN HOME PAGE ROUTE
router.get("/admin", middleWare.isAdmin, function(req, res){
	User.find({}, function(err, users){
		if(err){
			console.log(err)
		}else{
			res.render("admin/admin", {users:users})
		}
	})
});


// GET NEW ADMIN ROUTE
router.get("/admin/register",  middleWare.isAdmin, function(req, res){
	res.render("admin/register")
});

//CREATE ADMIN AND MODERATORS ROUTE
router.post("/admin/register",  middleWare.isAdmin, function(req, res){
	var newUser = new User({username: req.body.username});
	if(req.body.admin === "moderator123"){
		newUser.isModerator = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash('error', err.message);
			res.redirect("back");
			return;
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "You have Sucessfully signed up a moderator")
			req.logout();
			res.redirect("../blogs");
		})
	})
});


//Admin Delete User Route
router.delete("/admin", middleWare.isAdmin, function(req, res){
	User.deleteOne({username:req.body.user}, function(err, foundUser){
		if(err){
			console.log(err)
		}else{
			req.flash("User Deleted")
			res.redirect("/admin")
		}
	})
});


module.exports = router;
