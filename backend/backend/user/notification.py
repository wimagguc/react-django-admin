from django.contrib.auth.models import User
from django.template.loader import render_to_string
from backend.user.mail import send_mail

def send_new_password_to_user(user=None, password=None):
	try:
		from_mail = 'Test <info@test.com>'
		to_mails = [user.email]

		context = {'user' : user,
				   'password' : password}

		message_html = render_to_string('user/emails/passwordchanged.html', context)
		message_txt = render_to_string('user/emails/passwordchanged.txt', context)
		subject = render_to_string('user/emails/passwordchanged_subject.txt', context)

		send_mail(subject.rstrip('\n'), message_txt, message_html, from_mail, to_mails)

	except:
		return
