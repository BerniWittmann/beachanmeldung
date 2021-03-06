# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-27 12:15
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('team', '0003_auto_20171113_1045'),
        ('players', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='name',
            new_name='last_name',
        ),
        migrations.AlterUniqueTogether(
            name='player',
            unique_together=set([('team', 'last_name', 'first_name')]),
        ),
    ]
