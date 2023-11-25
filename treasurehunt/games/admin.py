from django.contrib import admin
from .models import TreasureHunt, Clue, Hint, Game, Score

admin.site.register(TreasureHunt)
admin.site.register(Clue)
admin.site.register(Hint)
admin.site.register(Game)
admin.site.register(Score)
