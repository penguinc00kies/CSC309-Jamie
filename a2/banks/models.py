from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Bank(models.Model):
    name = models.CharField(max_length=200)
    swift_code = models.CharField(max_length=200)
    institution_number = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

class Branch(models.Model):
    name = models.CharField(max_length=200)
    transit_number = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    email = models.EmailField(max_length=200, default="admin")
    capacity = models.PositiveIntegerField(blank=True)
    last_modified = models.TimeField()
    bank = models.ForeignKey(Bank)