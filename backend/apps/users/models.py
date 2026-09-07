"""
Users App - User roles and authentication
"""
from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.utils.translation import gettext_lazy as _


class UserRole(models.TextChoices):
    """User roles in the system"""
    ADMIN = 'admin', _('Administrator')
    TEACHER = 'teacher', _('Teacher')
    STUDENT = 'student', _('Student')


class User(AbstractUser):
    """Extended user model with roles"""
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.STUDENT
    )
    department = models.CharField(
        max_length=255,
        blank=True,
        help_text="Department or class for organizing access"
    )
    is_approved = models.BooleanField(
        default=False,
        help_text="Whether the user account has been approved"
    )
    last_login_ip = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text="IP address of last login"
    )
    login_attempt_count = models.IntegerField(
        default=0,
        help_text="Failed login attempts counter"
    )
    
    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        ordering = ['-date_joined']
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['is_approved']),
            models.Index(fields=['department']),
        ]
    
    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
    
    def is_admin(self):
        return self.role == UserRole.ADMIN
    
    def is_teacher(self):
        return self.role == UserRole.TEACHER
    
    def is_student(self):
        return self.role == UserRole.STUDENT


class UserActivity(models.Model):
    """Track user activities for analytics"""
    ACTION_CHOICES = (
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('upload', 'Document Upload'),
        ('download', 'Document Download'),
        ('delete', 'Document Delete'),
        ('view', 'Document View'),
        ('approve', 'Document Approve'),
        ('reject', 'Document Reject'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    details = models.JSONField(default=dict, blank=True)
    
    class Meta:
        verbose_name = _("User Activity")
        verbose_name_plural = _("User Activities")
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['action', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.action} - {self.timestamp}"
