# Generated by Django 4.1.2 on 2024-01-14 10:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0010_usedhints'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UsedHints',
            new_name='UsedHint',
        ),
    ]
