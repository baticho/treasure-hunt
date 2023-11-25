from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TreasureHuntViewSet, ClueViewSet, HintViewSet, GameViewSet, ScoreView

router = DefaultRouter()
router.register(r'treasure-hunts', TreasureHuntViewSet, basename="treasure-hunts")
router.register(r'clues', ClueViewSet, basename="clues")
router.register(r'hints', HintViewSet, basename="hints")
router.register(r'games', GameViewSet, basename="games")

app_name = 'games'

urlpatterns = [
    path('', include(router.urls), name="api"),
    path('scores/', ScoreView.as_view(), name="scores"),
]
