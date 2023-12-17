from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView
from .models import Comment
from accounts.models import User
from .serializers import CommentSerializer
from rest_framework.permissions import IsAuthenticated
from listing.models import Application
from django.shortcuts import get_object_or_404
from django.utils import timezone
from notifications.models import Notification
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse

class CreateCommentShelter(CreateAPIView):
    # user wants to comment on shelter
    permission_classes = [IsAuthenticated]

    def create(self, request):
        curr_user = self.request.user
        serializer_instance = CommentSerializer(data=request.data)

        if serializer_instance.is_valid():
            shelter_id = request.data.get('receiving_comment_object')

            if not User.objects.filter(pk=shelter_id).exists():
                return Response({"error": "Shelter does not exist. Please comment on existing shelter."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer_instance.save(comment_user=curr_user)
            Notification.objects.create(
                    text=f"{curr_user.email} commented on your shelter!",
                    link=f"/{shelter_id}/shelter/review",
                    user=User.objects.get(pk=request.data.get('receiving_comment_object')),
                    content_type=ContentType.objects.get_for_model(Comment),
                    object_id=serializer_instance.instance.id,
                )
            return Response(serializer_instance.data, status=status.HTTP_201_CREATED)
        return Response({"error": "The shelter you are trying to comment on does not exist. Please provide a valid shelter ID."},  status=status.HTTP_400_BAD_REQUEST)

class CreateCommentApplication(CreateAPIView):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        curr_user = self.request.user
        serializer_instance = CommentSerializer(data=request.data)  # Create an instance of the serializer

        if serializer_instance.is_valid():
            application_id = request.data.get('receiving_comment_object')
            application = get_object_or_404(Application, id=application_id)
            comment_url = reverse('comments:application-comments-list', args=[application_id])

            # seeker wants to comment on application
            if curr_user == application.seeker:
                application.last_updated = timezone.now()
                application.save()
                serializer_instance.save(comment_user=curr_user)
                
                # Create a notification for the shelter
                
                Notification.objects.create(
                    text=f"{curr_user.email} commented on an application!",
                    link=f"/application/{application.id}",
                    user=User.objects.get(pk=application.listing.shelter.id),
                    content_type=ContentType.objects.get_for_model(Comment),
                    object_id=serializer_instance.instance.id,
                )
        
            # shelter wants to comment on application 
            elif curr_user == application.listing.shelter:
                application.last_updated = timezone.now()
                application.save()
                serializer_instance.save(comment_user=curr_user)

                # Create a notification for the seeker
                
                Notification.objects.create(
                    text=f"{curr_user.email} commented on your application!",
                    link=f"/application/{application.id}",
                    user=User.objects.get(pk=application.seeker.id),
                    content_type=ContentType.objects.get_for_model(Comment),
                    object_id=serializer_instance.instance.id,
                )
            else:
                return Response({"error": "Please only comment on your application."}, status=status.HTTP_403_FORBIDDEN)
            return Response(serializer_instance.data, status=status.HTTP_201_CREATED)
        return Response({"error": "The application you are trying to comment on does not exist. Please provide a valid application ID."},  status=status.HTTP_400_BAD_REQUEST)

   
class ListCommentsOnApplication(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        curr_user = self.request.user
        application_id = self.kwargs['pk']
        application = get_object_or_404(Application, id=application_id)

        # Only the specific pet seeker can see the comments for their application.
        if application and curr_user == application.seeker:
            return Comment.objects.filter(receiving_comment_object_id=application_id, is_application=True).order_by('-comment_time')
        
        # Only the specific shetler can see the comments for their application.
        elif application and curr_user == application.listing.shelter:
            return Comment.objects.filter(receiving_comment_object_id=application_id, is_application=True).order_by('-comment_time')
        
        return Comment.objects.none()

class ListCommentsOnShelter(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        shelter_id = self.kwargs['pk']
        return Comment.objects.filter(receiving_comment_object=shelter_id, is_application=False).order_by('-comment_time')