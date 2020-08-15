from django.contrib import admin

from .models import Game, Session, Deck, Stack, Card

# Register your models here.
admin.site.register(Game)
admin.site.register(Session)
admin.site.register(Deck)
admin.site.register(Stack)
admin.site.register(Card)
