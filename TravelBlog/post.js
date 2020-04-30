var mongo_DB = require("mongodb");
var mongo_DB_client = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/Blog";
var assert = require("assert");

module.exports = {

	updatePost: function(id, title, subject, selectedFile, likeCount, comments, callback) {
		mongo_DB_client.connect(url, function(error, database) {
		  	database.collection('post').updateOne( 
		  		{
		  			"_id": new mongo_DB.ObjectID(id)
		  		},
		  		{
		  			$set: {
		  				"title": title,
				  		"subject": subject,
				  		"selectedFile": selectedFile,
				  		"likeCount": likeCount,
				  		"comments": comments
			  		}
		  		},
		  		function(error, result) {
					assert.equal(error, null);
			    	console.log("Blog post updated!");
			    	if (error == null) {
			    		callback(true)
			    	} else {
			    		callback(false)
			    	}
				}
			);
		});
	},

	addPost: function(title, subject, selectedFile, likeCount, comments, callback) {
		mongo_DB_client.connect(url, function(error, database) {
		  	database.collection('post').insertOne(
		  		{
					"title": title,
					"subject": subject,
					"selectedFile": selectedFile,
					"likeCount": likeCount,
					"comments": comments
				},
				function(error, result) {
					assert.equal(error, null);
			    	console.log("Blog post added!");
			    	if (error == null) {
			    		callback(true)
			    	} else {
			    		callback(false)
			    	}
				}
			);
		});
	},

	incrementLikeCount: function(id, callback) {
		mongo_DB_client.connect(url, function(error, database) {
		  	database.collection('post').updateOne( 
		  		{
		  			"_id": new mongo_DB.ObjectID(id)
		  		},
		  		{
		  			$inc: {
				  		"likeCount": 1
			  		}
		  		},
		  		function(error, result) {
					assert.equal(error, null);
			    	console.log("Like count incremented!");
			    	if (error == null) {
			    		callback(true)
			    	} else {
			    		callback(false)
			    	}
				}
			);
		});
	},

	addComment: function(id, comment, callback) {
		mongo_DB_client.connect(url, function(error, database) {
		  	database.collection('post').updateOne( 
		  		{
		  			"_id": new mongo_DB.ObjectID(id)
		  		},
		  		{
		  			$push: {
				  		"comments": comment
			  		}
		  		},
		  		function(error, result) {
					assert.equal(error, null);
			    	console.log("Comment added!");
			    	if (error == null) {
			    		callback(true)
			    	} else {
			    		callback(false)
			    	}
				}
			);
		});
	},

	getPost: function(callback) {
		mongo_DB_client.connect(url, function(error, database) {
			database.collection('post', function (error, collection) {
		        collection.find().toArray(function (error, list) {
		            callback(list);
		        });
		    });
		})
	},

	getPostWithId: function(id, callback) {
		mongo_DB_client.connect(url, function(error, database) {
			database.collection('post').findOne(
				{
				 	_id: new mongo_DB.ObjectID(id)
				},
				function(error, result) {
					assert.equal(error, null);
			    	console.log("Retrieved the entry.");
			    	if (error == null) {
			    		callback(result)
			    	} else {
			    		callback(false)
			    	}
				}
			);
		})
	},

	deletePost: function(id, callback) {
		mongo_DB_client.connect(url, function(error, database) {
			database.collection('post').deleteOne(
				{
					_id: new mongo_DB.ObjectID(id)
				},
				function(error, result) {
					assert.equal(error, null);
			    	console.log("Post deleted!");
			    	if (error == null) {
			    		callback(true)
			    	} else {
			    		callback(false)
			    	}
				}
			);
		})
	}

}
