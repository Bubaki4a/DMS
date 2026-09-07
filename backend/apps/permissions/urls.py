"""
URLs for Permissions App
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DocumentPermissionViewSet, RolePermissionViewSet,
    DepartmentPermissionViewSet, PermissionCheckViewSet
)

router = DefaultRouter()
router.register(r'document', DocumentPermissionViewSet, basename='document-permission')
router.register(r'role', RolePermissionViewSet, basename='role-permission')
router.register(r'department', DepartmentPermissionViewSet, basename='department-permission')
router.register(r'check', PermissionCheckViewSet, basename='permission-check')

urlpatterns = [
    path('', include(router.urls)),
]
