import json
from django.http import HttpResponse
from provider.oauth2.models import AccessToken
from exceptions import UnauthorisedException
from django.contrib.auth.models import User
from backend.api.utils_basicauth import basicauth_decode
import hashlib
import pytz, datetime
import math


def as_json(fun):
	def wrapped(request, *args, **kwargs):
		try:
			resp = fun(request, *args, **kwargs)
		except UnauthorisedException as e:
			return HttpResponse("Unauthorized", status=401)
		except Exception as e:
			if request.GET.get("debug"):
				raise
			resp = {"error": e.__class__.__name__, "message": str(e)}
			if hasattr(e, "extras"):
				resp["extras"] = e.extras

		return HttpResponse(json.dumps(resp), content_type="application/json")
	return wrapped


def authenticate_request(fun):
	def wrapped(request, *args, **kwargs):
		try:
			access_token = request.POST.get('access_token', None)
			if not access_token:
				access_token = request.GET.get('access_token', None)
			if access_token:
				at = AccessToken.objects.get(token=access_token, expires__gt=datetime.datetime.utcnow())
				request.user = at.user
		except:
			pass
		return fun(request, *args, **kwargs)

	return wrapped


def profile_as_dict_full(user):
	if user==None:
		return None

	return dict(
		username=user.username,
		id=user.id,
	 	is_superuser=user.is_superuser,
		email=user.email,
	)
