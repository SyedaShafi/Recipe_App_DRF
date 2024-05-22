from django.shortcuts import render, redirect
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from user_accounts.models import UserModel
from .serializers import UserSerializer, RegistrationSerializer, LoginSerializer
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout, authenticate, login
from django.utils.encoding import force_bytes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework import status

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework.decorators import api_view
# Create your views here.


class UserModelViewset(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('pk')
        if user_id:
            return UserModel.objects.filter(id=user_id)
        return super().get_queryset()

class RegistrationAPIView(APIView):
    serializer_class = RegistrationSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            confirm_link = f"http://127.0.0.1:8000/user/active/{uid}/{token}/"
            email_subject = "Confirm Your Email"
            email_body = render_to_string('confirm_email.html', {'confirm_link' : confirm_link})
            email = EmailMultiAlternatives(email_subject , '', to=[user.email])
            email.attach_alternative(email_body, "text/html")
            email.send()
            return Response("Check your mail for confirmation", status=201)
        return Response(serializer.errors, status=400)




def activate(request, uid64, token):
    try:
        uid = urlsafe_base64_decode(uid64).decode()
        user = UserModel._default_manager.get(pk=uid)
    except(UserModel.DoesNotExist):
        user = None 
    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return redirect('user_login')
    else:
        return redirect('register')


class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user:
                token, create = Token.objects.get_or_create(user=user)
                login(request, user)
                return Response({'token': token.key, 'user_id':user.id })
            else:
                return Response({'error': "Invalid Credentials"})
        return Response(serializer.errors, status=400)



class UserUpdateView(generics.RetrieveUpdateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user



@api_view(['POST'])
def UserLogoutAPIView(request):
    logout(request)
    return Response('User Logged Out.')

