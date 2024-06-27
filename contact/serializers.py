from rest_framework import serializers
from . models import ContactModel

class ContactSerializers(serializers.ModelSerializer):
    class Meta:
        model = ContactModel
        fields = '__all__'
        