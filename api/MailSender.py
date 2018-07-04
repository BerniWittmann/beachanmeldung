import threading

from decouple import config
from django.conf import settings
from django.core.mail.message import EmailMultiAlternatives
from django.template.loader import render_to_string


class EmailThread(threading.Thread):
    def __init__(self, subject, body, from_email, recipient_list, fail_silently, html, reply_to,
                 categories=None, cc=None):
        self.subject = subject
        self.body = body
        self.recipient_list = recipient_list
        self.from_email = from_email
        self.fail_silently = fail_silently
        self.html = html
        self.reply_to = reply_to
        self.categories = categories
        self.cc = cc
        threading.Thread.__init__(self)

    def run(self):
        msg = EmailMultiAlternatives(self.subject, self.body, self.from_email, self.recipient_list,
                                     reply_to=[self.reply_to], cc=self.cc)
        if self.html:
            msg.attach_alternative(self.html, "text/html")
        if self.categories:
            msg.categories = self.categories

        msg.send(self.fail_silently)


class MailSender:
    request = None
    prefix = None

    def __init__(self, request=None):
        if self.prefix is None:
            raise NotImplementedError("No Prefix given")

        if request is None:
            raise Exception("Request not given")

        self.request = request

    def send_multi_format_email(self, template_prefix, template_ctxt, target_email):
        subject_file = '{}/{}_subject.txt'.format(self.prefix, template_prefix)
        txt_file = '{}/{}.txt'.format(self.prefix, template_prefix)
        html_file = '{}/{}.html'.format(self.prefix, template_prefix)

        subject = render_to_string(subject_file, template_ctxt).strip()
        from_email = settings.DEFAULT_EMAIL_FROM
        to = target_email
        text_content = render_to_string(txt_file, template_ctxt)
        html_content = render_to_string(html_file, template_ctxt)
        reply_to = config('DEFAULT_REPLY_TO', default=None)
        cc = None
        if 'team' in template_ctxt.keys():
            sanitized_team_name = template_ctxt.get('team').complete_name \
                .replace(u"\xe4", "ae").replace(u"\xf6", "oe").replace(u"\xfc", "ue").replace(u"\xdf", "ss") \
                .replace(u"\xc4", "Ae").replace(u"\xd6", "Oe").replace(u"\xdc", "Ue")
        else:
            sanitized_team_name = None

        categories = [
            self.prefix,
            template_prefix,
            sanitized_team_name
        ]

        if template_prefix in ['payment_reminder', 'signup_confirmation']:
            cc = [config('TEAM_PAYMENT_CC', default=None)]

        if settings.DEBUG:
            categories.append('DEBUG')

        if settings.SEND_EMAIL_ASYNC:
            EmailThread(subject, text_content, from_email, recipient_list=to, fail_silently=False, html=html_content,
                        reply_to=reply_to, categories=categories, cc=cc).start()
        else:
            msg = EmailMultiAlternatives(subject, text_content, from_email, to, reply_to=[reply_to], cc=cc)
            if html_content:
                msg.attach_alternative(html_content, "text/html")
            if categories:
                msg.categories = categories
            msg.send()

    def send_email(self, prefix, email, data):
        host = 'http://' + self.request.get_host()
        if self.request.is_secure():
            host = 'https://' + self.request.get_host()

        ctxt = dict(email=email,
                    host=host,
                    iban=config('BANKING_IBAN', default=None),
                    bic=config('BANKING_BIC', default=None),
                    receiver_name=config('BANKING_NAME', default=None),
                    **data)
        self.send_multi_format_email(prefix, ctxt, email)
