var RDA = RDA || {};
RDA.Views = RDA.Views || {};

RDA.Views.ChangePasswordView = React.createClass({
	getInitialState: function() {
		return {
			alert: {state: null, message: null},
		}
	},
	onFormSubmit: function(state, message) {
		this.setState( { alert: {state: state, message: message} } );
	},
 	render: function() {
		return (
			<div>
				<RDA.Views.NavigationTop/>
				<h3>Change password</h3>
				<br/>
				<RDA.Views.ChangePasswordForm onFormSubmit={this.onFormSubmit} userid={this.props.userid}/>
				<RDA.Views.AlertView data={this.state.alert}/>
			</div>
		);
	}
});

RDA.Views.ChangePasswordForm = React.createClass({
	getInitialState: function() {
		return {
			user: {},
			myProfileAjaxRunning: 0,
			ajaxRunning: 0
		};
    },
    inputChanged: function(name, e) {
		var user = this.state.user
   		user[name] = e.target.value;

   		this.setState(user);
    },
	handleFormSubmit: function(e) {
		e.preventDefault();

		var _this = this;

		if (_this.state.ajaxRunning) {
			return;
		}

		if (_this.state.user.password != _this.state.user.password_confirm) {
			_this.props.onFormSubmit("danger", "Passwords don't match");
			return;
		}
		if (!_this.state.user.password.match(/^[\d\w]{4,64}$/)) {
			_this.props.onFormSubmit("danger", "Password is too short or includes weird characters");
			return;
		}

		_this.setState({ajaxRunning:1});

		$.ajax({
			type: "POST",
			url: app.Config.API_URI + "/api/v1/user/set_password/",
			success: function(data) {
				data = JSON.parse(data);
				_this.setState({ajaxRunning:0});
				_this.props.onFormSubmit("success", "Password changed");
			},
			beforeSend: function(xhr, settings) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + app.user.attributes.access_token);
			},
			data: {
				"api_key" : app.Config.API_KEY,
				"access_token" : app.user.attributes.access_token,
				"password" : _this.state.user.password,
			},
			error: function(data) {
				_this.setState({ajaxRunning: 0});
				_this.props.onFormSubmit("danger", "Something's wrong");
			},
			dataType: "text"
		});
	},
	render: function() {
		var spinnerString = "";
		var disabledString = "";
		if (this.state.ajaxRunning) {
			spinnerString = "<div class='well'><span class='glyphicon glyphicon-refresh spinning'></span></div>";
		}
		return (
			<form className="form-horizontal row" onSubmit={this.handleFormSubmit}>
				<span dangerouslySetInnerHTML={{__html: disabledString}}/>
				<div className="col-sm-10">
					<div className="form-group">
						<label htmlFor="inputPassword1" className="col-sm-4 control-label">Password</label>
						<div className="col-sm-8">
							<input type="password" className="form-control" id="inputPassword1" placeholder="Password" onChange={this.inputChanged.bind(this, 'password')} value={this.state.user.password} required/>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="inputPassword2" className="col-sm-4 control-label">Re-type Password</label>
						<div className="col-sm-8">
							<input type="password" className="form-control" id="inputPassword2" placeholder="Re-type Password" onChange={this.inputChanged.bind(this, 'password_confirm')} value={this.state.user.password_confirm} required/>
						</div>
					</div>

					<span dangerouslySetInnerHTML={{__html: spinnerString}}/>

					<div className="form-group">
						<div className="col-sm-offset-4 col-sm-8">
							<button type="submit" id="settingsSaveButton" className="btn btn-primary">Save</button>
						</div>
					</div>
				</div>
			</form>
		);
	}
});

RDA.Views.renderChangePasswordView = function() {
	React.render(
		<RDA.Views.ChangePasswordView/>,
		document.getElementById("app")
	);
}
