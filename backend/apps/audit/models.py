"""
Audit App Models - Audit logging for all critical actions
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.models import User


class AuditLog(models.Model):
    """Comprehensive audit logging"""
    ACTION_CHOICES = (
        ('user_login', _('User Login')),
        ('user_logout', _('User Logout')),
        ('user_created', _('User Created')),
        ('user_approved', _('User Approved')),
        ('user_rejected', _('User Rejected')),
        ('document_upload', _('Document Upload')),
        ('document_download', _('Document Download')),
        ('document_view', _('Document View')),
        ('document_edit', _('Document Edit')),
        ('document_delete', _('Document Delete')),
        ('version_upload', _('Version Upload')),
        ('version_restore', _('Version Restore')),
        ('document_approve', _('Document Approve')),
        ('document_reject', _('Document Reject')),
        ('permission_grant', _('Permission Grant')),
        ('permission_revoke', _('Permission Revoke')),
        ('setting_change', _('Setting Change')),
    )
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    object_type = models.CharField(max_length=50, default='Document')
    object_id = models.IntegerField(null=True, blank=True)
    object_name = models.CharField(max_length=500, blank=True)
    
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    status = models.CharField(
        max_length=20,
        choices=(
            ('success', _('Success')),
            ('failure', _('Failure')),
            ('warning', _('Warning')),
        ),
        default='success'
    )
    
    details = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['action', '-timestamp']),
            models.Index(fields=['object_type', 'object_id']),
            models.Index(fields=['-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.action} - {self.timestamp}"


class SecurityEvent(models.Model):
    """Log security-related events"""
    EVENT_TYPES = (
        ('failed_login', _('Failed Login Attempt')),
        ('suspicious_activity', _('Suspicious Activity')),
        ('permission_denied', _('Permission Denied')),
        ('file_access_denied', _('File Access Denied')),
        ('invalid_token', _('Invalid Token')),
        ('unusual_download', _('Unusual Download')),
    )
    
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='security_events')
    ip_address = models.GenericIPAddressField()
    description = models.TextField()
    severity = models.CharField(
        max_length=20,
        choices=(
            ('low', _('Low')),
            ('medium', _('Medium')),
            ('high', _('High')),
            ('critical', _('Critical')),
        ),
        default='medium'
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['event_type', '-timestamp']),
            models.Index(fields=['severity', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.event_type} - {self.timestamp}"
