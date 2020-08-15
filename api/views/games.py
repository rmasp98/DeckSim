"""API Views for Games"""

from rest_framework import viewsets
from rest_framework.response import Response

# from rest_framework import authentication, permissions

from ..models import get_games


class GamesViewSet(viewsets.ViewSet):

    # authentication_classes = [authentication.TokenAuthentication]
    # permission_classes = [permissions.IsAdminUser]

    def list(self, request, format=None):
        """Get full list of games"""
        return Response({"games": get_games()})
