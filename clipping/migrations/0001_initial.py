# Generated by Django 3.1.6 on 2021-04-09 13:04

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Clipping',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=datetime.date.today)),
                ('vehicle', models.CharField(blank=True, max_length=100, null=True)),
                ('author', models.CharField(blank=True, max_length=100, null=True)),
                ('title', models.CharField(blank=True, max_length=200, null=True)),
                ('category', models.CharField(max_length=100, null=True)),
                ('url', models.URLField(unique=True)),
                ('published', models.BooleanField(blank=True, default=False)),
                ('added_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ClippingRelation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField(db_index=True)),
                ('clipping', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='clipping.clipping')),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
            options={
                'unique_together': {('content_type', 'object_id', 'clipping')},
            },
        ),
    ]
