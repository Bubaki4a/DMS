"""
Permissions App Models - Role-based access control
"""
from django.db import models
from django.contrib.auth.models import Permission
from django.utils.translation import gettext_lazy as _
from apps.users.models import User
from apps.documents.models import Document


class DocumentPermission(models.Model):
    """Define who can access which documents"""
    PERMISSION_TYPES = (
        ('view', _('View')),
        ('edit', _('Edit')),
        ('delete', _('Delete')),
        ('approve', _('Approve')),
        ('share', _('Share')),
    )
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='permissions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='document_permissions', null=True, blank=True)
    group = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text="Group name like 'Class 10A', 'Math Teachers', etc."
    )
    permission_type = models.CharField(max_length=20, choices=PERMISSION_TYPES)
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='granted_permissions')
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True, help_text="Permission expiry date")
    
    class Meta:
        verbose_name = "Document Permission"
        verbose_name_plural = "Document Permissions"
        unique_together = [['document', 'user', 'permission_type']]
        indexes = [
            models.Index(fields=['document', 'permission_type']),
            models.Index(fields=['user', 'permission_type']),
        ]
    
    def __str__(self):
        return f"{self.document.title} - {self.user} - {self.permission_type}"
    
    def is_expired(self):
        """Check if permission has expired"""
        from django.utils import timezone
        if self.expires_at and self.expires_at < timezone.now():
            return True
        return False


class RolePermission(models.Model):
    """Define default permissions for each role"""
    ROLES = (
        ('admin', _('Administrator')),
        ('teacher', _('Teacher')),
        ('student', _('Student')),
    )
    
    ACTION_CHOICES = (
        ('upload_document', _('Upload Document')),
        ('download_document', _('Download Document')),
        ('edit_document', _('Edit Document')),
        ('delete_document', _('Delete Document')),
        ('approve_document', _('Approve Document')),
        ('view_audit_log', _('View Audit Log')),
        ('manage_users', _('Manage Users')),
        ('share_document', _('Share Document')),
        ('view_all_documents', _('View All Documents')),
    )
    
    role = models.CharField(max_length=20, choices=ROLES)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    
    class Meta:
        unique_together = [['role', 'action']]
        verbose_name = "Role Permission"
        verbose_name_plural = "Role Permissions"
    
    def __str__(self):
        return f"{self.get_role_display()} - {self.get_action_display()}"


class DepartmentPermission(models.Model):
    """Define permissions at department level"""
    department = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='department_permissions')
    can_view = models.BooleanField(default=True)
    can_upload = models.BooleanField(default=False)
    can_approve = models.BooleanField(default=False)
    
    class Meta:
        unique_together = [['department', 'user']]
    
    def __str__(self):
        return f"{self.department} - {self.user}"
