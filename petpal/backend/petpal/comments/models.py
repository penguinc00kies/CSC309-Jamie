from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.conf import settings

class Comment(models.Model):
    # email of the user who wrote the comment
    comment_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment_time = models.DateTimeField(auto_now_add=True)
    comment_content = models.TextField()

    # type of the object being commented on (shelter or application)
    receiving_comment_object = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    
    # holds the primary key of the object (shelter or application)
    object_id = models.PositiveIntegerField()
    
    # creates relationship with the commented object 
    content_object = GenericForeignKey('receiving_comment_object', 'object_id')

    # check if is application 
    is_application = models.BooleanField(default=False)

    # rating
    star_rating = models.IntegerField(default=None, blank=True, null=True)