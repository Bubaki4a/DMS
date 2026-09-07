"""
Admin configuration for Documents App
"""
from django.contrib import admin
from .models import Document, DocumentVersion, Category, DocumentTag, DocumentAccess


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(DocumentTag)
class DocumentTagAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'status', 'uploaded_by', 'created_at', 'download_count']
    list_filter = ['status', 'category', 'created_at', 'department']
    search_fields = ['title', 'description', 'department']
    readonly_fields = ['created_at', 'updated_at', 'download_count', 'current_version']
    filter_horizontal = ['tags']


@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ['document', 'version_number', 'uploaded_by', 'uploaded_at']
    list_filter = ['uploaded_at', 'document__category']
    search_fields = ['document__title']
    readonly_fields = ['uploaded_at', 'file_size', 'file_hash']


@admin.register(DocumentAccess)
class DocumentAccessAdmin(admin.ModelAdmin):
    list_display = ['user', 'document', 'access_type', 'accessed_at']
    list_filter = ['access_type', 'accessed_at']
    search_fields = ['user__username', 'document__title']
    readonly_fields = ['accessed_at']
