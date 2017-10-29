from django.test import TestCase
from rest_framework.test import APIClient
from .models import TeamMember
from django.core.urlresolvers import reverse
import json
import tempfile


class TeamMemberTestCase(TestCase):
    member = None

    def setUp(self):
        self.member = TeamMember.objects.create(email='test@byom.de',
                                                name='My Name',
                                                role='CTO',
                                                description='Test Description')
        TeamMember.objects.create(email='other@byom.de',
                                  name='Other Member',
                                  role='CEO',
                                  description='Another Member')

    def test_get_member_list(self):
        client = APIClient()
        response = client.get(reverse('v1:team-member-list'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        member_data_first = data['results'][0]
        self.assertEqual(member_data_first['id'], 1)
        self.assertEqual(member_data_first['email'], 'test@byom.de'),
        self.assertEqual(member_data_first['name'], 'My Name'),
        self.assertEqual(member_data_first['role'], 'CTO'),
        self.assertEqual(member_data_first['description'], 'Test Description')
        member_data_second = data['results'][1]
        self.assertEqual(member_data_second['id'], 2)
        self.assertEqual(member_data_second['email'], 'other@byom.de'),
        self.assertEqual(member_data_second['name'], 'Other Member'),
        self.assertEqual(member_data_second['role'], 'CEO'),
        self.assertEqual(member_data_second['description'], 'Another Member')

    def test_get_member_single(self):
        client = APIClient()
        response = client.get(reverse('v1:team-member-detail',
                                      kwargs={'pk': self.member.id}))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['id'], self.member.id)
        self.assertEqual(data['email'], 'test@byom.de'),
        self.assertEqual(data['name'], 'My Name'),
        self.assertEqual(data['role'], 'CTO'),
        self.assertEqual(data['description'], 'Test Description')

    def test_image_thumbnail_generation(self):
        self.member.image = tempfile.NamedTemporaryFile(suffix='.jpg').name
        self.member.save()
        self.assertIsNotNone(self.member.image)
        self.assertIsNotNone(self.member.image.thumbnail)

    def test_image_thumbnail_getter(self):
        self.assertIsNone(self.member.thumbnail())
        self.member.image = tempfile.NamedTemporaryFile(suffix='.jpg').name
        self.member.save()
        self.assertIsNotNone(self.member.thumbnail())

    def test_image_tag_getter(self):
        self.assertEqual(self.member.image_tag(), '<p>No Image</p>')
        self.member.image = tempfile.NamedTemporaryFile(suffix='.jpg').name
        self.member.save()
        self.assertNotEqual(self.member.image_tag(), '<p>No Image</p>')
