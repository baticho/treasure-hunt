from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class GamesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'treasurehunt.games'
    verbose_name = _("Games")

    def ready(self):
        try:
            import treasurehunt.games.signals
        except ImportError:
            pass


