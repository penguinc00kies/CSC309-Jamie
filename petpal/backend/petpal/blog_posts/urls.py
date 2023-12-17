from django.urls import path
from . import views

urlpatterns = [
    path('creation/', views.BlogPostCreate.as_view()),
    path('list/<int:pk>/', views.BlogPostList.as_view()),
    path('list/most_liked/<int:pk>/', views.BlogPostLikedList.as_view()),
    path('like/<int:pk>/', views.BlogPostLike.as_view()),
    path('deletion/<int:pk>/', views.BlogPostDelete.as_view()),
    path('update/<int:pk>/', views.BlogPostGetUpdate.as_view())
]