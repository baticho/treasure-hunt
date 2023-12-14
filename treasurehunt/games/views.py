from rest_framework import viewsets, status, views
from rest_framework.response import Response

from .models import TreasureHunt, Clue, Hint, Game, Score
from .serializers import TreasureHuntSerializer, ClueSerializer, HintSerializer, GameDetailSerializer, ScoreSerializer, \
    GameCreateSerializer
from ..common.permissions import AllowAnyGET


class TreasureHuntViewSet(viewsets.ModelViewSet):
    queryset = TreasureHunt.objects.all()
    serializer_class = TreasureHuntSerializer
    permission_classes = [AllowAnyGET]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)


class ClueViewSet(viewsets.ModelViewSet):
    queryset = Clue.objects.all()
    serializer_class = ClueSerializer


class HintViewSet(viewsets.ModelViewSet):
    queryset = Hint.objects.all()
    serializer_class = HintSerializer


class GameViewSet(viewsets.ModelViewSet):

    def get_serializer_class(self):
        if self.action == 'create':
            return GameCreateSerializer
        return GameDetailSerializer

    def get_queryset(self):
        current_user = self.request.user

        unfinished_games = Game.objects.filter(user=current_user, is_completed=False)
        return unfinished_games

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
