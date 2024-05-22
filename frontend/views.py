from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'index.html')


def user_signup(request):
    return render(request, 'signup.html')

def user_login(request):
    return render(request, 'login.html')

def user_profile(request):
    return render(request, 'profile.html')

def add_recipe(request):
    return render(request, 'add_recipe.html')

def recipe_details(request):
    return render(request, 'recipe_details.html')
