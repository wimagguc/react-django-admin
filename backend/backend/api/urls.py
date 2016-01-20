from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
	# Partner user profiles: read & edit
	url(r'^v1/user/get_profile/$', 'backend.api.handler_v1_user.get_profile'),
	url(r'^v1/user/get_profile/(?P<userid>\d+)', 'backend.api.handler_v1_user.get_profile'),
 	url(r'^v1/user/set_profile/$', 'backend.api.handler_v1_user.set_profile'),
	url(r'^v1/user/set_profile/(?P<userid>\d+)', 'backend.api.handler_v1_user.set_profile'),
 	url(r'^v1/user/set_password/$', 'backend.api.handler_v1_user.set_password'),
 	url(r'^v1/user/set_password_for_user/(?P<userid>\d+)$', 'backend.api.handler_v1_user.set_password_for_user'),
)
