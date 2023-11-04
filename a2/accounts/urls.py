from django.urls import path
from . import views

# Create your views here.
app_name = "accounts"
urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.RegisterView.as_view()),
    path('profile/view/', views.pview, name='pview'),
    path('profile/edit/', views.pedit, name='pedit')    
]