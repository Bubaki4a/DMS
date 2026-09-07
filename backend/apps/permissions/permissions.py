"""
Custom permission classes for role-based access control
"""
from rest_framework import permissions
from apps.users.models import UserRole


class IsAuthenticated(permissions.IsAuthenticated):
    """User must be authenticated"""
    pass


class IsAdmin(permissions.BasePermission):
    """User must be an admin"""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == UserRole.ADMIN
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """Only admins can edit, everyone can read"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == UserRole.ADMIN
        )


class CanAccessDocument(permissions.BasePermission):
    """Check if user has permission to access document"""
    def has_object_permission(self, request, view, obj):
        # Admins can access everything
        if request.user.role == UserRole.ADMIN:
            return True
        
        # Document owner can access
        if obj.uploaded_by == request.user:
            return True
        
        # Approved public documents - everyone can view
        if obj.status == 'approved':
            return True
        
        # Check department access
        if obj.department == request.user.department:
            return True
        
        # Check specific permissions
        from .models import DocumentPermission
        return DocumentPermission.objects.filter(
            document=obj,
            user=request.user,
            permission_type__in=['view', 'edit']
        ).exists()


class CanEditDocument(permissions.BasePermission):
    """Check if user can edit document"""
    def has_object_permission(self, request, view, obj):
        if request.user.role == UserRole.ADMIN:
            return True
        
        if obj.uploaded_by == request.user:
            return True
        
        from .models import DocumentPermission
        return DocumentPermission.objects.filter(
            document=obj,
            user=request.user,
            permission_type='edit'
        ).exists()


class CanApproveDocument(permissions.BasePermission):
    """Check if user can approve documents"""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [UserRole.ADMIN, UserRole.TEACHER]
        )
    
    def has_object_permission(self, request, view, obj):
        # Only admins and teachers can approve
        if request.user.role not in [UserRole.ADMIN, UserRole.TEACHER]:
            return False
        
        # Teacher can approve their own documents
        if request.user.role == UserRole.TEACHER and obj.uploaded_by == request.user:
            return True
        
        # Admin can approve anything
        if request.user.role == UserRole.ADMIN:
            return True
        
        # Check specific approval permission
        from .models import DocumentPermission
        return DocumentPermission.objects.filter(
            document=obj,
            user=request.user,
            permission_type='approve'
        ).exists()
