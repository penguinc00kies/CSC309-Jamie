from django.db import models
from django.conf import settings 
from accounts import models as a_models

# Create your models here.
# class BlogPost (models.Model):
#     content = models.CharField(max_length=250, null=False),
#     # creation_time = models.DateTimeField(auto_now_add=True),
#     # shelter = models.ForeignKey(a_models.User, on_delete=models.CASCADE, null=True)
class BlogPost(models.Model):
    title = models.CharField(max_length=50)
    post = models.CharField(max_length=500, null=True)
    date = models.DateTimeField(auto_now_add=True, blank=True)
    likes = models.IntegerField(default=0)
    liked_users = models.ManyToManyField(a_models.User, related_name='liked_posts')
    shelter = models.ForeignKey(a_models.User, on_delete=models.CASCADE, null=True)