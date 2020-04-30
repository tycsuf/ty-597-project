var Link = window.ReactRouter.Link;
var Route = window.ReactRouter.Route;
var Router = window.ReactRouter.Router;
var browserHistory = window.ReactRouter.browserHistory;
var hashHistory = window.ReactRouter.hashHistory;


class ShowPost extends React.Component {
	constructor(props) {
		super(props);
		this.updatePost = this.updatePost.bind(this);
		this.getPost = this.getPost.bind(this);
		this.deletePost = this.deletePost.bind(this);
		this.incrementLikeCount = this.incrementLikeCount.bind(this);
		this.addComment = this.addComment.bind(this);
		this.handleCommentsChange = this.handleCommentsChange.bind(this);
		this.savePost = this.savePost.bind(this);
		this.state = {
			posts: [],
			name: '',
			user: '',
			tempComment: ''
		};
	}

	updatePost(id) {
		hashHistory.push('/addPost/' + id);
	    scroll(0, 0)
	}

	getPost() {
		var self = this;

		axios.post('/getPost', {})
		.then(function(response) {
			console.log('Get post response: ', response);
			self.setState({
				posts: response.data
			})
		})
		.catch(function(error) {
			console.log('Error: ',error);
		});
	}

	savePost(id) {
		var self = this;

		axios.post('/savePost', {
			id: id
		})
		.then(function(response) {
			self.getPost();
		})
		.catch(function(error) {
			console.log('Error: ', error);
		});
	}

	deletePost(id) {
		if (confirm('Are you sure you want to delete this post?')) {
			var self = this;

			axios.post('/deletePost', {
				id: id
			})
			.then(function(response) {
				axios.post('/unsavePost', {
					id: id
				})
				.then(function(response) {
					self.getPost();
				})
				.catch(function(error) {
					console.log('Error: ', error);
				});
			})
			.catch(function(error) {
				console.log('Error: ', error);
			})
		}
	}

	getUser() {
		var self = this;

		axios.post('/getProfile', {})
		.then(function(response) {
			self.setState({
				name: response.data.name,
				user: response.data.email
			});
			document.getElementById('welcome-user').textContent = "Welcome, " + self.state.name;
		})
		.catch(function(error) {
			console.log('Error: ', error);
		});
	}
	
	componentDidMount() {
		this.getPost();
		this.getUser();
		document.getElementById('homeHyperlink').className = "active";
		document.getElementById('profileHyperlink').className = "";
		document.getElementById('addHyperLink').className = "";
		document.getElementById('savedPostsHyperlink').className = "";
	}

	incrementLikeCount(id) {
		var self = this;

		axios.post('/incrementLikeCount', {
			id: id
		})
		.then(function(response) {
			self.getPost();
		})
		.catch(function(error) {
			console.log('Error: ', error);
		});
	}

	addComment(id, comment, index) {
		var self = this;

		document.getElementById("commentInput" + (index + 1)).value = "";

		axios.post('/getProfile', {})
		.then(function(response) {
			self.setState({
				tempUsername: response.data.email
			});

			axios.post('/addComment', {
				id: id,
				comment: self.state.tempUsername + ': ' + comment
			})
			.then(function(response) {
				self.getPost();
			})
			.catch(function(error) {
				console.log('Error: ', error);
			});
		})
		.catch(function(error) {
			console.log('Error: ', error);
		});

	}

	handleCommentsChange(event) {
		this.setState({
			tempComment: event.target.value
		});
	}
	
	render() {
		return (
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Post#</th>
						<th>Title</th>
						<th>Picture</th>
						<th>Subject</th>
						<th>Comments</th>
						<th>Likes</th>
						<th style={{whiteSpace:"nowrap"}}>Save Post</th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{
						this.state.posts.map(function(post, index) {

							const postComments = []
							for (const [index, comment] of post.comments.entries()) {
								var colonIndex = comment.indexOf(':') + 1
								postComments.push(<div id="comment"><strong>{comment.substr(0, colonIndex)}</strong><br></br>{comment.substr(colonIndex)}</div>);
							}

							return <tr key={index} >
										<td>{index + 1}</td>
										<td>{post.title}</td>
										<td><img src={post.selectedFile} alt="barcelona"></img></td>
										<td>{post.subject}</td>
										<td>
											<div id="comments">{postComments}</div>
											<div className="form-group">
												<textarea id={"commentInput" + (index + 1)} className="form-control" onBlur={this.handleCommentsChange} type="textarea" placeholder="Add a comment.." maxlength="1000" rows="5"></textarea>
											</div>
											<button type="button" onClick={this.addComment.bind(this, post._id, this.state.tempComment, index)} id="submit" name="submit" className="btn btn-primary pull-right">Add Comment!</button>
										</td>
										<td style={{textAlign:"center"}}>
											<button id={"likeButton" + (index + 1)} onClick={this.incrementLikeCount.bind(this, post._id)}>
												<span className="glyphicon glyphicon-heart" style={{color:'#FF0000'}}>{post.likeCount}</span>
											</button>
										</td>
										<td style={{textAlign:"center"}}>
											<button id={"saveButton" + (index + 1)} className="glyphicon glyphicon-bookmark" onClick={this.savePost.bind(this, post._id)}></button>
										</td>
										<td>
											{this.state.user == 'admin'? <span onClick={this.updatePost.bind(this, post._id)} className="glyphicon glyphicon-pencil"></span>: null}
										</td>
										<td>
											{this.state.user == 'admin'? <span onClick={this.deletePost.bind(this, post._id)} className="glyphicon glyphicon-remove"></span>: null}
										</td>
										<td></td>
									</tr>
						}.bind(this)
						)
					}
				</tbody>
			</table>
		)
	}
}


class AddPost extends React.Component {
	constructor(props) {
		super(props);
		this.addPost = this.addPost.bind(this);
		this.getPostWithId = this.getPostWithId.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleSubjectChange = this.handleSubjectChange.bind(this);
		this.handleFileChange = this.handleFileChange.bind(this);
		this.state = {
			id: '',
			title: '',
			subject: '',
			selectedFile: '',
			likeCount: 0,
			comments: []
		};
	}

	componentDidMount() {
		document.getElementById('addHyperLink').className = "active";
		document.getElementById('savedPostsHyperlink').className = "";
		document.getElementById('profileHyperlink').className = "";
		document.getElementById('homeHyperlink').className = "";
		this.getPostWithId();
	}

	addPost() {
		this.setState({
			likeCount: 0,
			comments: []
		})
		axios.post('/addPost', {
			title: this.state.title,
			subject: this.state.subject,
			id: this.props.params.id,
			selectedFile: this.state.selectedFile,
			likeCount: this.state.likeCount,
			comments: this.state.comments
		})
		.then(function(response) {
			console.log('Add post response: ', response);
			hashHistory.push('/')
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	getPostWithId() {
		var self = this;
		var id = this.props.params.id;
		
		axios.post('/getPostWithId', {
			id: id
		})
		.then(function(response) {
			if (response) {
				self.setState({
					title: response.data.title
				});
				self.setState({
					subject: response.data.subject
				});
				self.setState({
					selectedFile: response.data.selectedFile
				});
			}
		})
		.catch(function(error) {
			console.log('Error: ', error);
		});
	}

	handleTitleChange(event) {
		this.setState({
			title: event.target.value
		})
	}

	handleSubjectChange(event) {
		this.setState({
			subject: event.target.value
		})
	}

	handleFileChange(event) {
		var str = document.getElementById("image").value;
		console.log("/photos/" + str.substring(str.indexOf("\\", str.indexOf("\\") + 1) + 1));
	  	this.setState({
	  		selectedFile: "/photos/" + str.substring(str.indexOf("\\", str.indexOf("\\") + 1) + 1)
	  	})
	}

	render() {
		return (
			<div className="col-md-5">
				<h3>Add a Post!</h3>
				<div className="form-area">  
					<form role="form">
						<br styles="clear:both" />
						<div className="form-group">
							<input value={this.state.title} type="text" onChange={this.handleTitleChange} className="form-control" id="title" name="title" placeholder="Title" required />
						</div>
					 
						<div className="form-group">
							<textarea value={this.state.subject} className="form-control" onChange={this.handleSubjectChange} type="textarea" id="subject" placeholder="Subject" maxlength="140" rows="7"></textarea>
						</div>

						<input type="file" id="image" onChange={this.handleFileChange}></input>
						<button type="button" onClick={this.addPost} id="submit" name="submit" className="btn btn-primary pull-right">Add Post!</button>
					</form>
				</div>
			</div>
		)
	}
}


class SavedPosts extends React.Component {
	constructor(props) {
		super(props);
		this.getSavedPosts = this.getSavedPosts.bind(this);
		this.state = {
			savedPosts: []
		};
	}

	componentDidMount() {
		this.getSavedPosts();
		document.getElementById('savedPostsHyperlink').className = "active";
		document.getElementById('homeHyperlink').className = "";
		document.getElementById('profileHyperlink').className = "";
		document.getElementById('addHyperLink').className = "";
	}

	getSavedPosts() {
		var self = this;

		axios.post('/getProfile', {})
		.then(function(response) {
			self.setState({
				savedPosts: []
			});
			console.log('User email: ', response.data.email);
			console.log('Saved posts: ', response.data.savedPosts);
			if (response.data.savedPosts != undefined) {
				response.data.savedPosts.forEach(id => {
					console.log("ID here: ", id);
					axios.post('/getPostWithId', {
						id: id
					})
					.then(function(response) {
						if (response) {
							console.log("Get post with id response: ", response);
							self.state.savedPosts.push(response.data);
							var newSavedPosts = self.state.savedPosts
							self.setState({
								savedPosts: newSavedPosts
							});
							console.log("Saved posts array: ", self.state.savedPosts);
						}
					})
					.catch(function(error) {
						console.log('Error: ', error);
					})
				})
			}
		})
		.catch(function(error) {
			console.log('Error: ',error);
		});
	}

	unsavePost(id) {
		if (confirm('Are you sure you want to unsave this post?')) {
			var self = this;

			axios.post('/unsavePost', {
				id: id
			})
			.then(function(response) {
				self.getSavedPosts();
			})
			.catch(function(error) {
				console.log('Error: ', error);
			});
		}
	}
	
	render() {
		return (
			<div>
				<h2>Saved Posts</h2>
				<table className="table table-striped">
					<thead>
						<tr>
							<th>#</th>
							<th>Title</th>
							<th>Picture</th>
							<th>Subject</th>
							<th>Comments</th>
							<th>Likes</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{
							this.state.savedPosts.map(function(post, index) {

								const postComments = []
								for (const [index, comment] of post.comments.entries()) {
									var colonIndex = comment.indexOf(':') + 1
									postComments.push(<div id="comment"><strong>{comment.substr(0, colonIndex)}</strong><br></br>{comment.substr(colonIndex)}</div>);
								}

								return <tr key={index} >
											<td>{index + 1}</td>
											<td>{post.title}</td>
											<td><img src={post.selectedFile} alt="barcelona"></img></td>
											<td>{post.subject}</td>
											<td>
												<div id="comments">{postComments}</div>
											</td>
											<td style={{textAlign:"center"}}>
												<span className="glyphicon glyphicon-heart" style={{color:'#FF0000'}}>{post.likeCount}</span>
											</td>
											<td>
												<span onClick={this.unsavePost.bind(this, post._id)} className="glyphicon glyphicon-remove"></span>
											</td>
											<td></td>
										</tr>
							}.bind(this)
							)
						}
					</tbody>
				</table>
			</div>
		)
	}
}


class ShowProfile extends React.Component {
	constructor(props) {
		super(props);
		this.updateProfile = this.updateProfile.bind(this);
		this.getProfile = this.getProfile.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.state = {
			name: '',
			email: '',
			password: '',
			id: ''
		};
	}

	componentDidMount() {
		document.getElementById('profileHyperlink').className = "active";
		document.getElementById('addHyperLink').className = "";
		document.getElementById('homeHyperlink').className = "";
		document.getElementById('savedPostsHyperlink').className = "";
		this.getProfile();
	}

	updateProfile() {
		var self = this;

		axios.post('/updateProfile', {
			name: this.state.name,
			password: this.state.password
		})
		.then(function(response) {
			if (response) {
				hashHistory.push('/')  
			}
		})
		.catch(function(error) {
			console.log('Error: ', error);
		});
	}

	getProfile() {
		var self = this;

		axios.post('/getProfile', {})
		.then(function(response) {
			if (response) {
				self.setState({
					email: response.data.email
				});
				self.setState({
					password: response.data.password
				});
				self.setState({
					name: response.data.name
				});
			}
		})
		.catch(function(error) {
			console.log('Error: ', error);
		});
	}

	handleNameChange(event) {
		this.setState({
			name: event.target.value
		})
	}

	handlePasswordChange(event) {
		this.setState({
			password: event.target.value
		})
	}

	resetAll() {
		axios.post('/resetAll', {})
		.then(function(response) {
			window.location.assign('http://localhost:5432/');
		})
		.catch(function(error) {
			console.log('Error: ', error);
		});
	}
	
	render() {
		return (
			<div className="col-md-5">
				<div className="form-area">  
					<form role="form">
						<br styles="clear:both" />
						<div className="form-group">
							<span>Change name: </span>
							<input value={this.state.name} type="text" onChange={this.handleNameChange} className="form-control" placeholder="Name" required />
						</div>
					 
						<div className="form-group">
							<span>Change password: </span>
							<input value={this.state.password} type="password" onChange={this.handlePasswordChange} className="form-control" placeholder="Password" required />
						</div>

						{this.state.email == 'admin'? <button type="button" onClick={this.resetAll} id="resetAll" name="resetAll">Reset All</button>: null}
					 
						<button type="button" onClick={this.updateProfile} id="submit" name="submit" className="btn btn-primary pull-right">Update Profile!</button>
					</form>
				</div>
			</div>
		)
	}
}


ReactDOM.render(
	<Router history={hashHistory}>
		<Route component={ShowPost} path="/"></Route>
		<Route component={AddPost} path="/addPost(/:id)"></Route>
		<Route component={ShowProfile} path="/showProfile"></Route>
		<Route component={SavedPosts} path="/savedPosts"></Route>
	</Router>,
	document.getElementById('app')
);
