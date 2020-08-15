from django.db import models
from django.core.validators import validate_comma_separated_integer_list

# Create your models here.

# Models
# Deck hold deck name, games reference and hand reference and image for
#    back of deck? and description
# Stack hold stack type, card index list and deck reference
# Card holds name, number in deck, maximum, image, description, deck
#    reference and card_id (unqieu within deck


# Helpers


def get_games():
    return [
        {
            "name": game.name,
            "sessions": get_game_sessions(game),
            "image": game.get_image_url(),
        }
        for game in Game.objects.all()
    ]


def create_session(game_name, session_name):
    if not Game.objects.filter(name=game_name).exists():
        raise ValueError("Game does not exist")

    game = Game.objects.get(name=game_name)
    if Session.objects.filter(name=session_name, game=game).exists():
        raise ValueError("Session already exists")

    new_session = Session(name=session_name, game=game)
    new_session.save()
    return new_session.id


def get_session_data(session_id):
    if not Session.objects.filter(id=session_id).exists():
        raise ValueError("Session does not exist")

    session = Session.objects.get(id=session_id)
    game = Game.objects.get(name=session.game)

    return {
        "game": game.name,
        "session": session.name,
        "decks": get_session_decks(session),
    }


def get_game_sessions(game):
    return {session.name: session.id for session in Session.objects.filter(game=game)}


def get_session_decks(session):
    return {deck.name: deck.id for deck in Deck.objects.filter(session=session)}


# Models


class Game(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="images/games/")

    def get_image_url(self):
        return self.image.url

    def __str__(self):
        return self.name


class Session(models.Model):
    name = models.CharField(max_length=100)
    game = models.ForeignKey(Game, models.CASCADE)

    def __str__(self):
        return self.name + " (" + self.game.name + ")"


class Deck(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="images/decks/")
    session = models.ForeignKey(Session, models.CASCADE)

    def __str__(self):
        return self.name + " (" + self.session.name + ")"


class Stack(models.Model):
    class StackType(models.TextChoices):
        MAIN = "main"
        DISCARD = "discard"
        REMOVED = "removed"

    stack_type = models.CharField(max_length=7, choices=StackType.choices)
    cards = models.CharField(
        validators=[validate_comma_separated_integer_list],
        max_length=500,
        blank=True,
        null=True,
        default="",
    )
    deck = models.ForeignKey(Deck, models.CASCADE)

    def __str__(self):
        return self.stack_type + " (" + self.deck.name + ")"


class Card(models.Model):
    name = models.CharField(max_length=100)
    number = models.IntegerField()
    maximum = models.IntegerField()
    image = models.ImageField(upload_to="images/cards")
    card_id = models.IntegerField()
    deck = models.ForeignKey(Deck, models.CASCADE)

    def __str__(self):
        return (
            self.name
            + " ("
            + self.number
            + "/"
            + self.maximum
            + ") - "
            + self.deck.name
            + "["
            + self.card_id
            + "]"
        )
