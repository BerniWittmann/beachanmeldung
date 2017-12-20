import threading

from decouple import config
from django.conf import settings
from django.core.mail.message import EmailMultiAlternatives
from django.template.loader import render_to_string


class EmailThread(threading.Thread):
    def __init__(self, subject, body, from_email, recipient_list, fail_silently, html, bcc, reply_to):
        self.subject = subject
        self.body = body
        self.recipient_list = recipient_list
        self.from_email = from_email
        self.fail_silently = fail_silently
        self.html = html
        self.bcc = bcc
        self.reply_to = reply_to
        threading.Thread.__init__(self)

    def run(self):
        msg = EmailMultiAlternatives(self.subject, self.body, self.from_email, self.recipient_list, bcc=self.bcc,
                                     reply_to=[self.reply_to])
        if self.html:
            msg.attach_alternative(self.html, "text/html")
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

        subject = render_to_string(subject_file).strip()
        from_email = settings.DEFAULT_EMAIL_FROM
        to = target_email
        bcc_email = settings.DEFAULT_EMAIL_BCC
        text_content = render_to_string(txt_file, template_ctxt)
        html_content = render_to_string(html_file, template_ctxt)
        reply_to = config('DEFAULT_REPLY_TO', default=None)

        if settings.SEND_EMAIL_ASYNC:
            EmailThread(subject, text_content, from_email, recipient_list=to, fail_silently=False, html=html_content,
                        bcc=[bcc_email], reply_to=reply_to).start()
        else:
            msg = EmailMultiAlternatives(subject, text_content, from_email, to, bcc=[bcc_email], reply_to=[reply_to])
            if html_content:
                msg.attach_alternative(html_content, "text/html")
            msg.send()

    def send_email(self, prefix, email, data):
        ctxt = dict(email=email,
                    host='https://' + self.request.get_host(),
                    iban=config('BANKING_IBAN', default=None),
                    bic=config('BANKING_BIC', default=None),
                    **data)
        self.send_multi_format_email(prefix, ctxt, email)
