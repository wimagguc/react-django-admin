import json
from django.http import HttpResponse
from provider.oauth2.models import AccessToken
from exceptions import UnauthorisedException
from django.contrib.auth.models import User
from backend.user.models import UserProfile
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
		company_name=user.profile.company_name,
		email=user.email,
	 	telephone=user.profile.telephone,
		license_no=user.profile.license_no,
	 	tax_id=user.profile.tax_id,
	 	notes=user.profile.notes,
	 	address_line_1=user.profile.address_line_1,
	 	address_line_2=user.profile.address_line_2,
	 	address_line_3=user.profile.address_line_3,
	 	city=user.profile.city,
	 	postcode=user.profile.postcode,
	 	country_name=user.profile.country_name,
	 	billing_name=user.profile.billing_name,
	 	billing_address_line_1=user.profile.billing_address_line_1,
	 	billing_address_line_2=user.profile.billing_address_line_2,
	 	billing_address_line_3=user.profile.billing_address_line_3,
	 	billing_city=user.profile.billing_city,
	 	billing_postcode=user.profile.billing_postcode,
	 	billing_country_name=user.profile.billing_country_name,
	 	postal_name=user.profile.postal_name,
	 	postal_address_line_1=user.profile.postal_address_line_1,
	 	postal_address_line_2=user.profile.postal_address_line_2,
	 	postal_address_line_3=user.profile.postal_address_line_3,
	 	postal_city=user.profile.postal_city,
	 	postal_postcode=user.profile.postal_postcode,
	 	postal_country_name=user.profile.postal_country_name,
	)
