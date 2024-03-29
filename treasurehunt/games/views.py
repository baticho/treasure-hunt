from django.db.models import Max, Avg, Prefetch
from django.utils import timezone
from rest_framework import viewsets, status, views
from rest_framework.response import Response

from .models import TreasureHunt, Clue, Hint, Game, Score, UsedHint
from .serializers import TreasureHuntSerializer, ClueSerializer, HintSerializer, GameDetailSerializer, ScoreSerializer, \
    GameCreateSerializer, UsedHintSerializer
from ..common.permissions import AllowAnyGET


class TreasureHuntViewSet(viewsets.ModelViewSet):
    serializer_class = TreasureHuntSerializer
    permission_classes = [AllowAnyGET]

    def get_queryset(self):
        queryset = (TreasureHunt.objects
                    .prefetch_related('score_set')
                    .select_related('user')
                    .all())

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)


class ClueViewSet(viewsets.ModelViewSet):
    queryset = Clue.objects.all()
    serializer_class = ClueSerializer


class HintViewSet(viewsets.ModelViewSet):
    queryset = Hint.objects.all()
    serializer_class = HintSerializer


class UsedHintsViewSet(viewsets.ModelViewSet):
    queryset = UsedHint.objects.all()
    serializer_class = UsedHintSerializer

class GameViewSet(viewsets.ModelViewSet):

    def get_serializer_class(self):
        if self.action == 'create':
            return GameCreateSerializer
        return GameDetailSerializer

    def get_queryset(self):
        current_user = self.request.user

        current_game = Game.objects.filter(user=current_user)
        if self.request.method == 'GET':
            current_game = current_game.filter(is_completed=False, is_canceled=False)
            return current_game

        return current_game

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        current_user = self.request.user
        existing_unfinished_games = Game.objects.filter(user=current_user, is_completed=False, is_canceled=False)
        if existing_unfinished_games.exists():
            return Response({"message": "You have an ongoing game."}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        current_clue_index = instance.current_clue_index

        next_clue_index = Clue.objects.filter(treasure_hunt=instance.treasure_hunt , id__gt=current_clue_index).aggregate(Max('id'))['id__max']

        if next_clue_index:
            instance.current_clue_index = next_clue_index
            instance.save()
        else:
            instance.is_completed = True
            instance.end_time = timezone.now()
            instance.save()

        return super().update(request, *args, **kwargs)


class ScoreView(views.APIView):

    def post(self, request):
        user = request.user
        score_value = int(request.data.get('score'))  # Convert score to an integer
        treasure_hunt_id = int(request.data.get('treasure_hunt'))

        # Validate score value
        if not (1 <= score_value <= 5):
            error_message = "Score must be between 1 and 5."
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)

        treasure_hunt = TreasureHunt.objects.filter(id=treasure_hunt_id).first()
        if not treasure_hunt:
            error_message = f"TreasureHunt with ID {treasure_hunt_id} does not exist."
            return Response({'error': error_message}, status=status.HTTP_404_NOT_FOUND)

        score, created = Score.objects.update_or_create(
            user=user,
            treasure_hunt_id=treasure_hunt_id,
            defaults={'score': score_value}
        )

        serializer = ScoreSerializer(score)

        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
