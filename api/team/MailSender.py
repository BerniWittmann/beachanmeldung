from django.conf import settings
from django.core.mail.message import EmailMultiAlternatives
from django.template.loader import render_to_string

from api.accounts.models import MyUser


class MailSender:
    team = None
    request = None

    def __init__(self, team=None, request=None):
        if team is None or request is None:
            raise Exception("Team or Request not given")

        self.team = team
        self.request = request

    def send_multi_format_email(self, template_prefix, template_ctxt, target_email):
        subject_file = 'teamemail/%s_subject.txt' % template_prefix
        txt_file = 'teamemail/%s.txt' % template_prefix
        html_file = 'teamemail/%s.html' % template_prefix

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

    def send_email(self, prefix, email, data):
        ctxt = dict(email=email, host='https://' + self.request.get_host(), **data)
        self.send_multi_format_email(prefix, ctxt, email)

    def send_mail_to_trainer(self, prefix):
        email = [self.team.trainer.email]
        data = {
            'team': self.team,
        }
        self.send_email(prefix, email, data)

    def send_signup_preliminary_confirmation(self):
        self.send_mail_to_trainer('signup_preliminary_confirmation')

    def send_needs_approval_notification(self):
        emails = [x.email for x in MyUser.objects.filter(receive_notifications=True)]
        data = {
            'team': self.team
        }
        self.send_email('needs_approval_notification', emails, data)

    def send_signup_confirmation(self):
        self.send_mail_to_trainer('signup_confirmation')

    def send_waitlist_confirmation(self):
        self.send_mail_to_trainer('waitlist_confirmation')

    def send_signoff_confirmation(self):
        self.send_mail_to_trainer('signoff_confirmation')

    def send_payment_confirmation(self):
        self.send_mail_to_trainer('payment_confirmation')
