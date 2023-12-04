from rest_framework import viewsets, status, views
from rest_framework.response import Response

from .models import TreasureHunt, Clue, Hint, Game, Score
from .serializers import TreasureHuntSerializer, ClueSerializer, HintSerializer, GameSerializer, ScoreSerializer
from ..common.permissions import AllowAnyGET


class TreasureHuntViewSet(viewsets.ModelViewSet):
    queryset = TreasureHunt.objects.all()
    serializer_class = TreasureHuntSerializer
    permission_classes = [AllowAnyGET]


class ClueViewSet(viewsets.ModelViewSet):
    queryset = Clue.objects.all()
    serializer_class = ClueSerializer


class HintViewSet(viewsets.ModelViewSet):
    queryset = Hint.objects.all()
    serializer_class = HintSerializer


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


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
