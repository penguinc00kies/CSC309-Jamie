from django.urls import path
from . import views

urlpatterns = [
    path('listings/', views.ListingList.as_view()),
    path('listings/<int:pk>/', views.ListingRetrieve.as_view()),
    path('listings/creation/', views.ListingCreate.as_view()),
    path('listings/deletion/<int:pk>/', views.ListingDelete.as_view()),
    path('listings/update/<int:pk>/', views.ListingUpdate.as_view()),
    path('listings/<int:pk>/applications/', views.ApplicationCreate.as_view()),
    path('applications/', views.ApplicationList.as_view()),
    path('applications/<int:pk>/', views.ApplicationRetrieve.as_view(), name='application'),
    path('applications/<int:pk>/update/', views.ApplicationUpdate.as_view()),
]