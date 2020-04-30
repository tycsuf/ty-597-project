var Link = window.ReactRouter.Link;
var Route = window.ReactRouter.Route;
var Router = window.ReactRouter.Router;
var hash_history = window.ReactRouter.hashHistory;


class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.signUp = this.signUp.bind(this);
		this.state = {
			name: '',
			email: '',
			password: '',
			savedPosts: []
		};
	}

	handleEmailChange(event) {
		this.setState({
			email: event.target.value
		})
	}

	handlePasswordChange(event) {
		this.setState({
			password: event.target.value
		})
	}

	handleNameChange(event) {
		this.setState({
			name: event.target.value
		})
	}

	signUp() {
		axios.post('/signup', {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			savedPosts: this.state.savedPosts
		})
		.then(function(response) {
			console.log('Sign up response: ', response);
			window.location.assign('http://localhost:7777/');
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	render() {
		return (
			<div>
				<form className="form-signin">
					<h2 className="form-signin-heading">Register for an Account!</h2>
					<label for="inputName" className="sr-only">Name:</label>
					<input type="name" onChange={this.handleNameChange} id="inputName" className="form-control" placeholder="Name" required autofocus />
					<label for="inputEmail" className="sr-only">E-mail:</label>
					<input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="E-mail" required autofocus />
					<label for="inputPassword" className="sr-only">Password:</label>
					<input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Password" required />
					<button className="btn btn-lg btn-primary btn-block" onClick={this.signUp} type="button">Sign Up!</button>
				</form>
				<div>
					<Link to="/">{'Already have an account? Sign In!'}</Link>
				</div>
			</div>
		)
	}
}


class Signin extends React.Component {
	constructor(props) {
		super(props);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.signIn = this.signIn.bind(this);
		this.state = {
			email: '',
			password: ''
		};
	}

	handleEmailChange(event) {
		this.setState({
			email: event.target.value
		})
	}

	handlePasswordChange(event) {
		this.setState({
			password: event.target.value
		})
	}

	signIn() {
		var self = this;
		axios.post('/signin', {
			email: this.state.email,
			password: this.state.password
		})
		.then(function(response) {
			if (response.data == 'Sign in successful!') {
				window.location.assign('http://localhost:5432/home');
			}
			console.log(self.state.email);
			console.log(self.state.password);
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	render() {
		return (
			<div>
				<form className="form-signin">
					<h1 className="welcome-heading">Welcome to Tim's Travel Blog!</h1>
					<h2 className="form-signin-heading">Sign In</h2>
					<label for="inputEmail" className="sr-only">Email Address:</label>
					<input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="E-mail" required autofocus />
					<label for="inputPassword" className="sr-only">Password:</label>
					<input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Password" required />
					<button className="btn btn-lg btn-primary btn-block" onClick={this.signIn} type="button">Sign In!</button>
				</form>
				<div>
					<Link to="/signup">{'First time user? Sign Up!'}</Link>
				</div>
			</div>
		)
	}
}


ReactDOM.render(
	<Router history={hash_history}>
		<Route component={Signin} path="/"></Route>
		<Route component={Signup} path="/signup"></Route>
	</Router>,
	document.getElementById('app')
);
