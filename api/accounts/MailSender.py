from django.conf import settings
from django.core.mail.message import EmailMultiAlternatives
from django.template.loader import render_to_string


class MailSender:
    user = None
    request = None

    def __init__(self, user=None, request=None):
        if user is None or request is None:
            raise Exception("User or Request not given")

        self.user = user
        self.request = request

    def send_multi_format_email(self, template_prefix, template_ctxt, target_email):
        subject_file = 'authemail/%s_subject.txt' % template_prefix
        txt_file = 'authemail/%s.txt' % template_prefix
        html_file = 'authemail/%s.html' % template_prefix

        subject = render_to_string(subject_file).strip()
        from_email = settings.DEFAULT_EMAIL_FROM
        to = target_email
        bcc_email = settings.DEFAULT_EMAIL_BCC
        text_content = render_to_string(txt_file, template_ctxt)
        html_content = render_to_string(html_file, template_ctxt)
        msg = EmailMultiAlternatives(subject, text_content, from_email, to,
                                     bcc=[bcc_email])
        msg.attach_alternative(html_content, 'text/html')
        msg.send()

    def send_email(self, prefix, code):
        ctxt = {
            'email': self.user.email,
            'host': 'https://' + self.request.get_host(),
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'code': code
        }
        self.send_multi_format_email(prefix, ctxt, target_email=[self.user.email])

    def send_signup_code_email(self, code):
        self.send_email('signup_email', code)

    def send_password_reset_code_email(self, code):
        self.send_email('password_reset_email', code)
