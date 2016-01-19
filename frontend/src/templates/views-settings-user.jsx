var RDA = RDA || {};
RDA.Views = RDA.Views || {};

RDA.Views.UserSettingsView = React.createClass({
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
				<div>
					<div className="pull-right"><a href="#users" className="btn btn-info">Back to all users <span className="glyphicon glyphicon-chevron-right"></span></a></div>
					<div className="clearfix"></div>
				</div>
				<h3>Users: edit</h3>
				<RDA.Views.SettingsForm onFormSubmit={this.onFormSubmit} userid={this.props.userid}/>
				<hr/>
				<div className="form-horizontal row">
					<div className="col-sm-10">
						<div className="form-group">
							<div className="col-sm-offset-4 col-sm-8">
								<RDA.Views.ChangePasswordModal userid={this.props.userid}/>
							</div>
						</div>
					</div>
					<div className="clearfix"></div>
					<br/>
				</div>
				<RDA.Views.AlertView data={this.state.alert}/>
			</div>
		);
	}
});

RDA.Views.ChangePasswordModal = React.createClass({
	getInitialState: function() {
		return {
			data: {password: ""},
			alert: {state: null, message: null},
			ajaxRunning: 0
		};
	},
	inputChanged: function(key, e) {
		var data = this.state.data;

		if (key == "should_notify_user") {
			data[key] = $('#inputShouldNotifyUser').is(":checked");
		} else {
			data[key] = e.target.value;
		}

		this.setState(data);
	},
	handleFormSubmit: function(e) {
		e.preventDefault();

		var _this = this;
		_this.setState({ajaxRunning:1});

		if (!_this.state.data.password.match(/^[\d\w]{4,64}$/)) {
			_this.setState({alert: {state: "danger", message: "Password is too short or includes weird characters."}});
			return;
		}

		$.ajax({
			type: 'POST',
			url: app.Config.API_URI + '/api/v1/user/set_password_for_user/' + _this.props.userid,
			success: function(data) {
				console.log(data);
				_this.setState({data:{password: "", should_notify_user: false}});
				$('#changePasswordModal').modal('hide');
			},
			beforeSend: function(xhr, settings) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + app.user.attributes.access_token);
			},
            data: {
				"api_key" : app.Config.API_KEY,
				"password" : _this.state.data.password,
				"should_notify_user" : _this.state.data.should_notify_user
            },
			error: function(data) {
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
				htmlID={"changePasswordModal"}
				trigger={'<a class="btn btn-sm btn-success">Set new password</a>'}
				content={
					<form className="form-horizontal" onSubmit={this.handleFormSubmit}>
						<div className="modal-header"><h3>Set new password</h3></div>
						<div className="modal-body col-sm-12">
							<RDA.Views.AlertView data={this.state.alert}/>
							<div className="form-group">
								<label htmlFor="password" className="col-sm-2 control-label">Password</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" id="password" placeholder="Password" onChange={this.inputChanged.bind(this, 'password')} value={this.state.data.password}/>
								</div>
								<div className="clearfix"></div>
							</div>
							<div className="form-group">
								<div className="col-sm-2">
									<input type="checkbox" id="inputShouldNotifyUser" className="control-checkbox-input pull-right" onClick={this.inputChanged.bind(this, 'should_notify_user')}  checked={this.state.data.should_notify_user}/>
								</div>
								<div className="col-sm-10">
									<label htmlFor="inputShouldNotifyUser" className="col-sm-10 control-checkbox-label">Send password for the user</label>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<a className="btn btn-default" data-dismiss="modal">Cancel</a>
							<button type="submit" className="btn btn-primary">Save</button>
						</div>
					</form>
				}
			/>
		);
	}
});

RDA.Views.renderUserSettingsView = function(userid) {
	React.render(
		<RDA.Views.UserSettingsView userid={userid}/>,
		document.getElementById("app")
	);
}
