from django.contrib.auth.models import AnonymousUser
from django.db.models import Avg
from rest_framework import serializers
from .models import TreasureHunt, Clue, Hint, Game, Score


class TreasureHuntSerializer(serializers.ModelSerializer):
    score = serializers.SerializerMethodField()
    creator = serializers.SerializerMethodField()

    class Meta:
        model = TreasureHunt
        fields = '__all__'
        read_only_fields = ('user', 'end_location')

    def get_score(self, obj):
        logged_in_user = self.context['request'].user if 'request' in self.context else None
        if not isinstance(logged_in_user, AnonymousUser):
            logged_in_user_score = obj.score_set.filter(user=logged_in_user)
            if logged_in_user_score:
                return logged_in_user_score.first().score
            return 0

        average_score = obj.score_set.aggregate(Avg('score'))['score__avg']
        return average_score if average_score else 0

    def get_creator(self, obj):
        return obj.user.username if obj.user.username else "No Creator"


class ClueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clue
        fields = '__all__'


class HintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hint
        fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'
