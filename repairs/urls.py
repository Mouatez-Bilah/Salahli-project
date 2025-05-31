from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RepairSignupView, ClientSignupView, RepairListView,
    RepairRequestViewSet, RatingViewSet,
    RepairProfileDetailView, ClientProfileDetailView,
    request_password_reset, reset_password,
    new_password_view
)

router = DefaultRouter()
router.register(r'repair-requests', RepairRequestViewSet, basename='repairrequest')
router.register(r'ratings', RatingViewSet, basename='rating')

urlpatterns = [
    path('repair-signup/', RepairSignupView.as_view(), name='repair-signup'),
    path('client-signup/', ClientSignupView.as_view(), name='client-signup'),
    path('repairs/', RepairListView.as_view(), name='repair-list'),
    path('repair-profile/<str:pk>/', RepairProfileDetailView.as_view(), name='repair-profile-detail'),
    path('client-profile/<str:pk>/', ClientProfileDetailView.as_view(), name='client-profile-detail'),
    path('request-password-reset/', request_password_reset, name='request_password_reset'),
    path('reset-password/', reset_password, name='reset_password'),
    path('new-password/', new_password_view, name='new_password'),
    path('', include(router.urls)),
]
