var mongo_db_client = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/Blog";
var assert = require("assert");

module.exports = {

	getUserInfo: function(username, callback) {
		mongo_db_client.connect(url, function(error, database) {
			database.collection('user').findOne(
				{
					"email": username 
				},
				function(error, result) {
					if (result == null) {
						callback(false)
					} else {
						callback(result);
					}
				}
			);
		});
	},

	signup: function(name, email, password, savedPosts, callback) {
		mongo_db_client.connect(url, function(error, database) {
		  	database.collection('user').insertOne(
			  	{
					"name": name,
					"email": email,
					"password": password,
					"savedPosts": savedPosts
				},
				function(error, result) {
					assert.equal(error, null);
			    	console.log("User registered!");
			    	if (result == null) {
			    		callback(false)
			    	} else {
			    		callback(result);
			    	}
				}
			);
		});
	},

	updateProfile: function(name, password, username, callback) {
		mongo_db_client.connect(url, function(error, database) {
		  	database.collection('user').updateOne( 
		  		{
		  			"email": username
		  		},
		  		{
		  			$set: {
		  				"name": name,
		  			  	"password": password 
		  			}
		  		},
		  		function(error, result) {
			    	if (error == null) {
			    		callback(true)
			    	} else {
			    		callback(false)
			    	}
				}
			);
		});
	},

	validateSignIn: function(username, password, callback) {
		mongo_db_client.connect(url, function(error, database) {
			database.collection('user').findOne(
				{
					"email": username,
					"password": password 
				},
				function(error, result) {
					if (result == null) {
						console.log('Sign in unsuccessful.')
						callback(false)
					} else {
						console.log('Sign in successful!')
						callback(true)
					}
				}
			);
		});
	},

	savePost: function(username, id, callback) {
		mongo_db_client.connect(url, function(error, database) {
		  	database.collection('user').updateOne( 
		  		{
		  			"email": username
		  		},
		  		{
		  			$addToSet: {
				  		"savedPosts": id
			  		}
		  		},
		  		function(error, result) {
					assert.equal(error, null);
			    	console.log("Post saved!");
			    	if (error == null) {
			    		callback(true)
			    	} else {
			    		callback(false)
			    	}
				}
			);
		});
	},

	unsavePost: function(username, id, callback) {
		mongo_db_client.connect(url, function(error, database) {
		  	database.collection('user').updateOne( 
		  		{
		  			"email": username
		  		},
		  		{
		  			$pull: {
				  		"savedPosts": id
			  		}
		  		},
		  		function(error, result) {
					assert.equal(error, null);
			    	console.log("Post unsaved!");
			    	if (error == null) {
			    		callback(true)
			    	} else {
			    		callback(false)
			    	}
				}
			);
		});
	},

	resetAll: function(callback) {
		mongo_db_client.connect(url, function(error, database) {
			database.dropDatabase(function(error, result) {
				console.log("Database cleared!");
				if (error == null) {
					callback(true)
				} else {
					callback(false)
				}
			});
		});
	}

}
