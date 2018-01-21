from api.MailSender import MailSender


class AccountMailSender(MailSender):
    user = None
    prefix = 'authemail'

    def __init__(self, user=None, request=None):
        super().__init__(request)
        if user is None:
            raise Exception("User not given")

        self.user = user

    def send_code_email(self, prefix, code):
        ctxt = {
            'email': self.user.email,
            'host': 'http://' + self.request.get_host(),
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'code': code
        }
        self.send_multi_format_email(prefix, ctxt, target_email=[self.user.email])

    def send_signup_code_email(self, code):
        self.send_code_email('signup_email', code)

    def send_password_reset_code_email(self, code):
        self.send_code_email('password_reset_email', code)
