# Generated by Django 4.1.2 on 2023-12-13 21:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0006_remove_clue_description_clue_answer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clue',
            name='order',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]