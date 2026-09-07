"""
Admin for Approvals App
"""
from django.contrib import admin
from .models import ApprovalWorkflow, ApprovalStep, ApprovalComment


@admin.register(ApprovalWorkflow)
class ApprovalWorkflowAdmin(admin.ModelAdmin):
    list_display = ['document', 'status', 'submitted_by', 'submitted_at']
    list_filter = ['status', 'submitted_at']
    search_fields = ['document__title', 'submitted_by__username']


@admin.register(ApprovalStep)
class ApprovalStepAdmin(admin.ModelAdmin):
    list_display = ['workflow', 'step_number', 'required_role', 'status']
    list_filter = ['required_role', 'status']


@admin.register(ApprovalComment)
class ApprovalCommentAdmin(admin.ModelAdmin):
    list_display = ['workflow', 'user', 'created_at']
    search_fields = ['user__username', 'comment']
