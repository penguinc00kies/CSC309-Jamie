from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, \
RetrieveAPIView, DestroyAPIView, UpdateAPIView, ListAPIView, CreateAPIView
from rest_framework.permissions import IsAdminUser
from .models import Listing, Application
from .serializers import BaseListingSerializer, SimpleListingSerializer, ApplicationSerializer, ApplicationUpdateSerializer
from rest_framework import filters, viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny 
from notifications.models import Notification
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse 
from accounts.models import User

# Create your views here.

class ListingList(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BaseListingSerializer
    queryset = Listing.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['gender', 'breed', 'on_hold', 'neutered', 'vaccinated']
    search_fields = ['name']
    ordering_fields = ['birthday', 'name']

class ListingCreate(CreateAPIView):
    serializer_class = BaseListingSerializer
    def perform_create(self, serializer):
        if self.request.user.is_shelter == False:
            return HttpResponse('Unauthorized', status=401)
        serializer.save(shelter=self.request.user)

class ListingRetrieve(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = BaseListingSerializer
    def get_queryset(self):
        return Listing.objects.filter(id=self.kwargs['pk'])

class ListingDelete(DestroyAPIView):
    serializer_class = BaseListingSerializer
    def get_queryset(self):
        return Listing.objects.filter(id=self.kwargs['pk'])

class ListingUpdate(UpdateAPIView):
    serializer_class = BaseListingSerializer
    def get_queryset(self):
        return Listing.objects.filter(id=self.kwargs['pk'])


class ApplicationCreate(CreateAPIView):
    serializer_class = ApplicationSerializer
    # filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    # filterset_fields = ['status']
    # ordering_fields = ['created_at', 'last_updated']

    # def get_queryset(self):
    #     user = self.request.user
    #     application = get_object_or_404(Application, id=self.kwargs['pk'])
    #     if user.is_shelter:
    #         if application.listing.shelter != user:
    #             raise PermissionDenied("You cannot view this application.")
    #         return Application.objects.filter(listing__shelter=user)
    #     else:
    #         if (application.seeker != user):
    #             raise PermissionDenied("You cannot view this application.")
    #         return Application.objects.filter(seeker=user)

    def perform_create(self, serializer):
        listing = get_object_or_404(Listing, pk=self.kwargs['pk'], on_hold=False)
        
        if self.request.user.is_shelter:
            raise PermissionDenied(detail='Shelters are not allowed to create applications.')

        serializer.save(listing=listing, seeker=self.request.user)

        # comment_url = reverse('application', args=[serializer.instance.id])
        comment_url = 'application/{serializer.instance.id}'     
        Notification.objects.create(
            text=f"{self.request.user.email} applied for one of your pets!",
            # link=f"http://127.0.0.1:8000{comment_url}",
            link=f"/application/{serializer.instance.id}",
            user=User.objects.get(pk=listing.shelter.id),
            content_type=ContentType.objects.get_for_model(Application),
            object_id=serializer.instance.id,
        )

class ApplicationList(ListAPIView):
    serializer_class = ApplicationSerializer
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status']
    ordering_fields = ['created_at', 'last_updated']

    def get_queryset(self):
        user = self.request.user

        if user.is_shelter:
            return Application.objects.filter(listing__shelter=user)
        else:
            return Application.objects.filter(seeker=user)

class ApplicationRetrieve(RetrieveAPIView):
    serializer_class = ApplicationSerializer

    def get_object(self):
        application = get_object_or_404(Application, id=self.kwargs['pk'])
        user = self.request.user

        if user.is_shelter:
            if application.listing.shelter != user:
                raise PermissionDenied("You cannot view this application.")
        
        if not user.is_shelter:
            if (application.seeker != user):
                raise PermissionDenied("You cannot view this application.")
   
        return application
       


class ApplicationUpdate(UpdateAPIView):
    serializer_class = ApplicationUpdateSerializer

    def get_object(self):
        application = get_object_or_404(Application, id=self.kwargs['pk'])
        user = self.request.user

        if user.is_shelter:
            if application.status not in ['pending']:
                raise PermissionDenied("Shelters can only update from pending.")
        else:
            if application.status not in ['pending', 'accepted']:
                raise PermissionDenied("Pet seekers can only update from pending or accepted.")

        return application

    def perform_update(self, serializer):
        if self.request.user.is_shelter and serializer.validated_data.get('status') == 'withdrawn':
            raise PermissionDenied("Shelters can't update status to withdrawn.")

        if not self.request.user.is_shelter and serializer.validated_data.get('status') == 'denied':
            raise PermissionDenied("Seekers can't update status to denied.")
        
        if not self.request.user.is_shelter and serializer.validated_data.get('status') == 'accepted':
            raise PermissionDenied("Seekers can't update status to accepted.")
        

        application = get_object_or_404(Application, id=self.kwargs['pk'])

        if self.request.user.is_shelter:
            # comment_url = reverse('application', args=[serializer.instance.id])       
            Notification.objects.create(
                text=f"{self.request.user.email} updated your application!",
                link=f"/application/{application.id}",
                user=User.objects.get(pk=application.seeker.id),
                content_type=ContentType.objects.get_for_model(Application),
                object_id=serializer.instance.id,
            )
        else:
            application = get_object_or_404(Application, id=self.kwargs['pk'])
            comment_url = reverse('application', args=[serializer.instance.id])       
            Notification.objects.create(
                text=f"{self.request.user.email} updated their application!",
                link=f"/application/{application.id}",
                user=User.objects.get(pk=application.listing.shelter.id),
                content_type=ContentType.objects.get_for_model(Application),
                object_id=serializer.instance.id,
            )

        super().perform_update(serializer)

        
