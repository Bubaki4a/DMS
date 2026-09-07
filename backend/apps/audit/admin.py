"""
Admin for Audit App
"""
from django.contrib import admin
from .models import AuditLog, SecurityEvent


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'status', 'timestamp', 'ip_address']
    list_filter = ['action', 'status', 'timestamp']
    search_fields = ['user__username', 'object_name', 'ip_address']
    readonly_fields = ['timestamp']


@admin.register(SecurityEvent)
class SecurityEventAdmin(admin.ModelAdmin):
    list_display = ['event_type', 'severity', 'resolved', 'timestamp']
    list_filter = ['event_type', 'severity', 'resolved', 'timestamp']
    search_fields = ['user__username', 'ip_address', 'description']
