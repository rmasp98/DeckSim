from django.urls import include, path

from rest_framework import routers

from rest_framework_simplejwt import views as jwt_views

from .views import games, sessions

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"games", games.GamesViewSet, basename="games")
router.register(r"sessions", sessions.SessionsViewSet, basename="sessions")

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
    # path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("token", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
]
