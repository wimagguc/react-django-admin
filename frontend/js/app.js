if (typeof RDAAppConfig === 'undefined') {
	alert('Please provide a config.js!\n(See config.js.example for details.)');
}

var RDARouter = Backbone.Router.extend({
	initialize: function() {
		var User = Backbone.Model.extend({
			localStorage: new Backbone.LocalStorage(RDAAppConfig.Config.STORAGE_ID),
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
		"users" : "users",
		"refresh" : "refresh",
		"*actions" : "defaultRoute"
	}
});

_.defaults(RDARouter.prototype, RDAAppConfig);

var app = new RDARouter();

app.on('route:users', function (id) {
	if (!this.user.attributes.access_token) {
		this.navigate("/users", {trigger: true});
	} else {
		renderUsersView();
	}
});

app.on('route:refresh', function(actions) {
	if (!this.user.attributes.access_token) {
		this.navigate("/users", {trigger: true});
	} else {
		renderEmptyView();
	}
});

app.on('route:defaultRoute', function(actions) {
	if (this.user.attributes.access_token) {
		this.navigate("/users", {trigger: true});
	} else {
		renderLoginView();
	}
});
