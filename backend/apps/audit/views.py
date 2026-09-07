"""
Serializers and Views for Audit App
"""
from rest_framework import serializers, viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import AuditLog, SecurityEvent
from apps.permissions.permissions import IsAdmin


class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_name', 'action', 'action_display', 'object_type',
            'object_id', 'object_name', 'ip_address', 'status', 'status_display',
            'details', 'timestamp'
        ]


class SecurityEventSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    
    class Meta:
        model = SecurityEvent
        fields = [
            'id', 'event_type', 'event_type_display', 'user', 'user_name',
            'ip_address', 'description', 'severity', 'severity_display',
            'timestamp', 'resolved'
        ]


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Audit Logs - read only for admins"""
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['action', 'user', 'object_type', 'status']
    search_fields = ['user__username', 'object_name', 'ip_address']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
    def get_queryset(self):
        """Filter based on role"""
        if self.request.user.role == 'admin':
            return AuditLog.objects.all()
        return AuditLog.objects.none()


class SecurityEventViewSet(viewsets.ModelViewSet):
    """ViewSet for Security Events"""
    queryset = SecurityEvent.objects.all()
    serializer_class = SecurityEventSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['event_type', 'severity', 'resolved']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
