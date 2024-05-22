from rest_framework import serializers
from . import models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserModel
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio']
    

class RegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(required = True)
    email = serializers.EmailField(required = True)
    class Meta:
        model = models.UserModel
        fields = ['username', 'first_name', 'last_name', 'bio', 'email', 'password', 'confirm_password',  ]

    def save(self):
        username = self.validated_data['username']
        first_name = self.validated_data['first_name']
        last_name = self.validated_data['last_name']
        bio = self.validated_data['bio']
        email = self.validated_data['email']
        password = self.validated_data['password']
        confirm_password = self.validated_data['confirm_password']

        if password != confirm_password:
            raise serializers.ValidationError({'confirm_password': ['Password does not match!']})
        
        account = models.UserModel(username=username, first_name = first_name, last_name = last_name, bio = bio, email = email)

        account.set_password(password)
        account.is_active = False
        account.save()

        return account
    

class LoginSerializer(serializers.Serializer):
    username =serializers.CharField(required = True)
    password =serializers.CharField(required = True)

    

