from rest_framework.serializers import ModelSerializer, CharField, ValidationError, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField
from .models import User
import rest_framework.serializers

# class PetPalUserSerializer(ModelSerializer):
#     # password_confirm = CharField(write_only=True)
#     # class Meta:
#     #     model = User
#     #     fields = ['email', 'name', 'password', 'password_confirm', 'phone', 'address', 'description', 'is_shelter', 'avatar']

#     # def validate(self, data):
#     #     if data['password'] != data['password_confirm']:
#     #         raise ValidationError("Please check to make sure your passwords match.")
#     #     data.pop('password_confirm')
#     #     return data
#     password = CharField(write_only=True, required=False)
#     password_confirm = CharField(write_only=True, required=False)

#     class Meta:
#         model = User
#         fields = ['email', 'name', 'password', 'password_confirm', 'phone', 'address', 'description', 'is_shelter', 'avatar']
        
#     def create(self, validated_data):
#         password_confirm = validated_data.pop('password_confirm', None)
#         return super().create(**validated_data)
        
#     def validate(self, data):
#         password = data.get('password')
#         password_confirm = data.get('password_confirm')

#         if (password or password_confirm) and (not password or not password_confirm):
#             raise ValidationError("Both password and password_confirm are required if either one is provided.")

#         if password and password != password_confirm:
#             raise ValidationError("Please check to make sure your passwords match.")

#         return data

#     def update(self, instance, validated_data):
#         password = validated_data.get('password')
#         password_confirm = validated_data.get('password_confirm')

#         if password and password_confirm and password != password_confirm:
#             raise ValidationError("Please check to make sure your passwords match.")

#         if password:
#             instance.set_password(password)

#         instance.email = validated_data.get('email', instance.email)
#         instance.name = validated_data.get('name', instance.name)
#         instance.phone = validated_data.get('phone', instance.phone)
#         instance.address = validated_data.get('address', instance.address)
#         instance.description = validated_data.get('description', instance.description)
#         instance.is_shelter = validated_data.get('is_shelter', instance.is_shelter)
#         instance.avatar = validated_data.get('avatar', instance.avatar)

#         instance.save()
#         return instance

class PetPalUserSerializer(ModelSerializer):
    password = CharField(write_only=True, required=False)
    password_confirm = CharField(write_only=True, required=False)
    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'password_confirm', 'phone', 'address', 'description', 'is_shelter', 'avatar']

    def validate(self, data):
        # if data['password'] != data['password_confirm']:
        #     raise ValidationError("Please check to make sure your passwords match.")

        # if (data['password'] or data['password_confirm']) and (not data['password'] or not data['password_confirm']):
        #     raise ValidationError("Both password and password_confirm are required if either one is provided.")
        password = data.get('password')
        password_confirm = data.get('password_confirm')

        if (password or password_confirm) and (not password or not password_confirm):
            raise ValidationError("Both password and password_confirm are required if either one is provided.")

        if password and password != password_confirm:
            raise ValidationError("Please check to make sure your passwords match.")
        
        if password_confirm:
            data.pop('password_confirm')
        return data

    def create(self, validated_data):
        return super().create(**validated_data)


    def update(self, instance, validated_data):
        password = validated_data.get('password')
        password_confirm = validated_data.get('password_confirm')
        phone = validated_data.get('phone', instance.phone)
        address = validated_data.get('address', instance.address)
        description = validated_data.get('description', instance.description)
        avatar = validated_data.get('avatar', instance.avatar)

        if password and password_confirm and password != password_confirm:
            raise ValidationError("Please check to make sure your passwords match.")

        if password:
            instance.set_password(password)

        instance.email = validated_data.get('email', instance.email)
        instance.name = validated_data.get('name', instance.name)

        if phone:
            instance.phone = validated_data.get('phone', instance.phone)

        if address:
            instance.address = validated_data.get('address', instance.address)
        
        if description:
            instance.description = validated_data.get('description', instance.description)
        instance.is_shelter = validated_data.get('is_shelter', instance.is_shelter)

        if avatar:
            instance.avatar = validated_data.get('avatar', instance.avatar)

        instance.save()
        return instance

class PetPalUserProfileSerializer(ModelSerializer):
    password = CharField(write_only=True, required=False)
    password_confirm = CharField(write_only=True, required=False)
    user_id = CharField(source='id', read_only=True)
    class Meta:
        model = User
        fields = ['user_id', 'email', 'name', 'password', 'password_confirm', 'phone', 'address', 'description', 'is_shelter', 'avatar']

    def validate(self, data):
        # if data['password'] != data['password_confirm']:
        #     raise ValidationError("Please check to make sure your passwords match.")

        # if (data['password'] or data['password_confirm']) and (not data['password'] or not data['password_confirm']):
        #     raise ValidationError("Both password and password_confirm are required if either one is provided.")
        password = data.get('password')
        password_confirm = data.get('password_confirm')

        if (password or password_confirm) and (not password or not password_confirm):
            raise ValidationError("Both password and password_confirm are required if either one is provided.")

        if password and password != password_confirm:
            raise ValidationError("Please check to make sure your passwords match.")
        
        if password_confirm:
            data.pop('password_confirm')
        return data

    def create(self, validated_data):
        return super().create(**validated_data)


    def update(self, instance, validated_data):
        password = validated_data.get('password')
        password_confirm = validated_data.get('password_confirm')
        phone = validated_data.get('phone', instance.phone)
        address = validated_data.get('address', instance.address)
        description = validated_data.get('description', instance.description)
        avatar = validated_data.get('avatar', instance.avatar)

        if password and password_confirm and password != password_confirm:
            raise ValidationError("Please check to make sure your passwords match.")

        if password:
            instance.set_password(password)

        instance.email = validated_data.get('email', instance.email)
        instance.name = validated_data.get('name', instance.name)

        if phone:
            instance.phone = validated_data.get('phone', instance.phone)

        if address:
            instance.address = validated_data.get('address', instance.address)
        
        if description:
            instance.description = validated_data.get('description', instance.description)
        instance.is_shelter = validated_data.get('is_shelter', instance.is_shelter)

        if avatar:
            instance.avatar = validated_data.get('avatar', instance.avatar)

        instance.save()
        return instance
    

class PetPalDisplaySerializer(ModelSerializer):
    user_id = CharField(source='id', read_only=True)

    class Meta:
        model = User
        fields = ['user_id', 'email', 'name', 'phone', 'address', 'description', 'is_shelter', 'avatar']