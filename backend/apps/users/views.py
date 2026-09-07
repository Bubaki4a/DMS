"""
Views for Users App
"""
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from .models import User, UserActivity, UserRole
from .serializers import (
    UserSerializer, UserCreateSerializer, UserDetailSerializer,
    UserActivitySerializer, UserApprovalSerializer
)
from apps.permissions.permissions import IsAdmin, IsAdminOrReadOnly


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User management"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_approved', 'is_active', 'department']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'username']
    ordering = ['-date_joined']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action == 'retrieve' or self.action == 'partial_update':
            return UserDetailSerializer
        elif self.action == 'approve_user':
            return UserApprovalSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'register']:
            return [permissions.AllowAny()]
        elif self.action in ['list', 'retrieve', 'me', 'my_activities']:
            return [permissions.IsAuthenticated()]
        elif self.action in ['approve_user', 'reject_user', 'delete', 'update', 'partial_update']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):
        """Create a new user (registration)"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve_user(self, request, pk=None):
        """Approve a user account"""
        user = self.get_object()
        user.is_approved = True
        user.save()
        
        # Log activity
        UserActivity.objects.create(
            user=request.user,
            action='approve',
            details={'approved_user_id': user.id, 'username': user.username}
        )
        
        return Response({'message': f'User {user.username} approved successfully'})
    
    @action(detail=True, methods=['post'])
    def reject_user(self, request, pk=None):
        """Reject a user account"""
        user = self.get_object()
        user.is_active = False
        user.save()
        
        # Log activity
        UserActivity.objects.create(
            user=request.user,
            action='reject',
            details={'rejected_user_id': user.id, 'username': user.username}
        )
        
        return Response({'message': f'User {user.username} rejected'})
    
    @action(detail=False, methods=['get'])
    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    def my_activities(self, request):
        """Get current user's activities"""
        activities = UserActivity.objects.filter(user=request.user).order_by('-timestamp')[:50]
        serializer = UserActivitySerializer(activities, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending_approvals(self, request):
        """Get list of users pending approval"""
        if not request.user.is_admin():
            return Response({'detail': 'Only admins can view pending approvals'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        pending_users = User.objects.filter(is_approved=False, role__in=[UserRole.TEACHER, UserRole.STUDENT])
        serializer = self.get_serializer(pending_users, many=True)
        return Response(serializer.data)


class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for User Activity (read-only)"""
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['user', 'action']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
