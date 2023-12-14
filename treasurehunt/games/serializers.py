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


class GameCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'


class GameDetailSerializer(serializers.ModelSerializer):
    current_clue = serializers.SerializerMethodField()
    treasure_hunt_name = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = ('treasure_hunt_name', 'start_time', 'bonus_minutes', 'current_clue',)

    def get_treasure_hunt_name(self, obj):
        return obj.treasure_hunt.name if obj.treasure_hunt else None

    def get_current_clue(self, obj):
        clue = Clue.objects.filter(pk=obj.current_clue_index).first()
        clue_data = {'title': clue.title, 'picture': clue.picture}
        return clue_data if clue else None


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'
