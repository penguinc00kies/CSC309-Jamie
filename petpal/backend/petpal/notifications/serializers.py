from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField, BooleanField
from .models import Notification

class BaseNotificationSerializer(ModelSerializer):

    class Meta:
        model = Notification
        fields = '__all__'

class SpecificNotificationSerializer(ModelSerializer):

    class Meta:
        model = Notification
        fields = '__all__'