from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import CommentModel
from .serializers import CommentSerializer
from django.core.exceptions import PermissionDenied
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def CommentList(request):
    recipe_id = request.query_params.get('recipe_id')
    if recipe_id:
        comments = CommentModel.objects.filter(recipe=recipe_id).order_by('-id')
    else:
        comments = CommentModel.objects.all().order_by('-id')
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def CommentDetail(request, id):
    try:
        recipe = CommentModel.objects.get(pk=id)

    except CommentModel.DoesNotExist:
        return Response('Object Does not exist')
    
    serializer = CommentSerializer(recipe)
    return Response(serializer.data)


class CommentListCreateView(generics.ListCreateAPIView):
    queryset = CommentModel.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentUpdateView(generics.UpdateAPIView):
    queryset = CommentModel.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.user:
            raise PermissionDenied("You do not have permission to edit this recipe.")
        
        serializer.save()


class CommentDeleteView(generics.DestroyAPIView):
    queryset = CommentModel.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if self.request.user != instance.user:
            raise PermissionDenied("You do not have permission to delete this recipe.")
        instance.delete()