from django import forms
from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.core.validators import EmailValidator
from django.views.generic.edit import CreateView, FormView
from django.urls import reverse, reverse_lazy
from django.db import models
from .forms import RegistrationForm, LoginForm, UpdateForm

# Create your views here.
class RegisterView(CreateView):
    form_class = RegistrationForm
    template_name = 'accounts/register.html'
    success_url = reverse_lazy('accounts:login')

    def form_valid(self, form):
        self.request.session['from'] = 'register'
        return super().form_valid(form)

class LoginView(FormView):
    form_class = LoginForm
    template_name = 'accounts/login.html'

    def form_valid(self, form):
        login(self.request, form.cleaned_data['user'])
        return super().form_valid(form)

    def get_success_url(self) -> str:
        return reverse_lazy('accounts:pview')

# def pedit(request):
#     if request.user.is_authenticated:
#         first_name = request.user.first_name
#         last_name = request.user.last_name
#         email = request.user.email

#         form = UpdateForm(initial={ 'first_name':first_name, 'last_name':last_name, 'email':email })

#         if request.method == "GET":
#             return render(request, 'accounts/profile.html', { 'form':form }, status=200)
#         elif request.method == "POST":
#             form = UpdateForm(request.POST, instance=request.user)
#             if form.is_valid():
#                 form.save()
#                 return redirect(reverse('accounts:pview'))
#     else:
#         return HttpResponse('UNAUTHORIZED', status=401)

def pedit(request):
    if request.user.is_authenticated:

        if request.method == "POST":
            profile_form = UpdateForm(request.POST, instance=request.user)
            
            if profile_form.is_valid():
                profile_form.save()
                return redirect(reverse('accounts:pview'))
        
        elif request.method == "GET":
            userdata = {
                "email": request.user.email,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
            }
            profile_form = UpdateForm(userdata)
        return render(request, 'accounts/profile.html', {'form': profile_form})

    else:
        return HttpResponse("UNAUTHORIZED", status=401)

def logout(request):
    if request.user.is_authenticated:
        logout(request)
    return redirect('accounts:login')   

def pview(request):
    if request.user.is_authenticated:
        return JsonResponse({ "id": request.user.id, 
                "username": request.user.username, 
                "email": request.user.email, 
                "first_name": request.user.first_name, 
                "last_name": request.user.last_name  })
    else:
        return HttpResponse('UNAUTHORIZED', status=401)
