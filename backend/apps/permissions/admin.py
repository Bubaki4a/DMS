"""
Admin for Permissions App
"""
from django.contrib import admin
from .models import DocumentPermission, RolePermission, DepartmentPermission


@admin.register(DocumentPermission)
class DocumentPermissionAdmin(admin.ModelAdmin):
    list_display = ['document', 'user', 'permission_type', 'granted_at', 'expires_at']
    list_filter = ['permission_type', 'granted_at']
    search_fields = ['document__title', 'user__username']


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ['role', 'action']
    list_filter = ['role', 'action']


@admin.register(DepartmentPermission)
class DepartmentPermissionAdmin(admin.ModelAdmin):
    list_display = ['department', 'user', 'can_view', 'can_upload', 'can_approve']
    list_filter = ['department', 'can_view', 'can_upload', 'can_approve']
    search_fields = ['department', 'user__username']
