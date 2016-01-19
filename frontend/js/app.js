var RDA = this.RDA || {};
RDA.Views = RDA.Views || {};

var RDARouter = Backbone.Router.extend({
	initialize: function() {
		var User = Backbone.Model.extend({
			localStorage: new Backbone.LocalStorage(RDA.Config.STORAGE_ID),
			defaults: function() {
				return {
					id: 1,
					access_token: null,
					data: {}
				};
		    }
		});
		this.user = new User();
		this.user.fetch();
	},
    routes: {
		"refresh" : "refresh",
		"hello" : "hello",
		"settings" : "settings",
		"users/:userid" : "usersettings",
		"users" : "users",
		"password/:userid" : "password",
		"password" : "password",
		"*actions" : "defaultRoute"
	}
});

_.defaults(RDARouter.prototype, {
	Config: RDA.Config,
	API: RDA.API,
	Views: RDA.Views
});

var app = new RDARouter();

app.on('route:users', function (id) {
	if (!this.user.attributes.access_token) {
		this.navigate("/", {trigger: true});
	} else {
		app.Views.renderUsersView();
	}
});

app.on('route:settings', function () {
	if (!this.user.attributes.access_token) {
		this.navigate("/", {trigger: true});
	} else {
		app.Views.renderSettingsView();
	}
});

app.on('route:usersettings', function (userid) {
	if (!this.user.attributes.access_token) {
		this.navigate("/", {trigger: true});
	} else {
		app.Views.renderUserSettingsView(userid);
	}
});

app.on('route:password', function (userid) {
	if (!this.user.attributes.access_token) {
		this.navigate("/", {trigger: true});
	} else {
		app.Views.renderChangePasswordView(userid);
	}
});

app.on('route:refresh', function(actions) {
	if (!this.user.attributes.access_token) {
		this.navigate("/", {trigger: true});
	} else {
		app.Views.renderEmptyView();
	}
});

app.on('route:hello', function(actions) {
	if (!this.user.attributes.access_token) {
		this.navigate("/", {trigger: true});
	} else {
		app.Views.renderHelloView();
	}
});

app.on('route:defaultRoute', function(actions) {
	if (this.user.attributes.access_token) {
		this.navigate("/", {trigger: true});
	} else {
		app.Views.renderLoginView();
	}
});
