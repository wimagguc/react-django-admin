var RDA = RDA || {};
RDA.Views = RDA.Views || {};

RDA.Views.UserItem = React.createClass({
	deleteUser: function(userid, e) {
		e.preventDefault();

		if (userid == app.user.attributes.id) {
			alert("You can't delete yourself");
			return;
		}

		if (!confirm("Are you sure? This cannot be undone.")) {
			return;
		}

		var _this = this;
		_this.setState({ajaxRunning:1});

		$.ajax({
			type: 'DELETE',
			url: app.Config.API_URI + '/api/R/users/' + userid + "/",
			success: function(data) {
				_this.setState({ajaxRunning:0, data:data});
				renderUsersView();
				app.navigate("/refresh", {trigger: true});
				app.navigate("/users", {trigger: true});
			},
			beforeSend: function(xhr, settings) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + app.user.attributes.access_token);
			},
			error: function(data) {
				console.log(data);
				_this.setState( { ajaxRunning: 0 } );

				var message = "Error while deleting user.";
				if (data && data.responseText) {
					message = data.responseText;
				}

				_this.setState( { alert: {state: "danger", message: message} } );
			},
			dataType: 'json'
		});
	},
	render: function() {
		var name = this.props.data.username;
		if (this.props.data.first_name && this.props.data.last_name) {
			name = this.props.data.first_name + ' ' + this.props.data.last_name;
		} else if (this.props.data.first_name) {
			name = this.props.data.first_name;
		}
		var userSettingsURL = "#users/" + this.props.data.id;
		return (
            <tr>
				<td>
                    <span>{name}</span>
				</td>
				<td>
					<div className="pull-right">
						<a href='#' onClick={this.deleteUser.bind(this, this.props.data.id)} className="btn btn-sm btn-danger">Delete</a>
						&nbsp;
						<a href={userSettingsURL} className="btn btn-sm btn-info">Edit</a>
					</div>
				</td>
			</tr>
		);
	}
});

RDA.Views.UserList = React.createClass({
	render: function() {
		var userNodes = this.props.data.map(function (p) {
			return (
                <RDA.Views.UserItem data={p}/>
	  		);
		});
		return (
			<table className="table table-striped">
				<tbody>
					{userNodes}
				</tbody>
			</table>
		);
	}
});

RDA.Views.UserDashboard = React.createClass({displayName: "UserDashboard",
	getInitialState: function() {
		return {
			data: [],
			alert: {state: null, message: null},
			ajaxRunning:0
		};
	},
	componentDidMount: function() {
		var _this = this;
		_this.setState({ajaxRunning:1});

		$.ajax({
			type: 'GET',
			url: app.Config.API_URI + '/api/R/users',
			success: function(data) {
				_this.setState({ajaxRunning:0, data:data});
			},
            data: {
				"access_token" : app.user.attributes.access_token
            },
			error: function(data) {
				_this.setState( { ajaxRunning: 0 } );
				_this.setState( { alert: {state: "danger", message: "No access."} } );
			},
			dataType: 'json'
		});

	},
	render: function() {
		var spinnerString = "";
		if (this.state.ajaxRunning) {
			spinnerString = '<div class="well"><span class="glyphicon glyphicon-refresh spinning"></span></div>';
		}
		return (
            <div>
				<RDA.Views.AlertView data={this.state.alert}/>
				<RDA.Views.NavigationTop/>
				<h3>Users</h3>
				<br/>
				<RDA.Views.UserList data={this.state.data}/>
				<RDA.Views.AddUserModal/>
				<span dangerouslySetInnerHTML={{__html: spinnerString}}/>
			</div>
		);
	}
});

RDA.Views.AddUserModal = React.createClass({
	getInitialState: function() {
		return {
			data: {},
			alert: {state: null, message: null},
			ajaxRunning: 0
		};
	},
	inputChanged: function(key, e) {
		var data = this.state.data;
		data[key] = e.target.value;
		this.setState(data);
	},
	handleFormSubmit: function(e) {
		e.preventDefault();

		var _this = this;
		_this.setState({ajaxRunning:1});

		$.ajax({
			type: 'POST',
			url: app.Config.API_URI + '/api/R/users/',
			success: function(data) {
				_this.setState({ajaxRunning:0, data:data});
				$("#addUserModal").modal("hide");
				app.navigate("/refresh", {trigger: true});
				app.navigate("/users", {trigger: true});
			},
			beforeSend: function(xhr, settings) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + app.user.attributes.access_token);
			},
            data: {
				"username" : _this.state.data.username,
				"email" : _this.state.data.email
            },
			error: function(data) {
				console.log(data);
				_this.setState( { ajaxRunning: 0 } );

				var message = "Hiba a mentés során.";
				if (data && data.responseText) {
					message = data.responseText;
				}

				_this.setState( { alert: {state: "danger", message: message} } );
			},
			dataType: 'json'
		});

	},
	render: function() {
		return (
			<RDA.Views.ModalTrigger
				htmlID={"addUserModal"}
				trigger={'<a class="btn btn-danger">New user</a>'}
				content={
					<form className="form-horizontal" onSubmit={this.handleFormSubmit}>
						<div className="modal-header"><h3>New user</h3></div>
						<div className="modal-body col-sm-12">
							<RDA.Views.AlertView data={this.state.alert}/>
							<div className="form-group">
								<label for="username" className="col-sm-2 control-label">Username</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" id="name" placeholder="Username" onChange={this.inputChanged.bind(this, 'username')}/>
								</div>
							</div>
							<div className="form-group">
								<label for="email" className="col-sm-2 control-label">E-mail</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" id="name" placeholder="E-mail" onChange={this.inputChanged.bind(this, 'email')}/>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<a className="btn btn-default" data-dismiss="modal">Cancel</a>
							<button type="submit" className="btn btn-primary">Add user</button>
						</div>
					</form>
				}
			/>
		);
	}
});

RDA.Views.renderUsersView = function() {
	React.render(
        <RDA.Views.UserDashboard/>,
		document.getElementById('app')
	);
}
