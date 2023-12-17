from rest_framework.serializers import ModelSerializer
from accounts.serializers import PetPalUserSerializer
from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from .models import Comment

class CommentSerializer(ModelSerializer):

    class Meta:
        model = Comment
        fields = ['comment_user', 'comment_time', 'comment_content', 'receiving_comment_object', 'object_id', 'is_application', 'star_rating']

    def validate_receiving_comment_object(self, value):
        # Validate the related object dynamically
        if not ContentType.objects.filter(pk=value.pk).exists():
            raise serializers.ValidationError("Please make sure you are commenting on a valid item.")
        return value