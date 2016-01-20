from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view

from backend.api.utils import *
from backend.api.settings import *
from backend.user.notification import send_new_password_to_user

import pytz, datetime
import re


## GET PROFILE FOR THE AUTHENTICATED USER
@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
@as_json
def get_profile(request, userid=None):
	if request.POST.get('api_key', None) != API_KEY_V2:
		return {"status" : 403}

	user = None

	if not userid:
		user = request.user
	else:
		if not request.user.is_superuser:
			return {"status" : 403}
		try:
			user = User.objects.get(id=userid)
		except:
			return {"status" : 404}

	return {
		"status" : 200,
		"user" : profile_as_dict_full(user)
	}


## UPDATE PROFILE FOR THE AUTHENTICATED USER
@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
@as_json
def set_profile(request, userid=None):
	if request.POST.get('api_key', None) != API_KEY_V2:
		return {"status" : 403}

	user = None

	if not userid:
		user = request.user
	else:
		if not request.user.is_superuser:
			return {"status" : 403}
		try:
			user = User.objects.get(id=userid)
		except:
			return {"status" : 404}

	try:
		if request.POST.get('email', None) != user.email:
			user.email = request.POST.get('email', None)
			user.save()
	except:
		return {"status" : 501}

	return {
		"status" : 200,
		"user" : profile_as_dict_full(user)
	}


## UPDATE PASSWORD FOR THE AUTHENTICATED USER
@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
@as_json
def set_password(request):
	if request.POST.get('api_key', None) != API_KEY_V2:
		return {"status" : 403}

	try:
		request.user.set_password( request.POST.get('password', None) )
		request.user.save()
	except:
		return {"status" : 501}

	return {
		"status" : 200
	}

## UPDATE PASSWORD FOR ANOTHER USER
@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
@as_json
def set_password_for_user(request, userid=None):
	if request.POST.get('api_key', None) != API_KEY_V2:
		return {"status" : 403}

	user = None

	if not userid:
		return {"status" : 500}
	else:
		if not request.user.is_superuser:
			return {"status" : 403}
		try:
			user = User.objects.get(id=userid)
		except:
			return {"status" : 404}

	try:
		new_password = request.POST.get('password', None)

		user.set_password( new_password )
		user.save()

		shouldNotifyUser = request.POST.get('should_notify_user', None)
		if shouldNotifyUser == True or shouldNotifyUser == "true":
			send_new_password_to_user(user=user, password=new_password)

	except:
		return {"status" : 501}

	return {
		"status" : 200
	}
