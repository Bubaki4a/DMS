"""
Approvals App Models - Document approval workflow
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from apps.users.models import User
from apps.documents.models import Document


class ApprovalWorkflow(models.Model):
    """Define approval workflow for documents"""
    STATUS_CHOICES = (
        ('pending', _('Pending')),
        ('approved', _('Approved')),
        ('rejected', _('Rejected')),
        ('expired', _('Expired')),
    )
    
    document = models.OneToOneField(Document, on_delete=models.CASCADE, related_name='approval')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    submitted_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='submitted_approvals')
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='approved_documents'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    
    rejection_reason = models.TextField(blank=True)
    rejection_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='rejected_documents'
    )
    rejected_at = models.DateTimeField(null=True, blank=True)
    
    expires_at = models.DateTimeField(null=True, blank=True, help_text="Approval expires after this date")
    
    comments = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['status', '-submitted_at']),
            models.Index(fields=['submitted_by', '-submitted_at']),
        ]
    
    def __str__(self):
        return f"{self.document.title} - {self.status}"
    
    def is_expired(self):
        """Check if approval has expired"""
        if self.expires_at and self.expires_at < timezone.now():
            return True
        return False


class ApprovalStep(models.Model):
    """Define individual approval steps in a workflow"""
    ROLE_CHOICES = (
        ('admin', _('Administrator')),
        ('teacher', _('Teacher')),
        ('department_head', _('Department Head')),
    )
    
    workflow = models.ForeignKey(ApprovalWorkflow, on_delete=models.CASCADE, related_name='steps')
    step_number = models.IntegerField()
    required_role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    status = models.CharField(
        max_length=20,
        choices=(
            ('pending', _('Pending')),
            ('approved', _('Approved')),
            ('rejected', _('Rejected')),
        ),
        default='pending'
    )
    
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='approval_steps'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['step_number']
        unique_together = [['workflow', 'step_number']]
    
    def __str__(self):
        return f"Step {self.step_number} - {self.get_required_role_display()}"


class ApprovalComment(models.Model):
    """Comments on approval process"""
    workflow = models.ForeignKey(ApprovalWorkflow, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user} - {self.workflow.document.title}"
