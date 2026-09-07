# Django Backend - Quick Start Guide

## 1. Initial Setup (One Time)

### Create Virtual Environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Configure Environment
```bash
cp .env.example .env
# Edit .env and set your database credentials
```

### Create PostgreSQL Database
```bash
# Using psql
psql -U postgres
CREATE DATABASE dms_db;
\q

# Or using Django shell
python manage.py dbshell
```

### Run Migrations
```bash
python manage.py migrate
```

### Create Admin User
```bash
python manage.py createsuperuser
# Follow prompts to create admin account
```

## 2. Daily Development

### Activate Virtual Environment
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

### Start Development Server
```bash
python manage.py runserver
# Server runs at http://localhost:8000
```

### Access Admin Panel
Navigate to: http://localhost:8000/admin/

### Access API
Base URL: http://localhost:8000/api/

## 3. Testing the System

### 1. Get Authentication Token
```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"admin\", \"password\": \"your_password\"}"
```

### 2. Upload a Document
```bash
curl -X POST http://localhost:8000/api/documents/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Document" \
  -F "category=1" \
  -F "department=Class 10A" \
  -F "subject=Mathematics" \
  -F "file=@document.pdf"
```

### 3. List Documents
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/documents/
```

### 4. Create Approval Request
```bash
curl -X POST http://localhost:8000/api/approvals/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"document\": 1}"
```

## 4. Database Commands

### Make Migrations
```bash
python manage.py makemigrations
```

### Apply Migrations
```bash
python manage.py migrate
```

### See Migration Status
```bash
python manage.py showmigrations
```

### Create Data Dump
```bash
python manage.py dumpdata > backup.json
```

### Load Data Dump
```bash
python manage.py loaddata backup.json
```

## 5. Useful Django Commands

### Shell
```bash
python manage.py shell
# Access models directly
```

### Check Deployment Readiness
```bash
python manage.py check --deploy
```

### Clear Cache
```bash
python manage.py clear_cache
```

### Run Tests
```bash
python manage.py test
```

## 6. Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| SECRET_KEY | - | Django secret key |
| DEBUG | True | Debug mode (set to False in production) |
| ALLOWED_HOSTS | localhost | Allowed domains |
| DB_ENGINE | postgresql | Database engine |
| DB_NAME | dms_db | Database name |
| DB_USER | postgres | Database user |
| DB_PASSWORD | postgres | Database password |
| DB_HOST | localhost | Database host |
| DB_PORT | 5432 | Database port |

## 7. Common Issues & Solutions

### PostgreSQL Connection Refused
- Check PostgreSQL is running: `pg_ctl status`
- Verify connection string in .env
- Check port 5432 is open

### Permission Denied on Migration
- Ensure you're using the correct database user
- Check user has CREATE privilege

### Module Not Found
- Verify virtual environment is activated
- Run: `pip install -r requirements.txt`

### Static Files Issues
- Run: `python manage.py collectstatic --noinput`

## 8. Project Structure

```
backend/
├── dms/                     # Main project settings
├── apps/                    # Django applications
│   ├── users/              # User management
│   ├── documents/          # Document management
│   ├── permissions/        # Access control
│   ├── audit/              # Audit logging
│   └── approvals/          # Approval workflow
├── manage.py
├── requirements.txt
├── .env.example
└── README.md
```

## 9. API Endpoints Quick Reference

### Authentication
- POST /api/auth/token/ - Get token
- POST /api/auth/token/refresh/ - Refresh token

### Users
- GET/POST /api/users/ - List/create users
- GET /api/users/{id}/ - Get user
- GET /api/users/me/ - Current user

### Documents
- GET/POST /api/documents/ - List/upload
- GET /api/documents/{id}/ - Get details
- POST /api/documents/{id}/upload_version/ - New version
- GET /api/documents/{id}/download/ - Download

### Approvals
- GET/POST /api/approvals/ - List/create
- POST /api/approvals/{id}/approve/ - Approve
- POST /api/approvals/{id}/reject/ - Reject

### Audit
- GET /api/audit/logs/ - View logs (admin only)

## 10. Next Steps

1. **Connect Frontend**: Configure CORS in settings
2. **File Storage**: Set up S3 if needed
3. **Email**: Configure email backend
4. **Monitoring**: Set up logging and monitoring
5. **Deployment**: Prepare for production deployment
