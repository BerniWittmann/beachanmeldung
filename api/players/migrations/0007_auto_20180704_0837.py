# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2018-07-04 06:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('players', '0006_auto_20180529_1455'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='birth_date',
            field=models.DateField(blank=True, help_text='Use the following format: YYYY-MM-DD', null=True, verbose_name='Birth Date'),
        ),
    ]