"""Tests for SeesionsViewSet"""

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .sessions import SessionsViewSet
from ..models import Game, Session, Deck


class SessionViewTest(APITestCase):
    def setUp(self):
        game1 = Game.objects.create(name="Test 1", image="Image 1")
        Game.objects.create(name="Test 2", image="Image 2")
        session1 = Session.objects.create(name="First", game=game1)
        Session.objects.create(name="Second", game=game1)
        Deck.objects.create(name="deck 1", image="image 3", session=session1)
        Deck.objects.create(name="deck 2", image="image 4", session=session1)

    def test_create_returns_error_if_missing_parameters(self):
        response = self.client.post(reverse("sessions-list"))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data[0],
            "Missing parameter. Must contain both game and session parameters",
        )

    def test_create_returns_error_if_game_does_not_exist(self):
        response = self.client.post(
            reverse("sessions-list"),
            {"game": "Not exist", "session": "test"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data[0], "Game does not exist")

    def test_create_returns_error_if_session_already_exists(self):
        response = self.client.post(
            reverse("sessions-list"),
            {"game": "Test 1", "session": "First"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data[0], "Session already exists")

    def test_create_returns_error_if_session_is_empty(self):
        response = self.client.post(
            reverse("sessions-list"), {"game": "Test 1", "session": ""}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data[0], "Session name is empty")

    def test_create_returns_id_of_new_session(self):
        response = self.client.post(
            reverse("sessions-list"),
            {"game": "Test 1", "session": "New"},
            format="json",
        )
        expected_id = Session.objects.get(name="New").id
        self.assertEqual(response.data["session_id"], expected_id)

    def test_retrieve_returns_error_if_session_not_exist(self):
        response = self.client.get(
            reverse("sessions-detail", kwargs={"pk": 99}), format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data[0], "Session does not exist")

    def test_retrieve_returns_correct_data(self):
        response = self.client.get(
            reverse("sessions-detail", kwargs={"pk": 1}), format="json"
        )
        self.assertDictEqual(
            response.data,
            {"game": "Test 1", "session": "First", "decks": {"deck 1": 1, "deck 2": 2}},
        )
