from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, \
RetrieveAPIView, DestroyAPIView, UpdateAPIView, ListAPIView, CreateAPIView
from rest_framework.permissions import IsAdminUser
from .models import Notification
from rest_framework import filters, viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from .serializers import BaseNotificationSerializer, SpecificNotificationSerializer

# Create your views here.

class NotificationList(ListAPIView):
    serializer_class = BaseNotificationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['read']
    # ordering_fields = ['created_at']

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(user=user).order_by('-created_at')


class NotificationDelete(RetrieveUpdateDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = BaseNotificationSerializer

    def get_object(self):
        notification_id = self.kwargs['pk']
        return get_object_or_404(Notification, pk=notification_id, user=self.request.user)

class NotificationGet(RetrieveAPIView):
    serializer_class = BaseNotificationSerializer
    queryset = Notification.objects.all()

    def get_object(self):

        notification_id = self.kwargs['pk']
        notification = get_object_or_404(self.get_queryset(), pk=notification_id)
        if notification.user == self.request.user:
            notification.read = True
            notification.save()
            
            return notification

        raise PermissionDenied(detail='You do not have permission to view this notification.')

