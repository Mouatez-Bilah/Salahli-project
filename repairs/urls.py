from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RepairSignupView, ClientSignupView, RepairListView,
    RepairRequestViewSet, RatingViewSet
)

router = DefaultRouter()
router.register(r'repair-requests', RepairRequestViewSet, basename='repairrequest')
router.register(r'ratings', RatingViewSet, basename='rating')

urlpatterns = [
    path('repair-signup/', RepairSignupView.as_view(), name='repair-signup'),
    path('client-signup/', ClientSignupView.as_view(), name='client-signup'),
    path('repairs/', RepairListView.as_view(), name='repair-list'),
    path('', include(router.urls)),
]
