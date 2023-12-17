from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from .models import User
from listing.models import Application, Listing
from .serializers import PetPalUserSerializer, PetPalDisplaySerializer, PetPalUserProfileSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status



# Create your views here.

# class PetPalUserCreate(CreateAPIView):
#     serializer_class = PetPalUserSerializer
#     permission_classes = [AllowAny]

#     def perform_create(self, serializer):
#         result = serializer.save()
#         if not isinstance(result, User):
#             return Response(result, status=400)
#         user = User.objects.create_user(**serializer.validated_data)
class PetPalUserCreate(CreateAPIView):
    serializer_class = PetPalUserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = User.objects.create_user(**serializer.validated_data)

class PetPalUserList(ListAPIView):
    serializer_class = PetPalDisplaySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return User.objects.filter(is_shelter=True)

    # def list(self, request, *args, **kwargs):
    #     queryset = self.get_queryset()
    #     serializer = self.get_serializer(queryset, many=True)
    #     data = serializer.data

    #     # Modify the data to include user IDs
    #     modified_data = [{'user_id': user.id, **user_data} for user, user_data in zip(queryset, data)]
    #     print(modified_data)

    #     return Response(modified_data)

class PetPalUserProfile(RetrieveUpdateDestroyAPIView):
    serializer_class = PetPalUserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        response = serializer.update(instance, serializer.validated_data)

        if not isinstance(response, User):
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)

class PetPalViewUser(RetrieveAPIView):
    serializer_class = PetPalDisplaySerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get_object(self):

        user_id = self.kwargs['pk']
        view_user = get_object_or_404(self.get_queryset(), pk=user_id)
        if view_user.is_shelter:
            return view_user
        elif self.request.user.is_shelter:
            shelter_listings = Listing.objects.filter(shelter=self.request.user)
            requested_user_applications = Application.objects.filter(seeker=view_user)
            if requested_user_applications.filter(listing__in=shelter_listings).exists():
                return view_user
        raise PermissionDenied(detail='You do not have permission to view this profile.')

  # dina added

class PetPalViewProfile(RetrieveAPIView):
    serializer_class = PetPalDisplaySerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get_object(self):

        user_id = self.kwargs['pk']
        view_user = get_object_or_404(self.get_queryset(), pk=user_id)
        return view_user




