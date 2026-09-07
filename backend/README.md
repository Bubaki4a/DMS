# Document Management System - Django Backend

A comprehensive Document Management System (DMS) for educational institutions with role-based access control, document versioning, approval workflow, and detailed audit logging.

## Features

### Core Functionality
- **Document Management**: Upload, categorize, tag, and search documents
- **Document Versioning**: Automatic version tracking with change history and rollback capability
- **Role-Based Access Control**: Admin, Teacher, and Student roles with granular permissions
- **Approval Workflow**: Multi-step document approval process
- **Audit Logging**: Comprehensive logging of all critical actions
- **File Security**: Secure file storage with hash verification

### User Management
- User registration and approval workflow
- Role-based authentication using JWT
- User activity tracking
- Department/Class-based access organization

### Document Features
- Multiple file format support
- File size and type validation
- Document tagging and categorization
- Search and filtering capabilities
- Download tracking
- Version restoration

### Security & Compliance
- JWT token-based authentication
- Role-based permission system
- Audit trail for all operations
- Security event logging
- IP address tracking
- Expired permission handling

## Technology Stack

- **Backend**: Django 4.2
- **API**: Django REST Framework
- **Database**: PostgreSQL
- **File Storage**: Local filesystem or AWS S3
- **Authentication**: Django JWT
- **Task Queue**: Celery (optional)
- **Caching**: Redis (optional)

## Installation & Setup

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- pip and virtualenv

### Step 1: Set Up Virtual Environment

```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On Linux/Mac
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Step 4: Create PostgreSQL Database

```bash
createdb dms_db
# Or using pgAdmin interface
```

### Step 5: Run Migrations

```bash
python manage.py migrate
```

### Step 6: Create Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

### Step 7: Load Initial Data (Optional)

```bash
python manage.py loaddata initial_categories
```

### Step 8: Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/token/` - Obtain JWT token
- `POST /api/auth/token/refresh/` - Refresh JWT token

### User Endpoints
- `GET /api/users/` - List all users (Admin only)
- `POST /api/users/` - Create new user (Register)
- `GET /api/users/me/` - Get current user profile
- `PUT /api/users/me/update_profile/` - Update profile
- `GET /api/users/{id}/` - Get user details
- `POST /api/users/{id}/approve_user/` - Approve user (Admin only)
- `POST /api/users/{id}/reject_user/` - Reject user (Admin only)
- `GET /api/users/pending_approvals/` - Get pending approvals (Admin only)

### Document Endpoints
- `GET /api/documents/` - List documents
- `POST /api/documents/` - Upload new document
- `GET /api/documents/{id}/` - Get document details
- `PUT /api/documents/{id}/` - Update document
- `DELETE /api/documents/{id}/` - Delete document
- `GET /api/documents/{id}/download/` - Download document
- `POST /api/documents/{id}/upload_version/` - Upload new version
- `GET /api/documents/{id}/version_history/` - Get version history
- `POST /api/documents/{id}/restore_version/` - Restore previous version
- `GET /api/documents/categories/` - List categories
- `GET /api/documents/tags/` - List tags

### Permission Endpoints
- `GET /api/permissions/document/` - List document permissions (Admin only)
- `POST /api/permissions/document/` - Grant permission (Admin only)
- `POST /api/permissions/check/check_access/` - Check access to document
- `GET /api/permissions/role/` - List role permissions
- `GET /api/permissions/department/` - List department permissions

### Approval Endpoints
- `GET /api/approvals/` - List approvals
- `POST /api/approvals/` - Create approval request
- `GET /api/approvals/{id}/` - Get approval details
- `POST /api/approvals/{id}/approve/` - Approve document
- `POST /api/approvals/{id}/reject/` - Reject document
- `POST /api/approvals/{id}/add_comment/` - Add comment

### Audit Endpoints
- `GET /api/audit/logs/` - List audit logs (Admin only)
- `GET /api/audit/security-events/` - List security events (Admin only)

## User Roles

### Administrator
- Full system access
- User management and approval
- Document approval authority
- Audit log access
- Permission management
- System settings

### Teacher
- Upload and manage documents
- Share documents with students
- Approve documents (if configured)
- View class/department documents
- Download documents
- View their own activity

### Student
- View approved documents
- Download documents
- View documents in their class/department
- Access shared documents
- Submit documents for approval

## Project Structure

```
backend/
├── dms/                          # Main Django project
│   ├── settings.py              # Django settings
│   ├── urls.py                  # URL routing
│   ├── wsgi.py                  # WSGI application
│   └── __init__.py
├── apps/                         # Django applications
│   ├── users/                   # User management
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── ...
│   ├── documents/               # Document management
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── ...
│   ├── permissions/             # Permission system
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── views.py
│   │   └── ...
│   ├── audit/                   # Audit logging
│   │   ├── models.py
│   │   ├── middleware.py
│   │   ├── views.py
│   │   └── ...
│   └── approvals/               # Approval workflow
│       ├── models.py
│       ├── views.py
│       └── ...
├── manage.py                    # Django management
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
└── README.md                    # This file
```

## Database Models

### User
- Extended Django User model
- Roles: Admin, Teacher, Student
- Department/Class field
- Approval status
- Login tracking

### Document
- Title, description, category, tags
- Version tracking
- Status workflow (draft → pending → approved/rejected)
- Access tracking
- Download counter

### DocumentVersion
- File storage
- Version number tracking
- Change history
- File integrity (SHA256 hash)
- Upload metadata

### DocumentPermission
- User/Group-based access control
- Permission types: view, edit, delete, approve, share
- Permission expiration

### AuditLog
- User action tracking
- Timestamp and IP address
- Object references
- Detailed JSON metadata

### ApprovalWorkflow
- Document approval state management
- Multi-step approval tracking
- Comments and feedback
- Expiration handling

## Security Features

1. **Authentication**: JWT tokens with configurable expiration
2. **Authorization**: Role and permission-based access control
3. **Audit Trail**: Comprehensive logging of all operations
4. **File Integrity**: SHA256 hashing of uploaded files
5. **Data Validation**: File type and size restrictions
6. **CORS Protection**: Configurable allowed origins
7. **SQL Injection Prevention**: Django ORM parameterized queries
8. **CSRF Protection**: Django middleware

## Common Tasks

### Create Initial Categories

```bash
python manage.py shell
```

```python
from apps.documents.models import Category

categories = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'History',
    'Literature',
    'Languages',
    'PE',
    'Art',
]

for cat in categories:
    Category.objects.create(name=cat)
```

### Export Audit Logs

```bash
python manage.py dumpdata apps.audit.AuditLog --format=json > audit_export.json
```

### Create Custom Permission

```python
from apps.permissions.models import DocumentPermission
from apps.users.models import User
from apps.documents.models import Document

doc = Document.objects.get(id=1)
user = User.objects.get(id=2)

DocumentPermission.objects.create(
    document=doc,
    user=user,
    permission_type='edit',
    granted_by=request.user
)
```

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
# Verify database credentials in .env
python manage.py dbshell
```

### Migration Issues
```bash
# Check migration status
python manage.py showmigrations

# Rollback specific migration
python manage.py migrate apps.documents 0001
```

### Static Files Issues
```bash
# Collect static files
python manage.py collectstatic --noinput
```

## Performance Optimization

1. **Database Indexing**: Models include relevant indexes
2. **Query Optimization**: Use `select_related()` and `prefetch_related()`
3. **Caching**: JWT token caching with Redis (optional)
4. **File Storage**: Configure S3 for scalable storage
5. **Pagination**: API responses paginated (default 20 per page)

## Deployment

### Production Checklist
1. Set `DEBUG=False` in settings
2. Configure secure `SECRET_KEY`
3. Set up HTTPS with SSL certificates
4. Configure allowed domains
5. Set up email backend
6. Configure database backups
7. Set up Gunicorn/uWSGI
8. Configure Nginx reverse proxy
9. Enable CSRF and CORS security
10. Set up monitoring and logging

### Example Deployment with Gunicorn

```bash
pip install gunicorn
gunicorn dms.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

## API Usage Examples

### Authentication

```bash
# Get token
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Use token
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/documents/
```

### Upload Document

```bash
curl -X POST http://localhost:8000/api/documents/ \
  -H "Authorization: Bearer TOKEN" \
  -F "title=My Document" \
  -F "category=1" \
  -F "file=@document.pdf"
```

### Approve Document

```bash
curl -X POST http://localhost:8000/api/approvals/1/approve/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

## Contributing

1. Follow Django/DRF best practices
2. Write tests for new features
3. Document API changes
4. Use meaningful commit messages

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please refer to the project documentation or contact the development team.
