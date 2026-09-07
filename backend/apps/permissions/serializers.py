"""
Serializers for Permissions App
"""
from rest_framework import serializers
from .models import DocumentPermission, RolePermission, DepartmentPermission


class DocumentPermissionSerializer(serializers.ModelSerializer):
    """Serializer for Document Permissions"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    granted_by_name = serializers.CharField(source='granted_by.get_full_name', read_only=True)
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = DocumentPermission
        fields = [
            'id', 'document', 'user', 'user_name', 'group',
            'permission_type', 'granted_by', 'granted_by_name',
            'granted_at', 'expires_at', 'is_expired'
        ]
    
    def get_is_expired(self, obj):
        return obj.is_expired()


class RolePermissionSerializer(serializers.ModelSerializer):
    """Serializer for Role Permissions"""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = RolePermission
        fields = ['id', 'role', 'role_display', 'action', 'action_display']


class DepartmentPermissionSerializer(serializers.ModelSerializer):
    """Serializer for Department Permissions"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = DepartmentPermission
        fields = [
            'id', 'department', 'user', 'user_name',
            'can_view', 'can_upload', 'can_approve'
        ]
