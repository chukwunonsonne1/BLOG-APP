const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const expressSanitizer = require("express-sanitizer");
const middleWare = require("../middleware");

// Restful routes
// Index Route
router.get("/", function(req, res){
	res.redirect("/blogs");
});

//Blog Route
router.get("/blogs", function(req, res){
	Blog.find({}, function(err, blog){
		if(err){
			console.log(err)
		}else{
			res.render("index", {blog:blog})
		}
	})
});

// New Route
router.get("/blogs/new", middleWare.isAdmin, function(req, res){
	//Direct to form page
	res.render("blogs/new");
});

// Create Route
router.post("/blogs", middleWare.isAdmin, function(req, res){
	const blogTitle = req.body.blogTitle;
	const blogImage = req.body.blogImage;
	const blogNews = req.body.blogNews;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	var createBlog ={blogTitle: blogTitle, blogImage: blogImage, blogNews: blogNews, author:author};
	//Save request to database
	Blog.create(createBlog, function(err, newBlog){
		if(err){
			res.redirect("/blogs/new")
		}else{
			//redirect to blog page
			res.redirect("/blogs/" + newBlog._id);
		}
	})
});

//show route
router.get("/blogs/:id",  function(req, res){
	Blog.findById(req.params.id).populate("comments").exec(function(err, blog){
		if(err){
			console.log(err)
		}else {
			res.render("show", {blog: blog});
		}
	})
});
	
// Edit Route
router.get("/blogs/:id/edit",  middleWare.blogOwnership,  function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("Error")
		}else{
			res.render("blogs/edit", {blog: foundBlog});
		}
	})
});

// Update route
router.put("/blogs/:id", middleWare.blogOwnership, function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, editedBlog){
		if(err){
			console.log("Error")
		}else{
			res.redirect("/blogs/" + req.params.id )
		}
	});
});
//Delete Route
router.delete("/blogs/:id", middleWare.blogOwnership, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("Error")
		}else{
			res.redirect("/blogs");
		}
	})
});

module.exports = router;
