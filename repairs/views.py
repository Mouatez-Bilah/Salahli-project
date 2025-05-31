from rest_framework import viewsets, generics, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django_filters import rest_framework as django_filters
from django.db.models import Avg, Q
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from .models import User, RepairProfile, ClientProfile, RepairRequest, Rating
from .serializers import (
    UserSerializer, RepairSignupSerializer, ClientSignupSerializer,
    RepairRequestSerializer, RepairRequestCreateSerializer, RepairRequestUpdateSerializer,
    RatingSerializer, RepairProfileSerializer, RepairProfileUpdateSerializer,
    ClientProfileSerializer, ClientProfileUpdateSerializer
)
import logging
from django.shortcuts import render

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

class RepairProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = RepairProfile.objects.all().select_related('user')
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return RepairProfileSerializer
        return RepairProfileUpdateSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            # Only the owner can update their profile
            return [IsAuthenticated(), IsRepair()]
        return [IsAuthenticated()]
    
    def get_object(self):
        if self.kwargs.get('pk') == 'me' and self.request.user.user_type == 'repair':
            # Special case for /repair-profile/me/
            return self.request.user.repair_profile
        return super().get_object()

class ClientProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = ClientProfile.objects.all().select_related('user')
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ClientProfileSerializer
        return ClientProfileUpdateSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            # Only the owner can update their profile
            return [IsAuthenticated(), IsClient()]
        return [IsAuthenticated()]
    
    def get_object(self):
        if self.kwargs.get('pk') == 'me' and self.request.user.user_type == 'client':
            # Special case for /client-profile/me/
            return self.request.user.client_profile
        return super().get_object()

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
            # Validate image size
            image = request.FILES.get('image')
            if image and image.size > 5 * 1024 * 1024:  # 5MB limit
                return Response(
                    {"error": "Image size must be less than 5MB"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate repair user exists and is a repair type
            repair_id = request.data.get('repair')
            try:
                repair_user = User.objects.get(id=repair_id, user_type='repair')
            except User.DoesNotExist:
                return Response(
                    {"error": "Invalid repair user ID"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error creating repair request: {str(e)}")
            return Response(
                {"error": "An error occurred while creating the repair request"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            new_status = request.data.get('status')
            
            # Validate status transition
            if new_status:
                if instance.status == 'pending' and new_status not in ['accepted', 'rejected']:
                    return Response(
                        {"error": "Pending requests can only be accepted or rejected"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                elif instance.status != 'pending':
                    return Response(
                        {"error": "Cannot change status of non-pending requests"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            return super().update(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error updating repair request: {str(e)}")
            return Response(
                {"error": "An error occurred while updating the repair request"},
                status=status.HTTP_400_BAD_REQUEST
            )

class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated, IsClient]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Rating.objects.none()
        return Rating.objects.filter(client=self.request.user).select_related('repair')
    
    def create(self, request, *args, **kwargs):
        try:
            repair_id = request.data.get('repair')
            
            # Validate repair user exists and is a repair type
            try:
                repair_user = User.objects.get(id=repair_id, user_type='repair')
            except User.DoesNotExist:
                return Response(
                    {"error": "Invalid repair user ID"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if rating already exists
            if Rating.objects.filter(client=request.user, repair=repair_user).exists():
                return Response(
                    {"error": "You have already rated this repair person"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if there's a completed repair request
            if not RepairRequest.objects.filter(
                client=request.user,
                repair=repair_user,
                status='accepted'
            ).exists():
                return Response(
                    {"error": "You can only rate repair persons who have completed your requests"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error creating rating: {str(e)}")
            return Response(
                {"error": "An error occurred while creating the rating"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            
            # Validate rating value
            value = request.data.get('value')
            if value and (value < 1 or value > 5):
                return Response(
                    {"error": "Rating value must be between 1 and 5"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return super().update(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error updating rating: {str(e)}")
            return Response(
                {"error": "An error occurred while updating the rating"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_password_reset(request):
    email_or_phone = request.data.get('email_or_phone')
    if not email_or_phone:
        return Response({'error': 'Email or phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Try to find user by email or phone
        user = User.objects.get(Q(email=email_or_phone) | Q(phone_number=email_or_phone))
        
        # Generate token
        token = default_token_generator.make_token(user)
        
        # Store token in user's session or database
        user.password_reset_token = token
        user.save()
        
        # Send email with reset link
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{token}"
        try:
            send_mail(
                'Password Reset Request',
                f'Click the following link to reset your password: {reset_link}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            return Response({'message': 'Password reset instructions sent to your email'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error sending password reset email: {str(e)}")
            return Response({'error': 'Failed to send password reset email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except User.DoesNotExist:
        # Don't reveal whether the email/phone exists
        return Response({'message': 'If an account exists with this email/phone, you will receive password reset instructions'}, 
                       status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in password reset request: {str(e)}")
        return Response({'error': 'An error occurred while processing your request'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reset_password(request):
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    if not token or not new_password:
        return Response({'error': 'Token and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 8:
        return Response({'error': 'Password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(password_reset_token=token)
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.password_reset_token = None  # Clear the token
            user.save()
            return Response({'message': 'Password has been reset successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error in password reset: {str(e)}")
        return Response({'error': 'An error occurred while resetting your password'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def new_password_view(request):
    return render(request, 'frontend/newpass/index.html')
