const Blog 			= require("./models/blog");
const Comment 		= require("./models/comment");
var middleWare = {};

// middleware for login
middleWare.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You have to Log In to do that")
	res.redirect("/login")
};

//middleware for check blog ownership
middleWare.blogOwnership = function(req, res, next){
	//check if user is logged in
	if(req.isAuthenticated()){
	//Finds all the campgrounds by IDS
	Blog.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err)
		}else{
			//check if user owns campgrounds
			if(foundCamp.author.id.equals(req.user._id)|| req.user.isAdmin|| req.user.isModerator){
				return next()
			}else{
				req.flash("error", "You do not have acesss to do that");
				res.redirect("back")
			}
		}
	})
	}else{
		res.render("login");
	}
};

// middleware for comment ownership
middleWare.checkCommentOwnership= function(req, res, next){
	//check if user is logged in
	if(req.isAuthenticated()){
	//Finds all the comments by IDS
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err)
		}else{
			//check if user owns comments
			if(foundComment.author.id.equals(req.user._id)|| req.user.isAdmin){
				return next()
			}else{
				req.flash("error", "You do not have acesss to do that");
				res.redirect("back")
			}
		}
	})
	}else{
		res.render("login");
	}
}

middleWare.isAdmin = function(req, res,next){
	if(req.isAuthenticated()){
		if(req.user.isAdmin){
			return next();
		}
		
			req.flash("error", "You are Forbidden from that Page")
			res.redirect("back");
		
	}
}
module.exports = middleWare;
