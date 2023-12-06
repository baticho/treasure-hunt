import os

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand

from treasurehunt.accounts.models import Profile
from treasurehunt.games.models import TreasureHunt

User = get_user_model()


class Command(BaseCommand):
    help = 'Populates the database with predefined data'

    def handle(self, *args, **kwargs):
        user = User.objects.create(
            username="InitialUser",
            email="initial_user@treasure.hunt",
            password=make_password(os.getenv('DB_PASSWORD', 'new_pass')),
        )
        profile = Profile.objects.create(
            first_name="Initial",
            last_name="User",
            user=user,
        )

        data_to_add = [
            {
                'name': 'Lost City Adventure',
                'picture': 'https://aws.visitbelfast.com/app/uploads/2019/12/05084156/Lost-City-Adventure-Golf-3-1920x1080.jpg',
                'start_location': 'Town Hall Square',
                'end_location': 'Abandoned Subway Station',
                'description': 'Navigate through city landmarks and solve clues to uncover urban mysteries.',
                'user': user
            },
            {
                'name': "Pirate's Cove Journey",
                'picture': 'https://media.tacdn.com/media/attractions-splice-spp-360x240/06/73/15/0f.jpg',
                'start_location': 'Enchanted Forest Entrance',
                'end_location': "Wizard's Tower Summit",
                'description': 'Discover magical artifacts and mystical wonders in a realm of enchantment.',
                'user': user
            },
            {
                'name': "Wizard's Quest",
                'picture': 'https://www.spring-brook.com/wp-content/uploads/2018/05/earthrealm.jpg',
                'start_location': 'Coastal Harbor',
                'end_location': 'X Marks the Spot Island',
                'description': 'Search for buried treasures and hidden secrets left behind by legendary pirates.',
                'user': user
            },
            {
                'name': 'Urban Adventure Challenge',
                'picture': 'https://www.sevlievo.bg/images/obstina_sevlievo.jpg',
                'start_location': 'Museum of Antiquities',
                'end_location': 'Mysterious Cave in the Forest',
                'description': 'Embark on an epic quest to uncover the ancient ruins of a forgotten civilization.',
                'user': user
            },
        ]

        for data in data_to_add:
            obj = TreasureHunt(**data)
            obj.save()

        self.stdout.write(self.style.SUCCESS('Database populated successfully'))
