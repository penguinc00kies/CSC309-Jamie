from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager

# class PetPalUserManager(UserManager):
#     def _create_user(self, email, password, **extra_fields):
#         if not email:
#             raise ValueError("Please provide a valid e-mail address.")

#         email = self.normalize_email(email)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)

#         return user

#     def create_user(self, email, password, **extra_fields):
#         extra_fields.setdefault('is_superuser', False)
#         extra_fields.setdefault('is_staff', False)
#         # password_confirm = extra_fields.pop('password_confirm', None)
#         return self._create_user(email, password, **extra_fields)

#     def create_superuser(self, email=None, password=None, **extra_fields):
#         extra_fields.setdefault('is_superuser', True)
#         extra_fields.setdefault('is_staff', True)
#         return self._create_user(email, password, **extra_fields)

class PetPalUserManager(UserManager):
    def get_queryset(self):
        return super().get_queryset().defer(None).only("id", "email", "name", "phone", "address", "description", "is_shelter", "avatar")

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Please provide a valid e-mail address.")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_staff', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        return self._create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(blank=True, default='', unique=True)
    name = models.CharField(max_length=255, blank=True, default='')

    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    phone = models.IntegerField(null=True)
    address = models.CharField(max_length=255, default='')
    description = models.TextField(default='')
    is_shelter = models.BooleanField(default=False)
    avatar = models.ImageField(null=True, blank=True, upload_to="media/")
    
    objects = PetPalUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'

    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'User'