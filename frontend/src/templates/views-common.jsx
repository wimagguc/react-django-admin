var RDA = RDA || {};
RDA.Views = RDA.Views || {};

RDA.Views.NavigationTop = React.createClass({
	handleLogout: function(e) {
		e.preventDefault();
		app.user.save({access_token:null});
		app.navigate("/", {trigger: true});
	},
	render: function() {
		var companyName = app.user && app.user.attributes.data && app.user.attributes.data.user ? app.user.attributes.data.user.username : "User";
		var isSuperUser = app.user && app.user.attributes.data && app.user.attributes.data.user ? app.user.attributes.data.user.is_superuser : false;

		var links = [
			{ hash: "#users", text:"Users", className: ""}
		];

		for (var i=0; i<links.length; i++) {
			if ($(location).attr('hash').indexOf(links[i].hash) > -1) {
				links[i].className = "active";
			}
		}

		var profileClassName = "pull-right dropdown";
		if ($(location).attr('hash').indexOf("settings") > -1 ||
			$(location).attr('hash').indexOf("password") > -1 )
		{
			profileClassName += " active";
		}

		return (
			<div className="row">
				<ul className="nav nav-tabs">
					<li role="presentation" className={links[0].className}><a href={links[0].hash}>{links[0].text}</a></li>
						<li role="presentation" className={profileClassName}>
						<a className="dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
							{companyName} <span className="caret"></span>
						</a>
						<ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
							<li><a href="#settings">Settings</a></li>
							<li><a href="#password">Change Password</a></li>
							<li className="divider"></li>
							<li><a href="#" onClick={this.handleLogout}>Logout</a></li>
						</ul>
					</li>
				</ul>
				<br/>
			</div>
		);
	}
});

RDA.Views.AlertView = React.createClass({
	render: function() {
		var classString = 'alertView alert alert-dismissable';
		if (this.props.data.state) {
			classString += ' alert-' + this.props.data.state;
		} else {
			classString += ' hidden';
		}
  		return (
			<div className={classString} role="alert">
				<button type="button" className="close" data-dismiss="alert">
					<span aria-hidden="true">×</span>
					<span className="sr-only">Close</span>
				</button>
				{this.props.data.message}
			</div>
		);
	}
});

RDA.Views.ModalTrigger = React.createClass({
	handleClick: function(e) {
		e.preventDefault();
		$(this.refs.payload.getDOMNode()).modal();
	},
	render: function() {
		return (
			<span onClick={this.handleClick}>
				<span dangerouslySetInnerHTML={{__html: this.props.trigger}} />
				<RDA.Views.Modal ref="payload"
					content={this.props.content}
					htmlID={this.props.htmlID}
				/>
			</span>
		);
	}
});

RDA.Views.Modal = React.createClass({
	componentDidMount: function() {
		$(this.getDOMNode()).modal({
			background: true,
			keyboard: true,
			show: false
		})
	},
	componentWillUnmount: function(){
		$(this.getDOMNode()).off('hidden');
	},
	handleClick: function(e) {
		e.stopPropagation();
	},
	render: function() {
		return (
			<div onClick={this.handleClick} className="modal fade" role="dialog" aria-hidden="true" id={this.props.htmlID}>
				<div className="modal-dialog">
					<div className="modal-content">
						{this.props.content}
					</div>
				</div>
			</div>
		);
	}
});
