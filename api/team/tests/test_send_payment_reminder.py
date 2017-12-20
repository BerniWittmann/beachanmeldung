import json

from django.conf import settings
from django.core import mail
from django.core.urlresolvers import reverse
from django.test import TestCase
from django.utils.translation import activate
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings

from api.accounts.models import MyUser
from api.enums import TeamStateTypes
from api.team.models import Team
from api.tournaments.models import Tournament

activate('en-us')
settings.SEND_EMAIL_ASYNC = False

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

token_regex = '^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$'


class Teams(TestCase):
    token = None
    tournament = None
    team = None
    user = None

    def setUp(self):
        self.user = MyUser.objects.create_user(email='test@byom.de',
                                               first_name='Test',
                                               last_name='User',
                                               phone='+49192481024')
        self.user.set_password('test123')
        self.user.is_verified = True
        self.user.is_staff = True
        self.user.save()
        payload = jwt_payload_handler(self.user)
        self.token = jwt_encode_handler(payload)

        self.tournament = Tournament.objects \
            .create(name='Test Turnier',
                    gender='mixed',
                    start_date='2017-01-01',
                    end_date='2017-01-02',
                    deadline_signup='2017-01-01T00:00:00Z',
                    deadline_edit='2017-01-01T00:00:00Z',
                    advertisement_url='http://www.google.de',
                    contact_email='test@byom.de',
                    starting_fee=60.0,
                    number_of_places=12
                    )
        self.team = Team.objects.create(
            name='TSV Ismaning',
            beachname='THC Eh Drin!',
            state=TeamStateTypes.signed_up,
            tournament=self.tournament,
            trainer=self.user,
        )
        self.not_signed_up_team = Team.objects.create(
            name='Not Signed',
            beachname='Up!',
            state=TeamStateTypes.waiting,
            tournament=self.tournament,
            trainer=self.user,
        )
        self.already_paid_team = Team.objects.create(
            name='Already',
            beachname='Paid',
            state=TeamStateTypes.signed_up,
            tournament=self.tournament,
            trainer=self.user,
            paid=True
        )
        self.other_team = Team.objects.create(
            name='Other',
            beachname='Team',
            state=TeamStateTypes.signed_up,
            tournament=self.tournament,
            trainer=self.user,
            paid=False
        )

    def test_team_send_payment_reminder(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'), {'teams': [self.team.id]})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Payment Reminder')

    def test_team_send_payment_reminder_multiple(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'), {'teams': [self.team.id, self.other_team.id]})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].subject, 'Payment Reminder')

    def test_team_send_payment_reminder_not_signed_up(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'), {'teams': [self.not_signed_up_team.id]})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(mail.outbox), 0)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data[str(self.not_signed_up_team.id)], ["Team not signed up"])

    def test_team_send_payment_reminder_not_signed_up_multiple(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'),
                               {'teams': [self.not_signed_up_team.id, self.team.id]})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data[str(self.not_signed_up_team.id)], ["Team not signed up"])

    def test_team_send_payment_reminder_already_paid(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'), {'teams': [self.already_paid_team.id]})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(mail.outbox), 0)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data[str(self.already_paid_team.id)], ["Team has already paid"])

    def test_team_send_payment_reminder_already_paid_multiple(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'),
                               {'teams': [self.already_paid_team.id, self.team.id]})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data[str(self.already_paid_team.id)], ["Team has already paid"])

    def test_team_send_payment_reminder_multiple_errors_and_valid_ones(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'),
                               {'teams': [self.not_signed_up_team.id, self.already_paid_team.id,
                                          self.other_team.id, self.team.id]})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 2)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data[str(self.already_paid_team.id)], ["Team has already paid"])
        self.assertEqual(data[str(self.not_signed_up_team.id)], ["Team not signed up"])

    def test_team_send_payment_reminder_multiple_errors(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'),
                               {'teams': [self.not_signed_up_team.id, self.already_paid_team.id]})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(mail.outbox), 0)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data[str(self.already_paid_team.id)], ["Team has already paid"])
        self.assertEqual(data[str(self.not_signed_up_team.id)], ["Team not signed up"])

    def test_team_send_payment_reminder_unauthorized(self):
        client = APIClient()
        response = client.post(reverse('v1:team-send-payment-reminder'), {'teams': [self.team.id]})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(len(mail.outbox), 0)

    def test_team_send_payment_reminder_wrong_method(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:team-send-payment-reminder'))
        self.assertEqual(response.status_code, 405)
        self.assertEqual(len(mail.outbox), 0)

    def test_team_send_payment_reminder_team_not_found(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'), {'teams': [9999999]})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(mail.outbox), 0)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data[str(9999999)], ["Team not found"])

    def test_team_send_payment_reminder_empty_body(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'), {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(mail.outbox), 0)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'], "You did not provide Team IDs.")

    def test_team_send_payment_reminder_empty_list(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'), {'teams': []})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(mail.outbox), 0)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'], "You did not provide Team IDs.")

    def test_team_send_payment_reminder_multiple_team_not_found(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-send-payment-reminder'), {'teams': [9999999, self.team.id]})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data[str(9999999)], ["Team not found"])

    def test_team_send_payment_reminder_not_admin_user(self):
        user = MyUser.objects.create(email='test2@byom.de',
                                     first_name='ANother',
                                     last_name='User',
                                     phone='+49192481024')
        user.set_password('test123')
        user.is_verified = True
        user.is_staff = False
        user.save()
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        response = client.post(reverse('v1:team-send-payment-reminder'), {'teams': [self.team.id]})
        self.assertEqual(response.status_code, 403)
        self.assertEqual(len(mail.outbox), 0)
