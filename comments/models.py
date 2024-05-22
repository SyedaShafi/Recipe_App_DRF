from django.db import models
from user_accounts.models import UserModel
from recipes.models import RecipeModel
# Create your models here.

STAR_CHOICES = [
    ('⭐', '⭐'),
    ('⭐⭐', '⭐⭐'),
    ('⭐⭐⭐', '⭐⭐⭐'),
    ('⭐⭐⭐⭐', '⭐⭐⭐⭐'),
    ('⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'),
]

class CommentModel(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    recipe = models.ForeignKey(RecipeModel, on_delete=models.CASCADE)
    rating = models.CharField(choices=STAR_CHOICES, max_length=20)
    body = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
