# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-08 08:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0005_tournament_start_signup'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament',
            name='number_of_places',
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
    ]
