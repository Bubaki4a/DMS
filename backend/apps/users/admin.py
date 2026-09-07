"""
Admin configuration for Users App
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserActivity, UserRole


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin for User model"""
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'department', 'is_approved', 'last_login_ip', 'login_attempt_count')}),
    )
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_approved', 'is_active']
    list_filter = BaseUserAdmin.list_filter + ('role', 'is_approved', 'department')
    search_fields = BaseUserAdmin.search_fields + ('department',)


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    """Admin for User Activity"""
    list_display = ['user', 'action', 'timestamp', 'ip_address']
    list_filter = ['action', 'timestamp', 'user']
    search_fields = ['user__username', 'ip_address']
    readonly_fields = ['user', 'action', 'timestamp', 'ip_address', 'details']
