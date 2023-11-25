from django.contrib import admin

from treasurehunt.accounts.models import TreasureHunterUser, Profile


@admin.register(TreasureHunterUser)
class RestaurantUserAdmin(admin.ModelAdmin):
    pass


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    pass
