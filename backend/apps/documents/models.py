"""
Documents App Models - Core document management
"""
from django.db import models
from django.core.validators import FileExtensionValidator
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.contrib.postgres.search import SearchVectorField
from apps.users.models import User
import os
import hashlib


class Category(models.Model):
    """Document categories"""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class DocumentTag(models.Model):
    """Tags for documents"""
    name = models.CharField(max_length=100, unique=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Document(models.Model):
    """Main document model"""
    STATUS_CHOICES = (
        ('draft', _('Draft')),
        ('pending_approval', _('Pending Approval')),
        ('approved', _('Approved')),
        ('rejected', _('Rejected')),
        ('archived', _('Archived')),
    )
    
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='documents')
    tags = models.ManyToManyField(DocumentTag, related_name='documents', blank=True)
    
    uploaded_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='uploaded_documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    
    current_version = models.IntegerField(default=1)
    download_count = models.IntegerField(default=0)
    
    # Metadata
    department = models.CharField(
        max_length=255,
        blank=True,
        help_text="Department or class this document belongs to"
    )
    subject = models.CharField(
        max_length=255,
        blank=True,
        help_text="Subject matter of the document"
    )
    
    is_active = models.BooleanField(default=True)
    search_vector = SearchVectorField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['category']),
            models.Index(fields=['uploaded_by']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['department']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.title
    
    def get_current_file(self):
        """Get the current version file"""
        return self.versions.filter(version_number=self.current_version).first()
    
    def create_next_version(self, file, uploaded_by, change_description=""):
        """Create a new version of the document"""
        new_version_number = self.current_version + 1
        new_file = DocumentVersion.objects.create(
            document=self,
            file=file,
            version_number=new_version_number,
            uploaded_by=uploaded_by,
            change_description=change_description
        )
        self.current_version = new_version_number
        self.updated_at = timezone.now()
        self.save()
        return new_file


class DocumentVersion(models.Model):
    """Version history for documents"""
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField()
    
    file = models.FileField(
        upload_to='documents/%Y/%m/%d/',
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'rar']
            )
        ]
    )
    
    file_size = models.BigIntegerField(help_text="File size in bytes")
    file_hash = models.CharField(max_length=64, blank=True, help_text="SHA256 hash of file")
    
    uploaded_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='uploaded_versions')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    change_description = models.TextField(blank=True, help_text="Description of changes in this version")
    
    download_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-version_number']
        unique_together = [['document', 'version_number']]
        indexes = [
            models.Index(fields=['document', '-version_number']),
            models.Index(fields=['uploaded_at']),
        ]
    
    def __str__(self):
        return f"{self.document.title} - v{self.version_number}"
    
    def calculate_file_hash(self):
        """Calculate SHA256 hash of the file"""
        sha256_hash = hashlib.sha256()
        for chunk in self.file.chunks():
            sha256_hash.update(chunk)
        return sha256_hash.hexdigest()
    
    def save(self, *args, **kwargs):
        # Calculate file size
        if self.file:
            self.file_size = self.file.size
            if not self.file_hash:
                self.file_hash = self.calculate_file_hash()
        super().save(*args, **kwargs)


class DocumentAccess(models.Model):
    """Track who has accessed which documents"""
    ACCESS_TYPES = (
        ('view', _('View')),
        ('download', _('Download')),
        ('edit', _('Edit')),
    )
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='accesses')
    version = models.ForeignKey(DocumentVersion, on_delete=models.CASCADE, related_name='accesses')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='document_accesses')
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPES)
    accessed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        ordering = ['-accessed_at']
        indexes = [
            models.Index(fields=['document', '-accessed_at']),
            models.Index(fields=['user', '-accessed_at']),
            models.Index(fields=['access_type', '-accessed_at']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.access_type} - {self.document.title}"
