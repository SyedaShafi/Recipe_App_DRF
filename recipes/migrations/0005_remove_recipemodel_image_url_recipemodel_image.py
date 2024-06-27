# Generated by Django 5.0.3 on 2024-05-23 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0004_rename_image_recipemodel_image_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipemodel',
            name='image_url',
        ),
        migrations.AddField(
            model_name='recipemodel',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='recipes/images/'),
        ),
    ]
