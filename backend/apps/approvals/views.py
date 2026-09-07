"""
Views and Serializers for Approvals App
"""
from rest_framework import serializers, viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from .models import ApprovalWorkflow, ApprovalStep, ApprovalComment
from apps.audit.models import AuditLog


class ApprovalStepSerializer(serializers.ModelSerializer):
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = ApprovalStep
        fields = ['id', 'step_number', 'required_role', 'status', 'approved_by', 'approved_by_name', 'approved_at']


class ApprovalCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = ApprovalComment
        fields = ['id', 'user', 'user_name', 'comment', 'created_at']


class ApprovalWorkflowSerializer(serializers.ModelSerializer):
    document_title = serializers.CharField(source='document.title', read_only=True)
    submitted_by_name = serializers.CharField(source='submitted_by.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    rejected_by_name = serializers.CharField(source='rejection_by.get_full_name', read_only=True)
    steps = ApprovalStepSerializer(many=True, read_only=True)
    comments = ApprovalCommentSerializer(many=True, read_only=True)
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = ApprovalWorkflow
        fields = [
            'id', 'document', 'document_title', 'status', 'submitted_by',
            'submitted_by_name', 'submitted_at', 'approved_by', 'approved_by_name',
            'approved_at', 'rejection_reason', 'rejected_by', 'rejected_by_name',
            'rejected_at', 'expires_at', 'is_expired', 'comments', 'steps'
        ]
    
    def get_is_expired(self, obj):
        return obj.is_expired()


class ApprovalWorkflowViewSet(viewsets.ModelViewSet):
    """ViewSet for Document Approvals"""
    queryset = ApprovalWorkflow.objects.all()
    serializer_class = ApprovalWorkflowSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'submitted_by']
    ordering_fields = ['submitted_at']
    ordering = ['-submitted_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return ApprovalWorkflow.objects.all()
        else:
            return ApprovalWorkflow.objects.filter(submitted_by=user)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a document"""
        workflow = self.get_object()
        
        if workflow.status != 'pending':
            return Response({'error': 'Cannot approve a non-pending workflow'}, status=status.HTTP_400_BAD_REQUEST)
        
        workflow.status = 'approved'
        workflow.approved_by = request.user
        workflow.approved_at = timezone.now()
        workflow.save()
        
        # Update document status
        workflow.document.status = 'approved'
        workflow.document.save()
        
        # Log audit
        AuditLog.objects.create(
            user=request.user,
            action='document_approve',
            object_type='Document',
            object_id=workflow.document.id,
            details={'title': workflow.document.title}
        )
        
        return Response(ApprovalWorkflowSerializer(workflow).data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a document"""
        workflow = self.get_object()
        reason = request.data.get('reason', '')
        
        if workflow.status != 'pending':
            return Response({'error': 'Cannot reject a non-pending workflow'}, status=status.HTTP_400_BAD_REQUEST)
        
        workflow.status = 'rejected'
        workflow.rejection_reason = reason
        workflow.rejection_by = request.user
        workflow.rejected_at = timezone.now()
        workflow.save()
        
        # Update document status
        workflow.document.status = 'rejected'
        workflow.document.save()
        
        # Log audit
        AuditLog.objects.create(
            user=request.user,
            action='document_reject',
            object_type='Document',
            object_id=workflow.document.id,
            details={'title': workflow.document.title, 'reason': reason}
        )
        
        return Response(ApprovalWorkflowSerializer(workflow).data)
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Add a comment to the approval workflow"""
        workflow = self.get_object()
        comment_text = request.data.get('comment', '')
        
        if not comment_text:
            return Response({'error': 'Comment is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        comment = ApprovalComment.objects.create(
            workflow=workflow,
            user=request.user,
            comment=comment_text
        )
        
        return Response(ApprovalCommentSerializer(comment).data)
