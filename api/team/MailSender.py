from api.MailSender import MailSender
from api.accounts.models import MyUser


class TeamMailSender(MailSender):
    team = None
    prefix = 'teamemail'

    def __init__(self, team=None, request=None):
        MailSender.__init__(self, request)
        if team is None:
            raise Exception("Team or Request not given")

        self.team = team

    def send_mail_to_trainer(self, prefix):
        email = [self.team.trainer.email]
        data = {
            'team': self.team,
        }
        self.send_email(prefix, email, data)

    def send_signup_preliminary_confirmation(self):
        self.send_mail_to_trainer('signup_preliminary_confirmation')

    def send_signup_confirmation(self):
        self.send_mail_to_trainer('signup_confirmation')

    def send_waitlist_confirmation(self):
        self.send_mail_to_trainer('waitlist_confirmation')

    def send_signoff_confirmation(self):
        self.send_mail_to_trainer('signoff_confirmation')

    def send_payment_confirmation(self):
        self.send_mail_to_trainer('payment_confirmation')

    def send_payment_reminder(self):
        self.send_mail_to_trainer('payment_reminder')

    def send_player_list_reminder(self):
        self.send_mail_to_trainer('player_list_reminder')

    def send_needs_approval_notification(self):
        emails = [x.email for x in MyUser.objects.filter(receive_notifications=True)]
        data = {
            'team': self.team
        }
        self.send_email('needs_approval_notification', emails, data)
