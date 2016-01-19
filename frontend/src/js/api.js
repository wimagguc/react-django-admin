var RDA = this.RDA || {};

//
// API Calls used by the app.
// Functions may use external attributes from {app}. Don't reuse them without
// making sure you reuse {app} as well.
//
RDA.API = {

    //
    // POST /api/v1/user/get_profile/<userid>
    // Parameters:
    //   * s.userid -> <userid>
    //   * s.success: $.ajax's success callback
    //   * s.error: $.ajax's error callback
    //
    // !!! Uses external attributes from {app.Config} and {app.user}
    //
    getUserById : function(s) {
        $.ajax({
            type: 'POST',
            url: app.Config.API_URI + "/api/v1/user/get_profile/" + s.userid,
            success: s.success,
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + app.user.attributes.access_token);
            },
            data: {
                "api_key" : app.Config.API_KEY,
            },
            error: s.error,
            dataType: 'json'
        });
    }

};
