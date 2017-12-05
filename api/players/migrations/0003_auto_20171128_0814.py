# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-28 07:14
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('team', '0003_auto_20171113_1045'),
        ('players', '0002_auto_20171127_1315'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='year_of_birth',
            field=models.PositiveIntegerField(help_text='Use the following format: YYYY', validators=[django.core.validators.MinValueValidator(1900), django.core.validators.MaxValueValidator(2017)]),
        ),
        migrations.AlterUniqueTogether(
            name='player',
            unique_together=set([('team', 'number'), ('team', 'last_name', 'first_name')]),
        ),
    ]