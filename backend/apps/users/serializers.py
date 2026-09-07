"""
Serializers for Users App
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, UserActivity, UserRole


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'role_display', 'department', 'is_approved',
            'is_active', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'password', 'password2', 'role', 'department'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError(
                {"password": "Passwords must match."}
            )
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed user serializer with additional information"""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    activity_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'role_display', 'department', 'is_approved', 'is_active',
            'date_joined', 'last_login', 'last_login_ip', 'activity_count'
        ]
    
    def get_activity_count(self, obj):
        return obj.activities.count()


class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer for User Activity"""
    user = serializers.StringRelatedField(read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = UserActivity
        fields = [
            'id', 'user', 'action', 'action_display', 'timestamp',
            'ip_address', 'details'
        ]
        read_only_fields = ['timestamp']


class UserApprovalSerializer(serializers.ModelSerializer):
    """Serializer for user approval operations"""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'role_display', 'department', 'is_approved'
        ]
        read_only_fields = ['username', 'email', 'first_name', 'last_name', 'department']
