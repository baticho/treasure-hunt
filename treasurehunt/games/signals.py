from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Game, Clue


@receiver(post_save, sender=Game)
def set_initial_clue_index(sender, instance, created, **kwargs):
    if created:
        first_clue = Clue.objects.filter(treasure_hunt=instance.treasure_hunt).order_by('pk').order_by('order').first()
        if first_clue:
            instance.current_clue_index = first_clue.pk
            instance.save()
