const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User 	= require("../models/users");
const middleWare = require("../middleware");

// New Route
router.get("/blogs/:id/comment/new", middleWare.isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log("Error")
		}else{
			res.render("comments/new", {blog: blog})
		}
	})
});

//============================================
//Create router
//==============================================
router.post("/blogs/:id/comment/", middleWare.isLoggedIn, function(req, res){
		Blog.findById(req.params.id, function(err, foundBlog){
			if(err){
				console.log("Error finding Blog")
			}else{
				Comment.create(req.body.comment, function(err, createdComment){
					if(err){
						console.log("Couldn't create Comment")
					}else{
						createdComment.author.id = req.user._id;
						createdComment.author.username = req.user.username;
						createdComment.save();
						foundBlog.comments.push(createdComment);
						foundBlog.save();
						res.redirect("/blogs/" + foundBlog._id)
					}
				})
			}
		})
});
//=========================================
//Edit Route
//=============================
router.get("/blogs/:id/comment/:comment_id/edit", middleWare.checkCommentOwnership, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log(err)
		}else{
			Comment.findById(req.params.comment_id, function(err, comment){
				if(err){
					console.log(err)
				}else{
					res.render("comments/edit", {foundBlog:foundBlog, comment:comment})
				}
			})
			}
	});
	
	//Update Route
router.put("/index/:id/comments/:comment_id", middleWare.checkCommentOnership, function(req, res){
	req.body.comment.body = req.sanitize(req.body.comment.body)
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, editedBlog){
		if(err){
			console.log("Error")
		}else{
			res.redirect("/blogs/" + req.params.id )
		}
	});
});
});
//============================
//Delete Route
//========================================
	//Delete Route
	router.delete("/blogs/:id/comments/:comment_id", middleWare.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log("Error")
		}else{
			req.flash("success", "Comment deleted")
			res.redirect("/blogs/" + req.params.id);
		}
	})
});
	
module.exports = router
