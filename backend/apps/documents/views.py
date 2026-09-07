"""
Views for Documents App
"""
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone

from .models import Document, DocumentVersion, Category, DocumentTag, DocumentAccess
from .serializers import (
    DocumentListSerializer, DocumentDetailSerializer, DocumentCreateUpdateSerializer,
    DocumentVersionSerializer, CategorySerializer, DocumentTagSerializer, DocumentAccessSerializer
)
from apps.permissions.permissions import IsAuthenticated, CanAccessDocument
from apps.audit.models import AuditLog


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class DocumentTagViewSet(viewsets.ModelViewSet):
    """ViewSet for Tags"""
    queryset = DocumentTag.objects.all()
    serializer_class = DocumentTagSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class DocumentViewSet(viewsets.ModelViewSet):
    """Main ViewSet for Documents with versioning support"""
    serializer_class = DocumentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'department', 'uploaded_by']
    search_fields = ['title', 'description', 'department', 'subject', 'tags__name']
    ordering_fields = ['created_at', 'title', 'download_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter documents based on user permissions"""
        user = self.request.user
        if user.is_admin():
            return Document.objects.filter(is_active=True)
        else:
            # Teachers and students see only their department docs and public docs
            return Document.objects.filter(
                Q(is_active=True),
                Q(uploaded_by=user) | Q(status='approved') | Q(department=user.department)
            )
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DocumentDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return DocumentCreateUpdateSerializer
        return DocumentListSerializer
    
    def create(self, request, *args, **kwargs):
        """Upload a new document"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Add uploaded_by before saving
        serializer.validated_data['uploaded_by'] = request.user
        document = serializer.save()
        
        # Log audit
        AuditLog.objects.create(
            user=request.user,
            action='document_upload',
            object_type='Document',
            object_id=document.id,
            details={'title': document.title, 'category': document.category.name}
        )
        
        return Response(
            DocumentDetailSerializer(document).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'], parser_classes=(MultiPartParser, FormParser))
    def upload_version(self, request, pk=None):
        """Upload a new version of a document"""
        document = self.get_object()
        file = request.FILES.get('file')
        change_description = request.data.get('change_description', '')
        
        if not file:
            return Response({'error': 'File is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        new_version = document.create_next_version(
            file=file,
            uploaded_by=request.user,
            change_description=change_description
        )
        
        # Log audit
        AuditLog.objects.create(
            user=request.user,
            action='version_upload',
            object_type='Document',
            object_id=document.id,
            details={
                'title': document.title,
                'version': new_version.version_number,
                'change_description': change_description
            }
        )
        
        return Response(DocumentVersionSerializer(new_version).data)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download the current version of a document"""
        document = self.get_object()
        current_file = document.get_current_file()
        
        if not current_file:
            return Response({'error': 'No file available'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check permissions (handled by CanAccessDocument)
        # Log access
        DocumentAccess.objects.create(
            document=document,
            version=current_file,
            user=request.user,
            access_type='download',
            ip_address=self.get_client_ip(request)
        )
        
        # Update download count
        document.download_count += 1
        current_file.download_count += 1
        document.save(update_fields=['download_count'])
        current_file.save(update_fields=['download_count'])
        
        # Log audit
        AuditLog.objects.create(
            user=request.user,
            action='document_download',
            object_type='Document',
            object_id=document.id,
            details={'title': document.title, 'version': current_file.version_number}
        )
        
        return Response({'file_url': current_file.file.url})
    
    @action(detail=True, methods=['get'])
    def version_history(self, request, pk=None):
        """Get version history of a document"""
        document = self.get_object()
        versions = document.versions.all()
        serializer = DocumentVersionSerializer(versions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def restore_version(self, request, pk=None):
        """Restore a previous version of a document"""
        document = self.get_object()
        version_number = request.data.get('version_number')
        
        if not version_number:
            return Response({'error': 'version_number is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            version = document.versions.get(version_number=version_number)
        except DocumentVersion.DoesNotExist:
            return Response({'error': 'Version not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create a new version with the old file
        new_version = document.create_next_version(
            file=version.file,
            uploaded_by=request.user,
            change_description=f"Restored from version {version_number}"
        )
        
        # Log audit
        AuditLog.objects.create(
            user=request.user,
            action='version_restore',
            object_type='Document',
            object_id=document.id,
            details={
                'title': document.title,
                'restored_from': version_number,
                'new_version': new_version.version_number
            }
        )
        
        return Response(DocumentVersionSerializer(new_version).data)
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
