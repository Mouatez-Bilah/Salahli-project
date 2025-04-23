from rest_framework import viewsets, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django_filters import rest_framework as django_filters
from django.db.models import Avg, Q
from .models import User, RepairProfile, ClientProfile, RepairRequest, Rating
from .serializers import (
    UserSerializer, RepairSignupSerializer, ClientSignupSerializer,
    RepairRequestSerializer, RepairRequestCreateSerializer, RepairRequestUpdateSerializer,
    RatingSerializer
)
import logging

logger = logging.getLogger(__name__)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class RepairFilter(django_filters.FilterSet):
    skills = django_filters.CharFilter(field_name='repair_profile__skills', lookup_expr='icontains')
    min_rating = django_filters.NumberFilter(field_name='repair_profile__average_rating', lookup_expr='gte')
    search = django_filters.CharFilter(method='search_filter')
    
    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(username__icontains=value) | 
            Q(repair_profile__skills__icontains=value)
        )
    
    class Meta:
        model = User
        fields = ['skills', 'min_rating', 'search']

class IsRepair(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'repair'

class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'client'

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.client == request.user

class RepairSignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RepairSignupSerializer
    permission_classes = [permissions.AllowAny]

class ClientSignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = ClientSignupSerializer
    permission_classes = [permissions.AllowAny]

class RepairListView(generics.ListAPIView):
    queryset = User.objects.filter(user_type='repair').select_related('repair_profile')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [django_filters.DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = RepairFilter
    ordering_fields = ['repair_profile__average_rating']
    ordering = ['-repair_profile__average_rating']
    pagination_class = StandardResultsSetPagination

class RepairRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return RepairRequest.objects.none()
        if user.user_type == 'client':
            return RepairRequest.objects.filter(client=user).select_related('repair', 'client')
        else:  # repair
            return RepairRequest.objects.filter(repair=user).select_related('repair', 'client')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RepairRequestCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return RepairRequestUpdateSerializer
        return RepairRequestSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsClient()]
        elif self.action in ['update', 'partial_update']:
            return [IsAuthenticated(), IsRepair()]
        return [IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):
        logger.info(f"New repair request created by user {request.user.id}")
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error creating repair request: {str(e)}")
            return Response({"error": "An error occurred while creating the repair request"}, status=400)

class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated, IsClient]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Rating.objects.none()
        return Rating.objects.filter(client=self.request.user).select_related('repair')
