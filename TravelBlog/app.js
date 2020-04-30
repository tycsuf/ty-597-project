var express = require("express");
var session = require("express-session");
var parser = require("body-parser");
var path = require("path");
var post = require('./post');
var user = require('./user');
var express_app = express();
var sessions;

express_app.use(parser.json());
express_app.use(express.static(path.join(__dirname, "/html")));
express_app.use(session({
	secret: 'timsecret',
	resave: false,
	saveUninitialized: false
}));

express_app.get('/', function(request, response) {
	response.sendFile(__dirname + '/html/index.html');
})

express_app.post('/signup', function(request, response) {
	var name = request.body.name;
	var savedPosts = request.body.savedPosts;
	var email = request.body.email;
	var password = request.body.password;

	if (email && name && password) {
		user.signup(name, email, password, savedPosts, function(result) {
			response.send(result);
		});
	} else {
		response.send('Sign up failed!');
	}
})

express_app.post('/signin', function(request, response) {
	var user_email = request.body.email;
	var password = request.body.password;
	sessions = request.session;

	user.validateSignIn(user_email, password, function(result) {
		if (result) {
			sessions.username = user_email;
			console.log(sessions.username);
			response.send('Sign in successful!');
		}
	});
})

express_app.get('/home', function(request, response) {
	if (sessions.username && sessions) {
		response.sendFile(__dirname + '/html/home.html');
	} else {
		response.redirect('http://localhost:7777/#/')
	}
})

express_app.post('/addpost', function(request, response) {
	var id = request.body.id;	
	var subject = request.body.subject;
	var title = request.body.title;
	var selectedFile = request.body.selectedFile;
	var likeCount = request.body.likeCount;
	var comments = request.body.comments;

	if (id == undefined || id == '') {
		console.log('Adding new post!');
		post.addPost(title, subject, selectedFile, likeCount, comments, function(result) {
			response.send(result);
		}); 
	} else {
		console.log('Update', title, subject);
		post.updatePost(id, title, subject, selectedFile, likeCount, comments, function(result) {
			response.send(result);
		}); 
	}
})

express_app.post('/incrementLikeCount', function(request, response) {
	var id = request.body.id;

	console.log('ID: ', id);
	console.log('Incrementing like count');
	post.incrementLikeCount(id, function(result) {
		response.send(result);
	}); 
})

express_app.post('/addComment', function(request, response) {
	var id = request.body.id;
	var comment = request.body.comment;

	console.log('ID: ', id);
	console.log('Adding comment');
	post.addComment(id, comment, function(result) {
		response.send(result);
	});
})

express_app.post('/savePost', function(request, response) {
	var username = sessions.username;
	var id = request.body.id;

	console.log('Username: ', username);
	console.log('Saving post with id: ', id);
	user.savePost(username, id, function(result) {
		console.log("Save post result: ", result);
		response.send(result);
	});
})

express_app.post('/unsavePost', function(request, response) {
	var username = sessions.username;
	var id = request.body.id;

	user.unsavePost(username, id, function(result) {
		console.log("Unsave post result: ", result);
		response.send(result);
	})
})

express_app.post('/getpost', function(request, response) {
	post.getPost(function(result) {
		response.send(result);
	});
})

express_app.post('/getPostWithId', function(request, response) {
	var post_id = request.body.id;

	post.getPostWithId(post_id, function(result) {
		response.send(result)
	})
})

express_app.post('/deletePost', function(request, response) {
	var post_id = request.body.id;

	post.deletePost(post_id, function(result) {
		response.send(result);
	})
})

express_app.post('/getSavedPosts', function (request, response) {
	user.getSavedPosts(function(result) {
		response.send(result);
	});
})

express_app.post('/updateProfile', function(request, response) {
	var password = request.body.password;	
	var name = request.body.name;

	user.updateProfile(name, password, sessions.username, function(result) {
		response.send(result);
	})
})

express_app.post('/getProfile', function(request, response) {
	user.getUserInfo(sessions.username, function(result) {
		response.send(result)
	})
})

express_app.post('/resetAll', function(request, response) {
	user.resetAll(function(result) {
		response.send(result);
	});
})

express_app.listen(5432, function() {
	console.log("Using port:", 5432);
})
