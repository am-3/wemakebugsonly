# Generated by Django 5.2 on 2025-04-19 18:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
        migrations.AddField(
            model_name='user',
            name='roll_no',
            field=models.IntegerField(null=True),
        ),
    ]
