"""Tests for GameViewSet"""
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient

from .games import GamesViewSet
from ..models import Game, Session


# tests
# Error returned if session already exists
# returns id of created


class GameViewTest(APITestCase):
    client = APIClient()

    def setUp(self):
        game1 = Game.objects.create(name="Test 1", image="Image 1")
        game2 = Game.objects.create(name="Test 2", image="Image 2")
        Session.objects.create(name="First", game=game1)
        Session.objects.create(name="Second", game=game1)
        Session.objects.create(name="First", game=game2)

    def test_list_returns_correct_format(self):
        response = self.client.get(reverse("games-list"))
        self.assertDictEqual(
            response.data,
            {
                "games": [
                    {
                        "name": "Test 1",
                        "sessions": {"First": 1, "Second": 2},
                        "image": "Image%201",
                    },
                    {"name": "Test 2", "sessions": {"First": 3}, "image": "Image%202",},
                ]
            },
        )
