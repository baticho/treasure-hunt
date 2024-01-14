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

    def __str__(self):
        return self.name


class Clue(models.Model):
    treasure_hunt = models.ForeignKey(TreasureHunt, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
    picture = models.URLField(null=True, blank=True)
    order = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.title


class Hint(models.Model):
    clue = models.ForeignKey(Clue, on_delete=models.CASCADE)
    hint = models.CharField(max_length=255)
    bonus_minutes = models.IntegerField(default=0)

    def __str__(self):
        return self.hint


class Game(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    treasure_hunt = models.ForeignKey(TreasureHunt, on_delete=models.DO_NOTHING)
    current_clue_index = models.PositiveIntegerField(default=0)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    is_canceled = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    bonus_minutes = models.IntegerField(default=0)

    @property
    def current_clue(self):
        try:
            clue = Clue.objects.get(treasure_hunt=self.treasure_hunt, order=self.current_clue_index)
            return clue
        except Clue.DoesNotExist:
            return None

    def __str__(self):
        return f'{str(self.user)} - {self.treasure_hunt.name}'


class UsedHint(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    hint = models.ForeignKey(Hint, on_delete=models.CASCADE)


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
