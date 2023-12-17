from django.db import models
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.conf import settings 
from accounts import models as a_models

pics = FileSystemStorage(location="media")

GENDER_CHOICES = (
    ('female', 'FEMALE'),
    ('male','MALE'),
)

SPECIES_CHOICES = (
    ('bunny', 'BUNNY'),
    ('cat','CAT'),
    ('dog','DOG'),
)

class Listing(models.Model):
    name = models.CharField(max_length=50, null=False)
    birthday = models.DateField(null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=False)
    breed = models.CharField(max_length=10, choices=SPECIES_CHOICES, null=False)
    neutered = models.BooleanField(default=False)
    vaccinated = models.BooleanField(default=False)
    shelter = models.ForeignKey(a_models.User, on_delete=models.CASCADE, null=True)
    description = models.CharField(max_length=250, null=True)
    on_hold = models.BooleanField(default=False)
    medical_records = models.FileField(upload_to='records/', null=True)
    picture1 = models.FileField(upload_to='photos/', null=True, storage=pics, blank=True)
    picture2 = models.FileField(upload_to='photos/', null=True, storage=pics, blank=True)
    picture3 = models.FileField(upload_to='photos/', null=True, storage=pics, blank=True)
    picture4 = models.FileField(upload_to='photos/', null=True, storage=pics, blank=True)

class Application(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
        ('withdrawn', 'Withdrawn'),
    ]

    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=False)
    email = models.EmailField(max_length=200)
    phone = models.IntegerField(null=True)
    address = models.CharField(max_length=255, null=True)
    notes =  models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    # This is the pet associated with the application 
    listing = models.ForeignKey(Listing, related_name='applications', on_delete=models.CASCADE, null=True, blank=True)
    seeker = models.ForeignKey(a_models.User, on_delete=models.CASCADE, null=True, blank=True)