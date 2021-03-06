# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-12-11 11:49
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('team', '0003_auto_20171113_1045'),
    ]

    operations = [
        migrations.AlterField(
            model_name='team',
            name='beachname',
            field=models.CharField(blank=True, help_text='creative team name', max_length=400, null=True, verbose_name='beachname'),
        ),
        migrations.AlterField(
            model_name='team',
            name='date_signup',
            field=models.DateTimeField(default=django.utils.timezone.now, help_text='date of initial signup', verbose_name='Date Signup'),
        ),
        migrations.AlterField(
            model_name='team',
            name='name',
            field=models.CharField(help_text='Usually the club name', max_length=200, verbose_name='Name'),
        ),
        migrations.AlterField(
            model_name='team',
            name='paid',
            field=models.BooleanField(default=False, help_text='has the team already paid?', verbose_name='Paid State'),
        ),
        migrations.AlterField(
            model_name='team',
            name='state',
            field=models.CharField(choices=[(b'waiting', b'waiting'), ('signed up', 'signed up'), ('needs approval', 'needs approval'), (b'denied', b'denied')], default='needs approval', help_text='current state of the team', max_length=50, verbose_name='Team State'),
        ),
        migrations.AlterField(
            model_name='team',
            name='tournament',
            field=models.ForeignKey(help_text='tournament of the team', on_delete=django.db.models.deletion.CASCADE, related_name='teams', to='tournaments.Tournament', verbose_name='Team tournament'),
        ),
        migrations.AlterField(
            model_name='team',
            name='trainer',
            field=models.ForeignKey(help_text='User account who is responsible for the team', on_delete=django.db.models.deletion.CASCADE, related_name='teams', to=settings.AUTH_USER_MODEL, verbose_name='Trainer'),
        ),
    ]
