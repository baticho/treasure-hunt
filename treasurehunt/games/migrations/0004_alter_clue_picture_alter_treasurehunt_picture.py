# Generated by Django 4.1.2 on 2023-12-04 06:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0003_alter_score_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clue',
            name='picture',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='treasurehunt',
            name='picture',
            field=models.URLField(default=11),
            preserve_default=False,
        ),
    ]