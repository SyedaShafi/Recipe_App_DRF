from rest_framework import serializers
from . import models

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CommentModel
        fields = '__all__'

   