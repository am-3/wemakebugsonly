# Generated by Django 5.2 on 2025-04-22 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_alter_event_end_time_alter_event_start_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='registration_deadline',
            field=models.TextField(blank=True, null=True),
        ),
    ]
