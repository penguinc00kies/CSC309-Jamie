from django import forms
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.core.exceptions import ValidationError

class RegistrationForm(UserCreationForm):
    # username = forms.CharField(max_length=120)
    # password = forms.CharField(widget=forms.PasswordInput)
    # email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username', 'password1', 'password2', 'email', 'first_name', 'last_name']
        errors = {
            'username': {
                'unique': "A user with that username already exists",
                'required': "This field is required"
            },
            'password1': {
                'required': "This field is required",
                'min_length': "This password is too short. It must contain at least 8 charachers"
            },
            'password2': {
                'required': "This field is required",
            },
            'email': {
                'invalid': "Enter a valid email address"
            }
        }

    def clean(self):
        data = super().clean()
        password1 = data.get("password1")
        password2 = data.get("password2")

        if password1 and password2 and password2 != password1:
            raise forms.ValidationError("The two password fields didn't match")
        
        return data

class LoginForm(forms.Form):
    username = forms.CharField(max_length=120)
    password = forms.CharField(widget=forms.PasswordInput())

    def clean(self):
        data = super().clean()
        user=authenticate(username=data['username'], password=data['password'])
        if not user:
            raise ValidationError(
                { 'username' : 'Username or password is invalid'}
            )
        data['user'] = user
        return data
    
class UpdateForm(UserChangeForm):
    first_name = forms.CharField(label='first_name', max_length=120, required=False)
    last_name = forms.CharField(label='last_name', max_length=120, required=False)
    email = forms.EmailField(label='email', max_length=120, required=False)
    password1 = forms.CharField(label='password1', widget=forms.PasswordInput(), required=False, min_length=8, error_messages={'min_length': "This password is too short. It must contain at least 8 characters"})
    password2 = forms.CharField(label='password2', widget=forms.PasswordInput(), required=False, min_length=8, error_messages={'min_length': "This password is too short. It must contain at least 8 characters"})

    class Meta:
        model = User
        fields = ['first_name', 'last_name',  'email', 'password1', 'password2']
        

    def clean(self):
        data = super().clean()
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        email = data.get("email")
        password1 = data.get("password1")
        password2 = data.get("password2")

        if password1 != '':
            if password1 and password2 and password2 != password1:
                raise forms.ValidationError("The two password fields didn't match")
            if len(password1) < 8:
                raise forms.ValidationError("This password is too short. It must contain at least 8 characters")
        return data
            
    def password_check(self):
        password1 = self.cleaned_data.get('password1')
        if password1 and len(password1) < 8:
            raise ValidationError('This password is too short. It must contain at least 8 characters')
        return password1