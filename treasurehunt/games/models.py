from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

User = get_user_model()


class TreasureHunt(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    picture = models.URLField()
    start_location = models.CharField(max_length=40)
    end_location = models.CharField(max_length=40)
    created_at = models.DateTimeField(auto_now_add=True)


class Clue(models.Model):
    treasure_hunt = models.ForeignKey(TreasureHunt, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    picture = models.URLField(null=True, blank=True)
    order = models.PositiveIntegerField()


class Hint(models.Model):
    clue = models.ForeignKey(Clue, on_delete=models.CASCADE)
    hint = models.CharField(max_length=255)
    bonus_minutes = models.IntegerField(default=0)


class Game(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    treasure_hunt = models.ForeignKey(TreasureHunt, on_delete=models.DO_NOTHING)
    start_time = models.DateTimeField(auto_now=True)
    end_time = models.DateTimeField(null=True, blank=True)
    canceled = models.BooleanField(default=False)
    bonus_minutes = models.IntegerField(default=0)


class Score(models.Model):
    SCORE_MAX = 5
    SCORE_MAX_MESSAGE = 'Score cannot exceed 5.'
    SCORE_MIN = 1
    SCORE_MIN_MESSAGE = 'Score cannot be less than 1.'
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    treasure_hunt = models.ForeignKey(TreasureHunt, on_delete=models.CASCADE)
    score = models.PositiveIntegerField(
        validators=[
            MaxValueValidator(SCORE_MAX, message=SCORE_MAX_MESSAGE),
            MinValueValidator(SCORE_MIN, message=SCORE_MIN_MESSAGE)
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save()
