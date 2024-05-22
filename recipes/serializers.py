from rest_framework import serializers
from . import models

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RecipeModel
        fields = '__all__'

    def get_image_url(self, obj):
        return obj.image