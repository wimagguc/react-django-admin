var RDA = RDA || {};
RDA.Views = RDA.Views || {};

RDA.Views.LoginView = React.createClass({
	getInitialState: function() {
		return { alert: {state: null, message: null} };
	},
	onFormSubmit: function(state, message) {
		this.setState( { alert: {state: state, message: message} } );
	},
  	render: function() {
		return (
			<div className="loginView" id="form_signin">
				<RDA.Views.LoginForm onFormSubmit={this.onFormSubmit}/>
				<RDA.Views.AlertView data={this.state.alert}/>
			</div>
		);
	}
});

RDA.Views.LoginForm = React.createClass({
    getInitialState: function() {
        return {username: null, password: null, ajaxRunning: 0};
    },
    inputChanged: function(name, e) {
    	var change = {};
    	change[name] = e.target.value;
    	this.setState(change);
    },
	handleFormSubmit: function(e) {
		e.preventDefault();

		var _this = this;

		if (_this.state.ajaxRunning) {
			return;
		}

		_this.setState({ajaxRunning:1});

		$.ajax({
			type: 'POST',
			url: app.Config.API_URI + '/o/token/',
			success: function(data) {
				_this.setState({ajaxRunning:0});
				data = JSON.parse(data);

				if (('localStorage' in window) && window['localStorage'] !== null) {
					localStorage["RDA_APP.user.at"] = data.access_token;
				}

				app.user.save({access_token:data.access_token});
				app.navigate("/users", {trigger: true});
			},
			data: {
				"grant_type" : "password",
				"client_id" : app.Config.CLIENT_ID,
				"client_secret" : app.Config.CLIENT_SECRET,
				"username" : _this.state.username,
				"password" : _this.state.password
			},
			error: function(data) {
				_this.setState({ajaxRunning:0});
				_this.props.onFormSubmit("danger", "Can't log in. Please check your password.");
			},
			dataType: 'text'
		});
	},
	render: function() {
		var spinnerString = "";
		var disabledString = "";
		if (this.state.ajaxRunning) {
			disabledString = "disabled";
			spinnerString = '<span class="glyphicon glyphicon-refresh spinning"></span> ';
		}
		return (
			<form className="loginForm form-signin row" onSubmit={this.handleFormSubmit}>
				<input type="text" className="inputUsername form-control" id="inputUsername" placeholder="Username" onChange={this.inputChanged.bind(this, 'username')} required autofocus/>
				<input type="password" className="inputPassword form-control" id="inputUsername" placeholder="Password" onChange={this.inputChanged.bind(this, 'password')} required autofocus/>
				<button type="submit" className="btn btn-lg btn-primary btn-block" id="loginButton" disabled={disabledString}><span dangerouslySetInnerHTML={{__html: spinnerString}} />Login</button>
			</form>
		);
	}
});

RDA.Views.renderLoginView = function() {
	React.render(
		<RDA.Views.LoginView/>,
		document.getElementById('app')
	);
}
