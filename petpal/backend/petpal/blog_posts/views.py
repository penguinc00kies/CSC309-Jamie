from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAdminUser
from .models import BlogPost
from .serializers import BlogPostSerializer
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny 
import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import BlogPost
from .serializers import BlogPostSerializer
from accounts import models as a_models

# Create your views here.

class BlogPostList(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BlogPostSerializer
    queryset = BlogPost.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['shelter']

    def get_queryset(self):
        shelter = self.kwargs['pk']
        if shelter is not None:
            return BlogPost.objects.filter(shelter=shelter).order_by('-date')
        else:
            # Handle the case when 'shelter' parameter is not provided
            return BlogPost.objects.none() 

class BlogPostLikedList(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BlogPostSerializer
    queryset = BlogPost.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['shelter']

    def get_queryset(self):
        shelter = self.kwargs['pk']
        if shelter is not None:
            return BlogPost.objects.filter(shelter=shelter).order_by('-likes')
        else:
            # Handle the case when 'shelter' parameter is not provided
            return BlogPost.objects.none()

class BlogPostCreate(CreateAPIView):
    serializer_class = BlogPostSerializer
    def perform_create(self, serializer):
        if self.request.user.is_shelter == False:
            return HttpResponse('Unauthorized', status=401)
        serializer.save(shelter=self.request.user)
        serializer.save(creation_time=datetime.datetime.now)

class BlogPostLike(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        # Get the blog post instance
        blog_post = get_object_or_404(BlogPost, pk=pk)

        # Check if the user has already liked the post
        if blog_post.liked_users.filter(id=request.user.id).exists():
            return HttpResponse('You have already liked this post.', status=400)
            # return Response({'detail': 'You have already liked this post.'}, status=status.HTTP_400_BAD_REQUEST)

        if blog_post.shelter.id == request.user.id:
            return HttpResponse('You cannot like your own post.', status=400)
            # return Response({'detail': 'You cannot like your own post.'}, status=status.HTTP_400_BAD_REQUEST)

        # Increment the like count and add the user to the likes
        blog_post.liked_users.add(request.user)
        blog_post.likes += 1
        blog_post.save()

        # Serialize the updated blog post
        serializer = BlogPostSerializer(blog_post)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BlogPostDelete(DestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    # Override the default behavior to ensure that only the owner (shelter) can delete the post
    def destroy(self, request, *args, **kwargs):
        post = self.get_object()

        # Check if the user making the request is the shelter who created the post
        if post.shelter == request.user:
            self.perform_destroy(post)
            return HttpResponse("Blog post deleted successfully", status=204)
        else:
            return HttpResponse("You do not have permission to delete this blog post", status=403)

class BlogPostGetUpdate(RetrieveUpdateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        if self.get_object().shelter != request.user:
            return HttpResponse("You do not have permission to edit this blog post", status=403)

        partial = kwargs.pop('partial', False)
        post = self.get_object()
        serializer = self.get_serializer(post, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        response = serializer.update(post, serializer.validated_data)

        if not isinstance(response, BlogPost):
            return HttpResponse(response, status=400)

        return Response(serializer.data)