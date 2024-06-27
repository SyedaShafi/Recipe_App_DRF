from django.db import models

# Create your models here.
class ContactModel(models.Model):
    email = models.EmailField()
    message = models.TextField()
