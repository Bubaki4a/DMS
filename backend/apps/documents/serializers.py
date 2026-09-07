"""
Serializers for Documents App
"""
from rest_framework import serializers
from .models import Document, DocumentVersion, Category, DocumentTag, DocumentAccess


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category"""
    document_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'document_count']
    
    def get_document_count(self, obj):
        return obj.documents.filter(is_active=True).count()


class DocumentTagSerializer(serializers.ModelSerializer):
    """Serializer for DocumentTag"""
    class Meta:
        model = DocumentTag
        fields = ['id', 'name']


class DocumentVersionSerializer(serializers.ModelSerializer):
    """Serializer for Document Version"""
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    file_name = serializers.SerializerMethodField()
    
    class Meta:
        model = DocumentVersion
        fields = [
            'id', 'version_number', 'file', 'file_name', 'file_size',
            'uploaded_by', 'uploaded_by_name', 'uploaded_at',
            'change_description', 'download_count'
        ]
        read_only_fields = ['file_size', 'download_count']
    
    def get_file_name(self, obj):
        return obj.file.name.split('/')[-1]


class DocumentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for document lists"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = DocumentTagSerializer(many=True, read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    current_file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'category', 'category_name', 'tags',
            'status', 'created_at', 'updated_at', 'uploaded_by',
            'uploaded_by_name', 'current_version', 'download_count',
            'department', 'subject', 'current_file_url'
        ]
    
    def get_current_file_url(self, obj):
        current_file = obj.get_current_file()
        if current_file and current_file.file:
            return current_file.file.url
        return None


class DocumentDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for document with versions"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = DocumentTagSerializer(many=True, read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    versions = DocumentVersionSerializer(many=True, read_only=True)
    current_file = serializers.SerializerMethodField()
    access_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'tags', 'status', 'created_at', 'updated_at', 'uploaded_by',
            'uploaded_by_name', 'current_version', 'versions', 'download_count',
            'department', 'subject', 'current_file', 'access_count'
        ]
        read_only_fields = [
            'created_at', 'updated_at', 'current_version', 'download_count'
        ]
    
    def get_current_file(self, obj):
        current_file = obj.get_current_file()
        if current_file:
            return DocumentVersionSerializer(current_file).data
        return None
    
    def get_access_count(self, obj):
        return obj.accesses.count()


class DocumentCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating documents"""
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=DocumentTag.objects.all(),
        many=True,
        write_only=True,
        required=False
    )
    file = serializers.FileField(required=False)
    
    class Meta:
        model = Document
        fields = [
            'title', 'description', 'category', 'tag_ids', 'file',
            'department', 'subject'
        ]
    
    def create(self, validated_data):
        tag_ids = validated_data.pop('tag_ids', [])
        file = validated_data.pop('file', None)
        
        document = Document.objects.create(**validated_data)
        
        # Add tags
        document.tags.set(tag_ids)
        
        # Create first version if file provided
        if file:
            DocumentVersion.objects.create(
                document=document,
                file=file,
                version_number=1,
                uploaded_by=validated_data['uploaded_by'],
                file_size=file.size
            )
        
        return document


class DocumentAccessSerializer(serializers.ModelSerializer):
    """Serializer for Document Access tracking"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    document_title = serializers.CharField(source='document.title', read_only=True)
    access_type_display = serializers.CharField(source='get_access_type_display', read_only=True)
    
    class Meta:
        model = DocumentAccess
        fields = [
            'id', 'document', 'document_title', 'user', 'user_name',
            'access_type', 'access_type_display', 'accessed_at', 'ip_address'
        ]
        read_only_fields = ['accessed_at']
