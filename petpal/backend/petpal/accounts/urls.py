from django.urls import path
from . import views

urlpatterns = [ 
    path('accounts/', views.PetPalUserCreate.as_view()),
    path('shelters/', views.PetPalUserList.as_view()),
    path('profile/', views.PetPalUserProfile.as_view()),
    path('<int:pk>/info/', views.PetPalViewUser.as_view()),
     # dina added
    path('<int:pk>/view/', views.PetPalViewProfile.as_view())
]
