from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import RecipeModel
from .serializers import RecipeSerializer
from django.core.exceptions import PermissionDenied
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def RecipeList(request):
    user_id = request.query_params.get('user_id')

    if user_id:
        recipes = RecipeModel.objects.filter(user_id=user_id).order_by('-id')
    else:
        recipes = RecipeModel.objects.all().order_by('-id')
    serializer = RecipeSerializer(recipes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def RecipeDetail(request, id):
    try:
        recipe = RecipeModel.objects.get(pk=id)

    except RecipeModel.DoesNotExist:
        return Response('Object Does not exist')
    
    serializer = RecipeSerializer(recipe)
    return Response(serializer.data)


class RecipeListCreateView(generics.ListCreateAPIView):
    queryset = RecipeModel.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecipeUpdateView(generics.UpdateAPIView):
    queryset = RecipeModel.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.user:
            raise PermissionDenied("You do not have permission to edit this recipe.")
        
        serializer.save()


class RecipeDeleteView(generics.DestroyAPIView):
    queryset = RecipeModel.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if self.request.user != instance.user:
            raise PermissionDenied("You do not have permission to delete this recipe.")
        instance.delete()