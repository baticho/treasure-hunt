from django import forms
from django.contrib.auth import forms as auth_forms, get_user_model
from django.contrib.auth.models import Group

from treasurehunt.accounts.models import Profile


class CreateProfileForm(auth_forms.UserCreationForm):
    first_name = forms.CharField(
        max_length=Profile.FIRST_NAME_MAX_LENGTH,
    )
    last_name = forms.CharField(
        max_length=Profile.LAST_NAME_MAX_LENGTH,
    )
    picture = forms.URLField()
    description = forms.CharField(
        widget=forms.Textarea,
    )

    def save(self, commit=True):
        user = super().save(commit=commit)

        profile = Profile(
            first_name=self.cleaned_data['first_name'],
            last_name=self.cleaned_data['last_name'],
            picture=self.cleaned_data['picture'],
            description=self.cleaned_data['description'],
            user=user,
        )
        customer = Group.objects.get(name='Customers')
        user.groups.add(customer)

        if commit:
            profile.save()
        return user

    class Meta:
        model = get_user_model()
        fields = ('email', 'password1', 'password2', 'first_name', 'last_name', 'picture', 'description')
        widgets = {
            'first_name': forms.TextInput(
                attrs={
                    'placeholder': 'Enter first name',
                }
            ),
            'last_name': forms.TextInput(
                attrs={
                    'placeholder': 'Enter last name',
                }
            ),
            'picture': forms.TextInput(
                attrs={
                    'placeholder': 'Enter URL',
                }
            ),
        }


class EditProfileForm(auth_forms.UserChangeForm):
    first_name = forms.CharField(
        max_length=Profile.FIRST_NAME_MAX_LENGTH,
    )
    last_name = forms.CharField(
        max_length=Profile.LAST_NAME_MAX_LENGTH,
    )
    picture = forms.URLField()
    description = forms.CharField(
        widget=forms.Textarea,
    )

    class Meta:
        model = get_user_model()
        fields = ('first_name', 'last_name', 'picture', 'description',)
        widgets = {
            'first_name': forms.TextInput(
                attrs={
                    'placeholder': 'Enter first name',
                }
            ),
            'last_name': forms.TextInput(
                attrs={
                    'placeholder': 'Enter last name',
                }
            ),
            'picture': forms.TextInput(
                attrs={
                    'placeholder': 'Enter URL',
                }
            ),
        }


class PasswordChangingForm(auth_forms.PasswordChangeForm):
    OLD_PASSWORD_LABEL = 'Стара парола'
    OLD_NEW_PASSWOD1_LABEL = 'Нова парола'
    OLD_NEW_PASSWOD2_LABEL = 'Потвърдете новата парола'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['old_password'].label = self.OLD_PASSWORD_LABEL
        self.fields['new_password1'].label = self.OLD_NEW_PASSWOD1_LABEL
        self.fields['new_password2'].label = self.OLD_NEW_PASSWOD2_LABEL
