from django.urls import path
from . import views

urlpatterns = [ 
    path('notifications/', views.NotificationList.as_view()),
    path('<int:pk>/deletion/', views.NotificationDelete.as_view()),
    path('<int:pk>/link/', views.NotificationGet.as_view())
]
