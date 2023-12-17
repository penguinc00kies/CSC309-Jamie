from django.urls import path
from .views import CreateCommentShelter, CreateCommentApplication, ListCommentsOnShelter, ListCommentsOnApplication

app_name = 'comments'

urlpatterns = [
    path('shelter/', CreateCommentShelter.as_view()),
    path('application/', CreateCommentApplication.as_view()), 
    path('<int:pk>/application/', ListCommentsOnApplication.as_view(), name='application-comments-list'),
    path('<int:pk>/shelter/', ListCommentsOnShelter.as_view(), name='shelter-comments-list'),
]

