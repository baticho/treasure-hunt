from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

from rest_framework.authtoken import views as auth_token_views

# from treasurehunt.api_router import urlpatterns as api_patterns

urlpatterns = [
                  path('api/', include('treasurehunt.games.urls', namespace='games')),
                  path('admin/', admin.site.urls),
                  path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
                  path('api-token-auth/', auth_token_views.obtain_auth_token),
                  path('api/accounts/', include('treasurehunt.accounts.urls')),
                  # re_path(r'^(?!api/).*', TemplateView.as_view(template_name='index.html'), name='home'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
