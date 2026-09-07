"""
Middleware for automatic audit logging
"""
from .models import AuditLog
import logging

logger = logging.getLogger('apps.audit')


class AuditMiddleware:
    """Log user actions automatically"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Log specific endpoints
        if self.should_log(request):
            self.log_action(request, response)
        
        return response
    
    def should_log(self, request):
        """Check if this request should be logged"""
        if not request.user.is_authenticated:
            return False
        
        # Log POST, PUT, DELETE operations
        if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
            return True
        
        # Log download/access
        if '/download/' in request.path:
            return True
        
        return False
    
    def log_action(self, request, response):
        """Create audit log entry"""
        try:
            path_parts = request.path.split('/')
            action = self.get_action_from_request(request)
            
            AuditLog.objects.create(
                user=request.user if request.user.is_authenticated else None,
                action=action,
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                status='success' if response.status_code < 400 else 'failure',
                details={
                    'path': request.path,
                    'method': request.method,
                    'status_code': response.status_code,
                }
            )
        except Exception as e:
            logger.error(f"Error logging audit: {e}")
    
    def get_action_from_request(self, request):
        """Determine action from request"""
        path = request.path
        method = request.method
        
        if '/documents/' in path:
            if method == 'POST':
                return 'document_upload'
            elif method == 'DELETE':
                return 'document_delete'
            elif '/download/' in path:
                return 'document_download'
            elif method in ['PUT', 'PATCH']:
                return 'document_edit'
        
        return 'action'
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
