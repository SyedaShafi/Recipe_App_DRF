# user_accounts/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import UserModel

class CustomUserCreationForm(UserCreationForm):
 
    class Meta(UserCreationForm.Meta):
        model = UserModel
        fields = ('username', 'first_name', 'last_name', 'email', 'bio', 'password1', 'password2')


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = UserModel
        fields = ('username', 'first_name', 'last_name', 'email', 'bio')
