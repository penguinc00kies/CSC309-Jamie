from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField, BooleanField
from .models import Listing
from .models import Application

class BaseListingSerializer(ModelSerializer):
    available = BooleanField(read_only=True, default=True)

    class Meta:
        model = Listing
        fields = '__all__'


class SimpleListingSerializer(BaseListingSerializer):
    class Meta:
        model = Listing
        fields = ['name', 'gender', 'breed', 'picture1', 'available']


class ApplicationSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'


class ApplicationUpdateSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['first_name', 'last_name', 'email', 'notes', 'listing', 'created_at', 'last_updated', 'phone', 'address']
