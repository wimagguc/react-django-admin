var RDA = RDA || {};
RDA.Views = RDA.Views || {};

RDA.Views.SettingsView = React.createClass({
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
				<h3>Settings</h3>
				<br/>
				<RDA.Views.SettingsForm onFormSubmit={this.onFormSubmit} userid={this.props.userid}/>
				<RDA.Views.AlertView data={this.state.alert}/>
			</div>
		);
	}
});

RDA.Views.SettingsForm = React.createClass({
	getInitialState: function() {
		return {
			user: {},
			myProfileAjaxRunning: 0,
			ajaxRunning: 0
		};
    },
    componentDidMount: function() {
		var _this = this;
		_this.setState({myProfileAjaxRunning:1});

		app.API.getUserById({
			userid: (this.props.userid ? this.props.userid : ""),
			success: function(data) {
				if (data && data.status != 200) {
					_this.setState( { myProfileAjaxRunning: 0 } );
					_this.props.onFormSubmit( { alert: {state: "danger", message: data.status + " error."} } );
				} else {
					_this.setState( { myProfileAjaxRunning: 0, user: data.user } );
				}
			},
			error: function(data) {
				_this.setState( { myProfileAjaxRunning: 0 } );
				_this.props.onFormSubmit( { alert: {state: "danger", message: "Network error. Please try again later."} } );
			}
		});

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

		_this.setState({ajaxRunning:1});

		$.ajax({
			type: "POST",
			url: app.Config.API_URI + "/api/v1/user/set_profile/" + (this.props.userid ? this.props.userid : ""),
			success: function(data) {
				_this.setState({ajaxRunning:0});
				data = JSON.parse(data);
				app.user.save({data:data.access_token});
				_this.props.onFormSubmit("success", "Settings saved.");
			},
			beforeSend: function(xhr, settings) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + app.user.attributes.access_token);
			},
			data: {
				"api_key" : app.Config.API_KEY,
				"access_token" : app.user.attributes.access_token,
				"email" : _this.state.user.email
			},
			error: function(data) {
				_this.setState({ajaxRunning: 0});
				_this.props.onFormSubmit("danger", "Something is wrong.");
			},
			dataType: "text"
		});
	},
	render: function() {
		var spinnerString = "";
		var disabledString = "";
		if (this.state.myProfileAjaxRunning) {
			disabledString = "<div class='well'><span class='glyphicon glyphicon-refresh spinning'></span></div>";
		}
		if (this.state.ajaxRunning) {
			spinnerString = "<div class='well'><span class='glyphicon glyphicon-refresh spinning'></span></div>";
		}
		return (
			<form className="form-horizontal row" onSubmit={this.handleFormSubmit}>
				<div className="col-sm-10">

					<span dangerouslySetInnerHTML={{__html: disabledString}}/>
					<div className="form-group">
						<label htmlFor="inputUsername" className="col-sm-4 control-label">Username</label>
						<div className="col-sm-8">
							<input type="email" className="form-control" id="inputUsername" placeholder="Username" onChange={this.inputChanged.bind(this, 'username')} value={this.state.user.username} required/>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="inputEmail" className="col-sm-4 control-label">E-mail</label>
						<div className="col-sm-8">
							<input type="email" className="form-control" id="inputEmail" placeholder="E-mail" onChange={this.inputChanged.bind(this, 'email')} value={this.state.user.email} required/>
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

RDA.Views.renderSettingsView = function() {
	React.render(
		<RDA.Views.SettingsView/>,
		document.getElementById("app")
	);
}
