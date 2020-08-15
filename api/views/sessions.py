"""API Views for Sessions"""

from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from ..models import create_session, get_session_data


class SessionsViewSet(viewsets.ViewSet):
    def create(self, request):
        """create new session for input game"""
        if "game" not in request.data or "session" not in request.data:
            raise ValidationError(
                "Missing parameter. Must contain both game and session parameters"
            )

        game_name = request.data["game"]
        session_name = request.data["session"]
        if session_name == "":
            raise ValidationError("Session name is empty")

        try:
            new_session_id = create_session(game_name, session_name)
            return Response({"session_id": new_session_id})
        except ValueError as e:
            raise ValidationError(e)

    def retrieve(self, request, pk):
        """Retrieve decks and dice of session"""
        try:
            session_data = get_session_data(pk)
            return Response(session_data)
        except ValueError as e:
            raise ValidationError(e)

    def destroy(self, request, pk):
        """Destroy session and all relations"""
        return Response()
