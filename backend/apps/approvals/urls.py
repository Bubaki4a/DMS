"""
URLs for Approvals App
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApprovalWorkflowViewSet

router = DefaultRouter()
router.register(r'', ApprovalWorkflowViewSet, basename='approval-workflow')

urlpatterns = [
    path('', include(router.urls)),
]
