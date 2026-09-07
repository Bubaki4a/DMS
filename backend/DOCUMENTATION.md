# ДОКУМЕНТАЦИЯ НА СИСТЕМА ЗА УПРАВЛЕНИЕ НА ДОКУМЕНТИ (DMS)
## За Образователни Заведения

**Версия**: 1.0  
**Дата**: Август 2026  
**Статус**: Production Ready ✅

---

# СЪДЪРЖАНИЕ

1. Въведение и обзор
2. Технически спецификации
3. Архитектура на системата
4. Инсталация и конфигурация
5. Управление на потребители
6. Управление на документи
7. Система за разрешения
8. Процес на одобрение
9. API документация
10. Одит и сигурност
11. Администраторски ръководство
12. Ръководство за потребители
13. Разширени функции
14. Отстранување на неполадки
15. Deployment и продуктивна среда

---

# ГЛАВА 1: ВЪВЕДЕНИЕ И ОБЗОР

## 1.1 Назначение на системата

Системата за управление на документи (DMS) е специализирана уеб-приложение, предназначено за образователни заведения. Позволява централизирано съхранение, управление и контролиран достъп до учебни документи, като едновременно поддържа пълна история на版ията и комплексен одит лог.

## 1.2 Основни цели

- **Централизирано съхранение**: Единна локация за всички учебни материали
- **Версионирано управление**: Пълна история на всяка промяна на документ
- **Контролиран достъп**: Разрешения по роля и клас/предмет
- **Одобрителен процес**: Многоступенна одобрителна система
- **Одит и прозрачност**: Пълна история на всички действия
- **Безопасност**: Криптографско хеширане и защита на файлове

## 1.3 Ключови возможности

### Документооборот
- Качване и категоризиране на документи
- Таговане и търсене
- Версионирано управление
- Възможност за връщане към предишна версия
- Отслеждане на сваляния

### Контрол на достъпа
- Три роли: Администратор, Учител, Ученик
- Достъп по клас и предмет
- Документ-специфични разрешения
- Временни разрешения с дата на изтичане
- Мулти-нивелна система за разрешения

### Одобрителен процес
- Многоступенни работни процеси
- Статус на документ: Draft → Pending → Approved/Rejected
- Коментари и обратна връзка
- История на одобренията

### Одит и безопасност
- Пълен лог на всички действия
- SHA256 хеширане на файлове
- Невъзможност за изтриване на одит записи
- IP адрес логване
- Отслеждане на потребителска активност

---

# ГЛАВА 2: ТЕХНИЧЕСКИ СПЕЦИФИКАЦИИ

## 2.1 Технологичен стек

### Backend
- **Python 3.8+**
- **Django 4.2.13** - Web framework
- **Django REST Framework 3.14** - API
- **PostgreSQL 12+** - Database
- **JWT (SimpleJWT 5.3.2)** - Authentication

### Фронтенд (съществуващ)
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling

### Складиране на файлове
- **Local FileSystem** - Development
- **Amazon S3** - Production (опционално)

## 2.2 Системни изисквания

### Минимални
- **CPU**: 2 ядра
- **Память**: 4GB RAM
- **Диск**: 50GB SSD
- **OS**: Linux, macOS, или Windows

### Препоръчани за продуктивна среда
- **CPU**: 4+ ядра
- **Память**: 8+ GB RAM
- **Диск**: 200GB+ SSD
- **OS**: Linux (Ubuntu 20.04 LTS+)

## 2.3 Поддържани браузери

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 2.4 Поддържани типове файлове

- **Документи**: pdf, doc, docx, xls, xlsx, ppt, pptx, txt
- **Изображения**: jpg, jpeg, png, gif
- **Архиви**: zip, rar

## 2.5 Ограничения на размер

- **Максимален размер на един файл**: 100MB
- **Максимален размер на quali**: 100MB (конфигурируемо)
- **Максимален брой едновременни качвания**: 10

---

# ГЛАВА 3: АРХИТЕКТУРА НА СИСТЕМАТА

## 3.1 Архитектурна диаграма

```
┌─────────────────────────────────────────────┐
│         ФРОНТЕНД (React/TypeScript)         │
│  - Document Grid View                       │
│  - Upload Modal                             │
│  - User Management                          │
│  - Analytics Dashboard                      │
└──────────────────┬──────────────────────────┘
                   │ (CORS, JWT Auth)
                   ↓
┌─────────────────────────────────────────────┐
│    API СЛОЙ (Django REST Framework)         │
│  - Authentication (JWT)                     │
│  - User Endpoints                           │
│  - Document Endpoints                       │
│  - Permission Management                    │
│  - Approval Workflow                        │
│  - Audit Logging                            │
└──────────────────┬──────────────────────────┘
                   │ (ORM, Queries)
                   ↓
┌─────────────────────────────────────────────┐
│   БИЗНЕС ЛОГИКА (Django Applications)       │
│  - Users App                                │
│  - Documents App                            │
│  - Permissions App                          │
│  - Audit App                                │
│  - Approvals App                            │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
   ┌────────┐ ┌────────┐ ┌──────────┐
   │Database│ │FileStg │ │CacheLayer│
   │PostgreSQL│ │Local/S3│ │ Redis    │
   └────────┘ └────────┘ └──────────┘
```

## 3.2 Структура на база данни

### Главни таблици

```
Users (потребители)
├── id (PK)
├── username
├── email
├── password_hash
├── role (ADMIN, TEACHER, STUDENT)
├── department
├── is_approved
└── last_login_ip

Documents (документи)
├── id (PK)
├── title
├── category_id (FK)
├── uploaded_by_id (FK -> Users)
├── status (draft, pending_approval, approved, rejected)
├── current_version
├── department
├── created_at
└── updated_at

DocumentVersion (версии)
├── id (PK)
├── document_id (FK)
├── version_number
├── file_path
├── file_size
├── file_hash (SHA256)
├── uploaded_by_id (FK -> Users)
├── uploaded_at
└── change_description

DocumentPermission (разрешения)
├── id (PK)
├── document_id (FK)
├── user_id (FK)
├── permission_type (view, edit, delete, approve)
├── granted_by_id (FK -> Users)
├── granted_at
└── expires_at

ApprovalWorkflow (одобрения)
├── id (PK)
├── document_id (FK)
├── status (pending, approved, rejected)
├── submitted_by_id (FK -> Users)
├── approved_by_id (FK -> Users)
├── approved_at
└── rejection_reason

AuditLog (одит)
├── id (PK)
├── user_id (FK)
├── action (14 типа действия)
├── object_type
├── object_id
├── ip_address
├── timestamp
└── details (JSON)
```

## 3.3 Микросервисна архитектура

Системата е структурирана като пет независими Django приложения:

### Users App
- Управление на потребители
- Аутентификация
- Ролеви управление
- История на дейности

### Documents App
- Качване и сваляне
- Версионирано управление
- Категоризиране и таговане
- Отслеждане на достъп

### Permissions App
- Контрол на достъпа
- Разрешения по документ
- Разрешения по роля
- Разрешения по отдел

### Approvals App
- Одобрителни работни процеси
- Многоступенни одобрения
- Коментари и обратна връзка
- История на решения

### Audit App
- Одит логване
- Безопасностни события
- Отчеты на дейности
- Компилианс

---

# ГЛАВА 4: ИНСТАЛАЦИЯ И КОНФИГУРАЦИЯ

## 4.1 Предварителни изисквания

```bash
# Windows
python --version  # 3.8 или по-високо
pip --version

# Проверка на PostgreSQL
psql --version
```

## 4.2 Пълна инсталация (Windows)

### Етап 1: Подготовка на средата

```bash
# Навигиране до backend директория
cd C:\Users\bobo2\Desktop\DMS\backend

# Създаване на виртуална среда
python -m venv venv

# Активиране на виртуална среда
venv\Scripts\activate

# Проверка
python -m pip install --upgrade pip
```

### Етап 2: Инсталиране на зависимости

```bash
# Инсталиране от requirements.txt
pip install -r requirements.txt

# Проверка на инсталирани пакети
pip list | grep -i django
```

### Етап 3: Конфигурация

```bash
# Копиране на пример конфигурация
copy .env.example .env

# Редактиране на .env (отворете с текстов редактор)
# Задайте:
# - SECRET_KEY (генерирайте със: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
# - DB_NAME, DB_USER, DB_PASSWORD
# - ALLOWED_HOSTS
```

### Етап 4: Подготовка на база данни

```bash
# Ако PostgreSQL е инсталиран:
psql -U postgres

# В psql shell:
CREATE DATABASE dms_db;
CREATE USER dms_user WITH PASSWORD 'your_password';
ALTER ROLE dms_user SET client_encoding TO 'utf8';
ALTER ROLE dms_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE dms_user SET default_transaction_deferrable TO on;
ALTER ROLE dms_user SET default_transaction_deferrable TO off;
ALTER ROLE dms_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE dms_db TO dms_user;
\q
```

### Етап 5: Миграции

```bash
# Прилагане на миграции
python manage.py migrate

# Створяване на начален администратор
python manage.py createsuperuser
# Следвайте насоките за создание на админ акаунт
```

### Етап 6: Запускане

```bash
# Разработка сървър
python manage.py runserver

# Сървърът ще слуша на http://localhost:8000
```

## 4.3 Конфигурационни параметри

### Главни настройки (.env)

```ini
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True  # False в продуктивна среда
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=dms_db
DB_USER=dms_user
DB_PASSWORD=secure_password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=1

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# File Storage
MAX_UPLOAD_SIZE=104857600  # 100MB
USE_S3=False

# Email (опционално)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# Security
SECURE_SSL_REDIRECT=False  # True в продуктивна среда
SESSION_COOKIE_SECURE=False  # True в продуктивна среда
```

## 4.4 Конфигурация с S3 (Amazon)

```ini
USE_S3=True
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_STORAGE_BUCKET_NAME=your_bucket_name
AWS_S3_REGION_NAME=eu-west-1
AWS_S3_CUSTOM_DOMAIN=%s.s3.amazonaws.com
AWS_LOCATION=media
DEFAULT_FILE_STORAGE=storages.backends.s3boto3.S3Boto3Storage
```

---

# ГЛАВА 5: УПРАВЛЕНИЕ НА ПОТРЕБИТЕЛИ

## 5.1 Роли и разрешения

### Администратор
- Пълен достъп до всички функции
- Управление на потребители
- Одобрение на нови потребители
- Преглед на одит логове
- Управление на разрешения
- Архивиране на документи

**Разрешени действия**:
- ✅ Преглед на всички документи
- ✅ Редактиране на всички документи
- ✅ Изтриване на всички документи
- ✅ Одобрение на документи
- ✅ Управление на потребители
- ✅ Преглед на одит логове

### Учител
- Качване и управление на свои документи
- Достъп до документи за своя клас
- Одобрение на студентски документи
- Преглед на своя активност

**Разрешени действия**:
- ✅ Качване на документи
- ✅ Управление на собствени документи
- ✅ Преглед на документи от класа
- ✅ Одобрение на документи
- ✅ Добавяне на коментари
- ❌ Преглед на чужди документи
- ❌ Преглед на одит логове

### Ученик
- Достъп до документи на своя клас
- Качване на документи (при одобрение)
- Преглед на своя активност

**Разрешени действия**:
- ✅ Преглед на документи
- ✅ Сваляне на документи
- ✅ Качване на документи (при одобрение)
- ✅ Преглед на своя активност
- ❌ Редактиране на чужди документи
- ❌ Одобрение на документи
- ❌ Преглед на одит логове

## 5.2 Процес на регистрация

### За администратор
1. Администраторът създава акаунт през админ панел
2. Акаунтът е активен веднага с пълни разрешения

### За учител/ученик
1. Потребителят се регистрира през приложението
2. Администратор получава известие
3. Администратор одобрява/отхвърля в админ панел
4. Потребител получава съобщение за статуса

## 5.3 Управление на профил

### Промяна на пароль

```
Настройки → Промяна на пароль → Въведете стара и нова пароль
```

### Обновяване на профил

```
Профил → Редактиране → Обновяване на информация
```

### Деактивиране на акаунт

```
Администратор → Потребители → Деактивиране
```

## 5.4 Управление на отделения (за администратор)

```
Администратор → Настройки → Отделения

Действия:
- Създаване на ново отделение
- Редактиране на отделение
- Свързване на потребители с отделение
- Задаване на разрешения по отделение
```

---

# ГЛАВА 6: УПРАВЛЕНИЕ НА ДОКУМЕНТИ

## 6.1 Качване на документ

### Начинен начин

1. **Отворете приложението**
   ```
   Адрес: http://localhost:5173
   ```

2. **Натиснете "Upload Document"**
   ```
   Ще се отвори модален прозорец
   ```

3. **Попълнете информацията**
   ```
   Име: Название на документ
   Категория: Изберете подходяща категория
   Отделение: Клас или отдел
   Предмет: Учебен предмет
   Тагове: Добавете релевантни тагове
   Файл: Преместете или изберете файл (макс 100MB)
   ```

4. **Натиснете Upload**
   ```
   Документът ще се качи и ще получи статус "Draft"
   ```

### API примера за качване

```bash
curl -X POST http://localhost:8000/api/documents/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Математика Тест" \
  -F "category=1" \
  -F "department=Клас 10A" \
  -F "subject=Математика" \
  -F "file=@path/to/file.pdf"
```

## 6.2 Версионирано управление

### Преглед на версии

1. **Отворете документ**
   ```
   Клик на документ в списъка
   ```

2. **Преглед на версии**
   ```
   Раздел "Version History" показва всички версии
   ```

3. **Изтегляне на конкретна версия**
   ```
   Клик на "Download" до версията
   ```

### Качване на нова версия

```
Клик "Upload New Version" → Изберете файл → Добавете описание → Upload
```

**Описание на версия**:
```
Пример: "Корекция на грешки в глава 2, добавени нови примери"
```

### Възвръщане към предишна версия

```
Version History → Клик "Restore" до желаната версия
```

**Внимание**: Възвръщането създава нова версия, изваримотонас се стара версия

## 6.3 Категоризиране и търсене

### Достъпни категории

- Лекции
- Тестове
- Упражнения
- Проектни задачи
- Административни документи
- Други

### Добавяне на категория (администратор)

```
Администратор → Категории → Добавяване на нова категория
```

### Търсене на документи

```
Търсене по:
- Название: "Математика"
- Категория: Лекции
- Отделение: Клас 10A
- Тагове: #Python #Тест
- Автор: Иван Петров
- Дата: От - До
```

## 6.4 Сваляне и отслеждане

### Сваляне на документ

```
1. Отворете документ
2. Натиснете "Download"
3. Файлът ще се сведе на компютъра
```

**Отслеждане**:
- Всяко сваляне се логва със IP адрес и време
- Администраторът може видеть кой е свалил кой документ

### Статистика на сваляния

```
Документ → "Download Count" показва общ брой на сваляния
Админ → Отчети → "Most Downloaded Documents"
```

## 6.5 Архивиране на документи

### Архивиране

```
Администратор → Документ → "Archive" 
# Документът ще бъде скрит от списъка
```

### Възстановяване от архив

```
Администратор → Архив → Документ → "Restore"
```

---

# ГЛАВА 7: СИСТЕМА ЗА РАЗРЕШЕНИЯ

## 7.1 Нивата на разрешения

### Ниво 1: Разрешения по роля

**Администратор**:
- view, edit, delete, approve, share

**Учител**:
- view, edit, share (за свои документи)

**Ученик**:
- view, download

### Ниво 2: Документ-специфични разрешения

```
Клик на документ → "Manage Permissions"

Можете да дадете разрешения на конкретни потребители:
- view (виждане)
- edit (редактиране)
- delete (изтриване)
- share (споделяне)
```

### Ниво 3: Разрешения по отделение

```
Администратор → Отделения → Избор на отделение

Задача за отделението:
- can_view (вижданиена документи)
- can_upload (качване на документи)
- can_approve (одобрение на документи)
```

### Ниво 4: Временни разрешения

```
Разрешения могат да имат дата на изтичане:

Пример:
- Даной на разрешение: 01.09.2026
- Дата на изтичане: 31.12.2026
```

## 7.2 Делегиране на разрешения

### За администратор

```
Администратор → Потребител → Редактиране на разрешения

Може да се задават глобални разрешения за потребителя
```

### За учител

```
За своите документи:
Документ → Manage Permissions → Grant Access
```

## 7.3 Отнемане на разрешения

### Веднага отнемане

```
Администратор → Документ → Permissions → Delete
```

### С дата на изтичане

```
При създаване на разрешение, задайте expires_at
```

---

# ГЛАВА 8: ПРОЦЕС НА ОДОБРЕНИЕ

## 8.1 Работни процеси на одобрение

### Статусен преход

```
Draft (черновик)
    ↓
Pending Approval (чакащо одобрение)
    ↓
    ├─→ Approved (одобрено) ✓
    │
    └─→ Rejected (отхвърлено) ✗
            ↓
        Може да бъде преработено и повторно подадено
```

## 8.2 Процес на подаване за одобрение

### За учител

```
1. Качете документ (автоматично status=draft)
2. Натиснете "Submit for Approval"
3. Документът отива в статус "pending_approval"
4. Администратор получава известие
```

### За администратор

```
Администратор → Approvals → Pending

Преглед на:
- Документ
- Метаданни (размер, дата, тип)
- История на версии
```

## 8.3 Одобрение или отхвърляне

### Одобрение

```
Администратор → Pending Document → "Approve"

Документът отива в статус "approved"
Всички потребители с access могат да видят/свалят
```

### Отхвърляне

```
Администратор → Pending Document → "Reject"

Необходимо е да напишете причина:
"Съдържа неправилна информация в раздел 2"

Документът отива в статус "rejected"
Автор получава известие
```

## 8.4 Коментари и обратна връзка

### Добавяне на коментар

```
Approval Workflow → "Add Comment"

Може да напишете обратна връзка:
"Моля, коригирайте формулировката в точка 3.2"
```

### Преглед на всички коментари

```
Документ → "Comments" → История на всички коментари
```

---

# ГЛАВА 9: API ДОКУМЕНТАЦИЯ

## 9.1 Аутентификация

### Получаване на JWT токен

```bash
POST /api/auth/token/

Request:
{
    "username": "user@example.com",
    "password": "password123"
}

Response (200):
{
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Обновяване на токен

```bash
POST /api/auth/token/refresh/

Request:
{
    "refresh": "your_refresh_token"
}

Response (200):
{
    "access": "new_access_token"
}
```

### Ползване на токена

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:8000/api/documents/
```

## 9.2 Потребители (API)

### Регистрация

```bash
POST /api/users/

Request:
{
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "secure123!",
    "password2": "secure123!",
    "role": "student",
    "department": "Class 10A"
}

Response (201):
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student",
    "is_approved": false
}
```

### Преглед на текущ потребител

```bash
GET /api/users/me/

Response (200):
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "department": "Class 10A",
    "is_approved": true,
    "date_joined": "2026-08-14T10:30:00Z",
    "last_login": "2026-08-14T15:45:00Z"
}
```

### Обновяване на профил

```bash
PATCH /api/users/me/

Request:
{
    "first_name": "John",
    "last_name": "Doe"
}

Response (200):
{
    "id": 1,
    "username": "john_doe",
    ...updated data...
}
```

### Список на потребители (администратор)

```bash
GET /api/users/?role=teacher&is_approved=true

Response (200):
{
    "count": 15,
    "next": "http://localhost:8000/api/users/?page=2",
    "previous": null,
    "results": [...]
}
```

## 9.3 Документи (API)

### Качване на документ

```bash
POST /api/documents/

Request (multipart/form-data):
{
    "title": "Advanced Mathematics",
    "description": "Chapter 5 - Calculus",
    "category": 1,
    "tag_ids": [2, 3],
    "file": <binary file data>,
    "department": "Class 10A",
    "subject": "Mathematics"
}

Response (201):
{
    "id": 1,
    "title": "Advanced Mathematics",
    "category": 1,
    "status": "draft",
    "created_at": "2026-08-14T10:00:00Z",
    "current_version": 1,
    "download_count": 0
}
```

### Список на документи

```bash
GET /api/documents/?category=1&status=approved&search=mathematics

Query Parameters:
- category: Filter by category ID
- status: draft, pending_approval, approved, rejected
- search: Search by title, description
- department: Filter by department
- uploaded_by: Filter by user ID
- ordering: created_at, title, download_count
- page: Page number (default 1)
- page_size: Items per page (default 20)

Response (200):
{
    "count": 45,
    "next": "http://localhost:8000/api/documents/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "title": "Advanced Mathematics",
            "category": 1,
            "category_name": "Lectures",
            "status": "approved",
            "created_at": "2026-08-14T10:00:00Z",
            "uploaded_by": 5,
            "uploaded_by_name": "Jane Smith",
            "current_version": 2,
            "download_count": 47,
            "department": "Class 10A",
            "subject": "Mathematics"
        }
    ]
}
```

### Преглед на документ

```bash
GET /api/documents/1/

Response (200):
{
    "id": 1,
    "title": "Advanced Mathematics",
    "description": "Chapter 5",
    "category": 1,
    "category_name": "Lectures",
    "tags": [
        {"id": 2, "name": "calculus"},
        {"id": 3, "name": "differential"}
    ],
    "status": "approved",
    "created_at": "2026-08-14T10:00:00Z",
    "uploaded_by": 5,
    "uploaded_by_name": "Jane Smith",
    "current_version": 2,
    "versions": [
        {
            "id": 1,
            "version_number": 1,
            "file": "/media/documents/2026/08/14/file_v1.pdf",
            "file_size": 1024000,
            "uploaded_by": 5,
            "uploaded_at": "2026-08-14T10:00:00Z",
            "change_description": "Initial version",
            "download_count": 30
        },
        {
            "id": 2,
            "version_number": 2,
            "file": "/media/documents/2026/08/14/file_v2.pdf",
            "file_size": 1050000,
            "uploaded_by": 5,
            "uploaded_at": "2026-08-14T14:30:00Z",
            "change_description": "Fixed typos in chapter 2",
            "download_count": 17
        }
    ],
    "access_count": 47
}
```

### Качване на нова версия

```bash
POST /api/documents/1/upload_version/

Request (multipart/form-data):
{
    "file": <binary file data>,
    "change_description": "Fixed formatting issues"
}

Response (200):
{
    "id": 3,
    "version_number": 3,
    "file": "/media/documents/2026/08/14/file_v3.pdf",
    "file_size": 1055000,
    "uploaded_by": 5,
    "uploaded_at": "2026-08-14T16:00:00Z",
    "change_description": "Fixed formatting issues",
    "download_count": 0
}
```

### История на версии

```bash
GET /api/documents/1/version_history/

Response (200):
[
    {
        "id": 1,
        "version_number": 1,
        "file": "/media/documents/2026/08/14/file_v1.pdf",
        "file_size": 1024000,
        "uploaded_by": 5,
        "uploaded_by_name": "Jane Smith",
        "uploaded_at": "2026-08-14T10:00:00Z",
        "change_description": "Initial version",
        "download_count": 30
    },
    {
        "id": 2,
        "version_number": 2,
        "file": "/media/documents/2026/08/14/file_v2.pdf",
        "file_size": 1050000,
        "uploaded_by": 5,
        "uploaded_by_name": "Jane Smith",
        "uploaded_at": "2026-08-14T14:30:00Z",
        "change_description": "Fixed typos in chapter 2",
        "download_count": 17
    }
]
```

### Възвръщане към версия

```bash
POST /api/documents/1/restore_version/

Request:
{
    "version_number": 1
}

Response (200):
{
    "id": 3,
    "version_number": 3,
    "file": "/media/documents/2026/08/14/file_restored.pdf",
    "change_description": "Restored from version 1",
    "uploaded_at": "2026-08-14T16:30:00Z"
}
```

### Сваляне на документ

```bash
GET /api/documents/1/download/

Response (200):
{
    "file_url": "/media/documents/2026/08/14/file_v2.pdf"
}

# Сваляне логва действието:
# - IP адрес
# - Време
# - Потребител
# - Документ ID
# - Версия
```

## 9.4 Разрешения (API)

### Предоставяне на разрешение

```bash
POST /api/permissions/document/

Request:
{
    "document": 1,
    "user": 3,
    "permission_type": "view",
    "expires_at": "2026-12-31T23:59:59Z"
}

Response (201):
{
    "id": 1,
    "document": 1,
    "user": 3,
    "user_name": "John Doe",
    "permission_type": "view",
    "granted_by": 1,
    "granted_at": "2026-08-14T16:00:00Z",
    "expires_at": "2026-12-31T23:59:59Z",
    "is_expired": false
}
```

### Проверка на достъп

```bash
POST /api/permissions/check/check_access/

Request:
{
    "document_id": 1,
    "permission_type": "edit"
}

Response (200):
{
    "has_access": true,
    "permission_type": "edit"
}
```

## 9.5 Одобрения (API)

### Получаване на чакащи одобрения

```bash
GET /api/approvals/?status=pending

Response (200):
{
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "document": 1,
            "document_title": "Advanced Mathematics",
            "status": "pending",
            "submitted_by": 5,
            "submitted_by_name": "Jane Smith",
            "submitted_at": "2026-08-14T14:00:00Z",
            "approved_by": null,
            "approved_at": null,
            "expires_at": null
        }
    ]
}
```

### Одобрение на документ

```bash
POST /api/approvals/1/approve/

Request: {}

Response (200):
{
    "id": 1,
    "document": 1,
    "status": "approved",
    "approved_by": 1,
    "approved_at": "2026-08-14T16:00:00Z"
}
```

### Отхвърляне на документ

```bash
POST /api/approvals/1/reject/

Request:
{
    "reason": "Contains outdated information"
}

Response (200):
{
    "id": 1,
    "document": 1,
    "status": "rejected",
    "rejection_reason": "Contains outdated information",
    "rejected_by": 1,
    "rejected_at": "2026-08-14T16:00:00Z"
}
```

### Добавяне на коментар

```bash
POST /api/approvals/1/add_comment/

Request:
{
    "comment": "Please fix section 3.2 before resubmission"
}

Response (201):
{
    "id": 1,
    "user": 1,
    "user_name": "Administrator",
    "comment": "Please fix section 3.2 before resubmission",
    "created_at": "2026-08-14T16:00:00Z"
}
```

## 9.6 Одит логове (API, само администратор)

### Преглед на одит логове

```bash
GET /api/audit/logs/?action=document_upload&user=5

Query Parameters:
- action: Filter by action type
- user: Filter by user ID
- object_type: Document, User, Permission
- status: success, failure, warning
- ordering: timestamp
- date_from: Start date
- date_to: End date

Response (200):
{
    "count": 123,
    "results": [
        {
            "id": 1,
            "user": 5,
            "user_name": "Jane Smith",
            "action": "document_upload",
            "action_display": "Document Upload",
            "object_type": "Document",
            "object_id": 1,
            "object_name": "Advanced Mathematics",
            "ip_address": "192.168.1.100",
            "status": "success",
            "details": {
                "title": "Advanced Mathematics",
                "category": "Lectures"
            },
            "timestamp": "2026-08-14T14:00:00Z"
        }
    ]
}
```

---

# ГЛАВА 10: ОДИТ И СИГУРНОСТ

## 10.1 Одит логове

### Покрити действия

1. **Користувателски действия**
   - login (влизане)
   - logout (излизане)
   - registration (регистрация)
   - approval (одобрение на акаунт)

2. **Документни действия**
   - document_upload (качване)
   - document_download (сваляне)
   - document_view (виждане)
   - document_edit (редактиране)
   - document_delete (изтриване)

3. **Версионни действия**
   - version_upload (качване на версия)
   - version_restore (възвръщане към версия)

4. **Одобрителни действия**
   - document_approve (одобрение)
   - document_reject (отхвърляне)

5. **Разрешително действия**
   - permission_grant (дару на разрешение)
   - permission_revoke (отнемане на разрешение)

### Информация логирана

- Потребител (user ID)
- Действие (action type)
- Време (timestamp)
- IP адрес (ip_address)
- User Agent (браузър, ОС)
- Статус (success, failure, warning)
- Подробности (JSON metadata)

## 10.2 Сигурностни събития

### Типове события

```
failed_login            - Неудачен опит за влизане
suspicious_activity     - Подозрителна активност
permission_denied       - Отказан достъп
file_access_denied      - Отказан достъп до файл
invalid_token           - Невалиден JWT токен
unusual_download        - Необичайно сваляне
```

### Начина на съхранение

```
SecurityEvent таблица съхранява:
- event_type (вид事件)
- user_id (потребител)
- ip_address (IP адрес)
- description (описание)
- severity (low, medium, high, critical)
- timestamp (време)
- resolved (разрешено ли)
```

## 10.3 Файлова сигурност

### SHA256 хеширане

```
Всеки файл получава SHA256 хеш при качване:
- Используя се за проверка на интегритета
- Невъзможност е да бъди подмениран файл
```

### Валидация на типа файл

```
Разрешени типове:
- Документи: pdf, doc, docx, xls, xlsx, ppt, pptx, txt
- Изображения: jpg, jpeg, png, gif
- Архиви: zip, rar

Всеки质量 файл се проверява преди качване
```

### Ограничение на размер

```
- Максимален размер: 100MB
- Защита срещу DDoS атаки
- Защита на дисковото пространство
```

## 10.4 Трасиране на достъп

### Кой е видял документ?

```
документ → "Access Tracking" показва:
- Потребител
- Тип достъп (view/download)
- Време
- IP адрес
```

### Кой е свалил документ?

```
Admin → Reports → "Download Activity" показва:
- Документ
- Потребител
- Дата
- IP адрес
```

---

# ГЛАВА 11: АДМИНИСТРАТОРСКИ РЪКОВОДСТВО

## 11.1 Панел администратор

### Достъп до админ панела

```
URL: http://localhost:8000/admin

Влизане със администраторските учетни данни
```

### Основни секции

1. **Потребители** - Управление на акаунти
2. **Документи** - Управление на документи
3. **Категории** - Управление на категории
4. **Разрешения** - Управление на разрешенията
5. **Одобрения** - Преглед на одобренията
6. **Одит логове** - Преглед на логове
7. **Безопасностни события** - Преглед на eventos

## 11.2 Управление на потребители

### Створяване на нов потребител

```
Администратор → Users → Add User

Попълнете:
- Username
- Email
- First Name
- Last Name
- Password
- Role (Admin/Teacher/Student)
- Department
- Is Approved (галочка за одобрение)
```

### Редактиране на потребител

```
Администратор → Users → Избор на потребител

Можете да се променят:
- Role
- Department
- is_approved
- is_active
```

### Деактивиране на потребител

```
Администратор → Users → Избор на потребител

Разчистете "Is Active" и кликнете "Save"
```

### Одобрение на нови потребители

```
Администратор → Users → Филтър: is_approved=False

За всеки потребител:
- Преглед на информацията
- Проверка на роля
- Достав galochka в "Is Approved"
- Кликнете "Save"
```

## 11.3 Управление на документи

### Преглед на всички документи

```
Администратор → Documents

Филтър по:
- Status
- Category
- Department
- Upload Date
```

### Редактиране на документ

```
Администратор → Documents → Избор на документ

Можете да се променят:
- Title
- Description
- Category
- Status
- Department
- Tags
```

### Архивиране на документ

```
Администратор → Documents → Избор на документ

Смяна Status в "archived" и "Save"
```

## 11.4 管理 одобрения

### Преглед на чакащи одобрения

```
Администратор → Approvals → Филтър: status=pending

Показват се всички документи, чакащи одобрение
```

### Одобрение на документ

```
1. Отворете одобренато
2. Преглед на документ и метаданни
3. Натиснете "Approve"
4. Документът отива в status "approved"
5. Всички с достъп виждат документа
```

### Отхвърляне на документ

```
1. Отворете одобренато
2. Напишете причина в "Rejection Reason"
3. Натиснете "Reject"
4. Документът отива в status "rejected"
5. Автор получава известие
```

## 11.5 Преглед на одит логове

### Филтриране на логове

```
Администратор → Audit Logs

Филтър по:
- User
- Action (type)
- Status (success/failure/warning)
- Date Range
- IP Address
```

### Примери на запитвания

```
"Какво е направил потребител 5?"
Filter: user=5 → Вижте всички действия

"Кой е свалил документ 1?"
Filter: object_id=1, action=document_download

"Неудачни опити за влизане?"
Filter: action=failed_login, status=failure

"Когато администратор е направил промяна?"
Filter: user=1, action=setting_change
```

## 11.6 Управление на категории

###創建 категория

```
Администратор → Categories → Add Category

Попълнете:
- Name (название)
- Description (описание)
```

### Редактиране на категория

```
Администратор → Categories → Избор → Edit

Смяна на име или описание
```

## 11.7 Управление на разрешения

### Даяние на разрешение

```
Администратор → Document Permissions → Add

Попълнете:
- Document
- User
- Permission Type (view/edit/delete/approve/share)
- Granted By (автоматично вашия ID)
- Expires At (опционално)
```

### Отнемане на разрешение

```
Администратор → Document Permissions → Избор → Delete
```

---

# ГЛАВА 12: РЪКОВОДСТВО ЗА ПОТРЕБИТЕЛИ

## 12.1 Регистрация и влизане

### Регистрация

```
1. Адрес: http://localhost:5173
2. Натиснете "Sign Up" / "Регистриране"
3. Попълнете:
   - Потребителско име
   - Имейл
   - Пароль
   - Роля (Ученик/Учител)
   - Клас/Отделение
4. Натиснете "Register"
5. Чакайте одобрение от администратор
```

### Влизане

```
1. Адрес: http://localhost:5173
2. Натиснете "Sign In" / "Влизане"
3. Въведете:
   - Потребителско име
   - Пароль
4. Натиснете "Sign In"
```

## 12.2 Профил потребител

### Преглед на профил

```
Горен десен ъгъл → "Profile" / "Профил"

Вижте:
- Имя
- Имейл
- Роля
- Клас
- Дата на регистрация
- Последно влизане
```

### Промяна на пароль

```
Профил → "Change Password" / "Смяна на пароль"

Въведете:
- Стара пароль
- Нова пароль
- Потвърждение на нова пароль
```

## 12.3 Качване на документ

### Пълна процедура

```
1. Клик на "Upload Document" / "Качване"
2. Попълнете форма:
   
   Название:
   "Математика Тест Chapter 5"
   
   Категория:
   "Лекции" / "Тестове" / т.н.
   
   Отделение:
   "Клас 10A"
   
   Предмет:
   "Математика"
   
   Тагове:
   "calculus" "differential" "exam"
   
   Файл:
   Преместете или изберете .pdf файл (макс 100MB)

3. Натиснете "Upload"
4. Чакайте качването да завърши
5. Документът получава статус "Draft"
```

### Подаване за одобрение

```
Ако сте учител:

1. Отворете документ
2. Натиснете "Submit for Approval"
3. Документът отива в "Pending Approval"
4. Администратор получава известие
5. Очаквайте решение (одобрение/отхвърляне)
```

## 12.4 Преглед на документи

### Обзор на документи

```
Начална страница показва:
- Скорошно качени документи
- Документи от вашия клас
- Популярни документи (по сваляния)
```

### Търсене на документ

```
1. Въведете в search box:
   "Математика" / "Chapter 3" / "Newton"
   
2. Или филтрирайте по:
   - Категория
   - Дата
   - Автор
   
3. Резултатите се показват веднага
```

### Преглед на документ

```
1. Клик на документ в списъка
2. Вижте:
   - Название и описание
   - Автор
   - Дата на създание
   - История на версии
   - Число на сваляния
   - Коментари (ако са добавени)
```

## 12.5 Сваляне на документ

### Сваляне

```
1. Отворете документ
2. Натиснете "Download" / "Сваливане"
3. Файлът ще се изтегли на компютъра
4. Действието се логва (время, IP адрес)
```

### Кеш на изтегляне

```
Документите се кешират 7 дни
При следващо сваляне, ако няма нова версия, използва се кеш версията
```

## 12.6 История на версии

### Преглед на версии

```
Документ → "Version History"

Вижте:
- Версия номер
- Дата на качване
- Описание на промените
- Брой на сваляния
- Свалил ли сте?
```

### Сваляне на стара версия

```
History → Клик "Download" до версията
```

### Запрос за възвръщане към версия

```
За учители:
History → Клик "Restore" 
(Администратор получава известие)
```

## 12.7 Отслеждане на активност

### Моя активност

```
Профил → "My Activity"

Вижте всичко, което сте направили:
- Качени документи
- Свалени документи
- Подадени за одобрение
- Добавени коментари
```

---

# ГЛАВА 13: РАЗШИРЕНИ ФУНКЦИИ

## 13.1 Групови разрешения

```
Администратор може да даде разрешения на цял отдел:

Администратор → Department Permissions

Всички студенти на отдела получават достъп
```

## 13.2 Временни разрешения

```
Разрешение, което изтича автоматично:

Дата на даяние: 01.09.2026
Дата на изтичане: 31.12.2026

След 31.12.2026 потребителят не вижда документа
```

## 13.3 Отчеты

### Най-активни потребители

```
Администратор → Reports → "Most Active Users"

Показва:
- Брой на качвания
- Брой на сваляния
- Брой на одобрения
- Последна активност
```

### Най-активни документи

```
Администратор → Reports → "Most Downloaded"

Показва:
- Брой на сваляния
- Потребители, които ги свалиха
- Версия
- Последно сваляне
```

### Одобрителен отчет

```
Администратор → Reports → "Approval Stats"

Показва:
- Брой на чакащих одобрения
- Средно време за одобрение
- Брой на одобренията и отхвърленията
- Останалата работа
```

## 13.4 Экспортиране на данни

```
Администратор може да експортира:

Формати:
- CSV (за Excel)
- JSON (за системи)
- PDF (за отчеты)

Данни:
- Потребители
- Документи
- Одит логове
- Разрешения
```

## 13.5 Масово действие

```
За администратор:

- Масово качване на категория
- Масово одобрение на документи
- Масово даяние на разрешения
- Масово архивиране
```

---

# ГЛАВА 14: ОТСТРАНУВАЊЕ НА НЕПОЛАДКИ

## 14.1 Проблеми при инсталация

### PostgreSQL не е инсталиран

**Проблем**: `psql: command not found`

**Решение**:
```bash
# Windows
Download PostgreSQL от https://www.postgresql.org/download/windows/

# Linux
sudo apt-get install postgresql postgresql-contrib

# После настроете базата данни
```

### Грешка при миграция

**Проблем**: `django.db.utils.ProgrammingError: relation "table_name" does not exist`

**Решение**:
```bash
# Пуснете миграциите отново
python manage.py migrate

# Ако все още не се решава:
python manage.py makemigrations
python manage.py migrate --fake-initial
```

### Дублиране на портове

**Проблем**: `Address already in use`

**Решение**:
```bash
# Специфициране на друг порт
python manage.py runserver 8001

# Или намерете процеса:
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows
```

## 14.2 Проблеми при качване

### Файлът е твърде голям

**Проблем**: File exceeds maximum size

**Решение**:
- Максимумът е 100MB
- Компресирайте файла
- Разделете на части
- Администратор може да промени лимита в settings.py

### Неподдържан тип файл

**Проблем**: File type not allowed

**Решение**:
- Преобразувайте в .pdf или друг поддържан формат
- Администратор може да добави тип във ALLOWED_FILE_TYPES

### Файлът не се качва

**Проблем**: Upload fails silently

**Решение**:
```bash
# Проверете разрешенията на папка
chmod 777 media/

# Проверете дискато място
df -h

# Преглед логове
tail -f logs/dms.log
```

## 14.3 Проблеми с достъпом

### "Permission Denied" съобщение

**Проблем**: You don't have permission to access this document

**Решение**:
- Попросете от администратора разрешение
- Проверете дали е одобрено ваше акаунт
- Проверете дали документът е одобрен

### Не мога да одобря документи

**Проблем**: Approve button не се появява

**Решение**:
- Должни сте да сте администратор или учител
- Документът трябва да е в статус "pending_approval"
- Преквалифицирайте браузъра

### Документът не се вижда

**Проблем**: Document not found или отсъствува в списъка

**Решение**:
- Документът може да е архивиран
- Нямате разрешение да го видите
- Администратор може да го възстанови от архив

## 14.4 Проблеми с производителност

### Бавно качване

**Проблем**: Upload takes too long

**Решение**:
- Проверете интернет скоростта
- Намалете размер на файла
- Администратор може да настрои timeout

### Списъче на документи се зарежда бавно

**Проблем**: Document list is slow to load

**Решение**:
- Използвайте филтър или търсене
- Намалете страницата (по-малко документи)
- Администратор може да оптимизира база данни

### Одобренията отнемат дълго

**Проблем**: Approval process is slow

**Решение**:
- Проверете дали има много чакащи одобрения
- Администратор може да обработи по-бързо
- Раздайте разрешенията на един учител

## 14.5 Проблеми със сигурност

### Забрав на пароля

**Проблем**: Forgot password

**Решение**:
```
1. Адрес на приложението
2. Натиснете "Forgot Password"
3. Въведете имейл
4. Ще получите имейл с линк
5. Следвайте линка за нова пароль
```

### Подозреният достъп

**Проблем**: Account was hacked

**Решение**:
1. Смяна на пароль веднага
2. Контактувайте администратора
3. Администратор може да преглед одит логове
4. Деактивирайте сесията

### Неразрешен достъп

**Проблем**: Seeing documents I shouldn't see

**Решение**:
1. Докладвайте администратору
2. Администратор може да преглед разрешенията
3. Проверят будез сигурностни event
4. Ще отнемат неправомерни разрешения

## 14.6 Доказателства при проблеми

### За администратор

```
Винаги проверете:

1. Audit Logs
   Admin → Audit Logs
   Филтр по user, action, date
   
2. Security Events
   Admin → Security Events
   Предупреждава за подозрителна активност
   
3. Django Logs
   cat logs/dms.log
   Детайлна информация на грешки
   
4. PostgreSQL Logs
   pg_log на PostgreSQL инсталацията
```

---

# ГЛАВА 15: DEPLOYMENT И ПРОДУКТИВНА СРЕДА

## 15.1 Подготовка за продуктивна среда

### Сигурност

```python
# settings.py

DEBUG = False  # Винаги False в продуктивна среда

ALLOWED_HOSTS = [
    'your-domain.com',
    'www.your-domain.com',
    'api.your-domain.com'
]

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000  # 1 год
```

### Генериране на SECRET_KEY

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Копирайте в .env файл
SECRET_KEY=your_generated_key_here
```

## 15.2 Deployment с Gunicorn

### Инсталиране

```bash
pip install gunicorn
```

### Конфигурация

```bash
# gunicorn_config.py

bind = "0.0.0.0:8000"
workers = 4
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 2
```

### Запускане

```bash
gunicorn --config gunicorn_config.py dms.wsgi:application
```

## 15.3 Nginx Конфигурация

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    client_max_body_size 100M;
    
    location /static/ {
        alias /path/to/backend/staticfiles/;
    }
    
    location /media/ {
        alias /path/to/backend/media/;
    }
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 15.4 Systemd Service

```bash
# /etc/systemd/system/dms.service

[Unit]
Description=DMS Django Application
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/backend/venv/bin"
ExecStart=/path/to/backend/venv/bin/gunicorn dms.wsgi:application

[Install]
WantedBy=multi-user.target
```

## 15.5 SSL/TLS Сертификат

### С Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx

sudo certbot certonly --nginx -d your-domain.com

# Автоматично обновяване
sudo systemctl enable certbot.timer
```

## 15.6 Архивиране и възстановяване

### Архивиране на база данни

```bash
# Дневно архивиране
pg_dump -U dms_user -h localhost dms_db > backup_$(date +%Y%m%d).sql

# Компресирано архивиране
pg_dump -U dms_user -h localhost dms_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Възстановяване

```bash
# От компресирано архивиране
gunzip < backup_20260814.sql.gz | psql -U dms_user -h localhost -d dms_db

# От обикновено архивиране
psql -U dms_user -h localhost -d dms_db < backup_20260814.sql
```

### Архивиране на файли

```bash
# Архивиране на media папка
tar -czf media_backup_$(date +%Y%m%d).tar.gz media/

# Архивиране на цялата система
rsync -avz /path/to/backend/ /backup/location/
```

## 15.7 Мониторинг и логване

### Проверка на статуса

```bash
# Gunicorn процес
ps aux | grep gunicorn

# PostgreSQL
sudo systemctl status postgresql

# Дискови пространство
df -h

# Използвана память
free -h
```

### Логове

```bash
# Django логи
tail -f logs/dms.log

# Audit logи
tail -f logs/audit.log

# Nginx логи
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# PostgreSQL логи
sudo tail -f /var/log/postgresql/postgresql.log
```

## 15.8 Резервиране и възстановяване

### Пълна система Backup

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/dms"
DATE=$(date +%Y%m%d_%H%M%S)

# Архивиране на база данни
pg_dump -U dms_user dms_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Архивиране на файлове
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /path/to/backend/media/

# Архивиране на конфигурация
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /path/to/backend/.env

# Задържане само последни 30 дни
find $BACKUP_DIR -mtime +30 -delete

echo "Backup completed at $DATE"
```

### Планирано архивиране с Cron

```bash
# crontab -e

# Дневно архивиране в 23:00
0 23 * * * /path/to/backup.sh

# Седмично архивиране в събота 01:00
0 1 * * 6 /path/to/full_backup.sh
```

---

# ЗАКЛЮЧЕНИЕ

Системата за управление на документи е компилирана с всички необходимите компоненти за образователни заведения. Всяка глава на документацията предоставя подробни инструкции за всеобхватното разбиране и управление на системата.

За допълнителна помощ, свържете се с администратора или разработчика на системата.

---

**Документация версия**: 1.0  
**Дата на издание**: Август 14, 2026  
**Статус**: Production Ready ✅

---
