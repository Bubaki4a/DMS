"""
Views for Permissions App
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import DocumentPermission, RolePermission, DepartmentPermission
from .serializers import (
    DocumentPermissionSerializer, RolePermissionSerializer,
    DepartmentPermissionSerializer
)
from .permissions import IsAdmin


class DocumentPermissionViewSet(viewsets.ModelViewSet):
    """ViewSet for Document Permissions"""
    queryset = DocumentPermission.objects.all()
    serializer_class = DocumentPermissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = ['django_filters.rest_framework.DjangoFilterBackend']
    filterset_fields = ['document', 'user', 'permission_type']
    
    def create(self, request, *args, **kwargs):
        """Grant permission to a user for a document"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['granted_by'] = request.user
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RolePermissionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Role Permissions (read-only)"""
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['role', 'action']


class DepartmentPermissionViewSet(viewsets.ModelViewSet):
    """ViewSet for Department Permissions"""
    queryset = DepartmentPermission.objects.all()
    serializer_class = DepartmentPermissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filterset_fields = ['department', 'user']


class PermissionCheckViewSet(viewsets.ViewSet):
    """Check user permissions"""
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def check_access(self, request):
        """Check if user can access a document"""
        document_id = request.data.get('document_id')
        permission_type = request.data.get('permission_type', 'view')
        
        if not document_id:
            return Response({'error': 'document_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            from apps.documents.models import Document
            document = Document.objects.get(id=document_id)
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check permissions
        has_access = self._check_document_permission(request.user, document, permission_type)
        
        return Response({'has_access': has_access, 'permission_type': permission_type})
    
    def _check_document_permission(self, user, document, permission_type):
        """Helper to check document permission"""
        from apps.users.models import UserRole
        
        # Admin has all permissions
        if user.role == UserRole.ADMIN:
            return True
        
        # Owner has all permissions
        if document.uploaded_by == user:
            return True
        
        # Approved documents - everyone can view
        if permission_type == 'view' and document.status == 'approved':
            return True
        
        # Check department access
        if document.department == user.department and permission_type in ['view', 'download']:
            return True
        
        # Check explicit permissions
        return DocumentPermission.objects.filter(
            document=document,
            user=user,
            permission_type=permission_type
        ).filter(expires_at__isnull=True) | DocumentPermission.objects.filter(
            document=document,
            user=user,
            permission_type=permission_type,
            expires_at__gt=timezone.now()
        ).exists()
