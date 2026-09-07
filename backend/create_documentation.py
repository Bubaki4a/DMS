"""
Script to create a Word document with DMS documentation
"""
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

def add_heading_style(doc, text, level):
    """Add styled heading"""
    heading = doc.add_heading(text, level=level)
    heading.style = f'Heading {level}'
    return heading

def set_table_header(row, color):
    """Set table header color"""
    for cell in row.cells:
        shading_elm = OxmlElement('w:shd')
        shading_elm.set(qn('w:fill'), color)
        cell._element.get_or_add_tcPr().append(shading_elm)

def create_documentation():
    """Create the Word document"""
    doc = Document()
    
    # Title page
    title = doc.add_heading('ДОКУМЕНТАЦИЯ НА СИСТЕМА ЗА УПРАВЛЕНИЕ НА ДОКУМЕНТИ (DMS)', 0)
    title.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    subtitle = doc.add_paragraph('За Образователни Заведения')
    subtitle.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    subtitle.runs[0].font.size = Pt(16)
    
    doc.add_paragraph()
    doc.add_paragraph('Версия: 1.0')
    doc.add_paragraph('Дата: Август 2026')
    doc.add_paragraph('Статус: Production Ready ✅')
    
    doc.add_page_break()
    
    # Table of Contents
    add_heading_style(doc, 'СЪДЪРЖАНИЕ', 1)
    
    toc_items = [
        '1. Въведение и обзор',
        '2. Технически спецификации',
        '3. Архитектура на системата',
        '4. Инсталация и конфигурация',
        '5. Управление на потребители',
        '6. Управление на документи',
        '7. Система за разрешения',
        '8. Процес на одобрение',
        '9. API документация',
        '10. Одит и сигурност',
        '11. Администраторски ръководство',
        '12. Ръководство за потребители',
        '13. Разширени функции',
        '14. Отстранување на неполадки',
        '15. Deployment и продуктивна среда'
    ]
    
    for item in toc_items:
        doc.add_paragraph(item, style='List Bullet')
    
    doc.add_page_break()
    
    # CHAPTER 1
    add_heading_style(doc, 'ГЛАВА 1: ВЪВЕДЕНИЕ И ОБЗОР', 1)
    
    add_heading_style(doc, '1.1 Назначение на системата', 2)
    doc.add_paragraph(
        'Системата за управление на документи (DMS) е специализирана уеб-приложение, предназначено за '
        'образователни заведения. Позволява централизирано съхранение, управление и контролиран достъп до '
        'учебни документи, като едновременно поддържа пълна история на версията и комплексен одит лог.'
    )
    
    add_heading_style(doc, '1.2 Основни цели', 2)
    goals = [
        'Централизирано съхранение: Единна локация за всички учебни материали',
        'Версионирано управление: Пълна история на всяка промяна на документ',
        'Контролиран достъп: Разрешения по роля и клас/предмет',
        'Одобрителен процес: Многоступенна одобрителна система',
        'Одит и прозрачност: Пълна история на всички действия',
        'Безопасност: Криптографско хеширане и защита на файлове'
    ]
    for goal in goals:
        doc.add_paragraph(goal, style='List Bullet')
    
    add_heading_style(doc, '1.3 Ключови възможности', 2)
    
    add_heading_style(doc, 'Документооборот', 3)
    features1 = [
        'Качване и категоризиране на документи',
        'Таговане и търсене',
        'Версионирано управление',
        'Възможност за връщане към предишна версия',
        'Отслеждане на сваляния'
    ]
    for f in features1:
        doc.add_paragraph(f, style='List Bullet')
    
    add_heading_style(doc, 'Контрол на достъпа', 3)
    features2 = [
        'Три роли: Администратор, Учител, Ученик',
        'Достъп по клас и предмет',
        'Документ-специфични разрешения',
        'Временни разрешения с дата на изтичане',
        'Мулти-нивелна система за разрешения'
    ]
    for f in features2:
        doc.add_paragraph(f, style='List Bullet')
    
    add_heading_style(doc, 'Одобрителен процес', 3)
    features3 = [
        'Многоступенни работни процеси',
        'Статус на документ: Draft → Pending → Approved/Rejected',
        'Коментари и обратна връзка',
        'История на одобренията'
    ]
    for f in features3:
        doc.add_paragraph(f, style='List Bullet')
    
    add_heading_style(doc, 'Одит и безопасност', 3)
    features4 = [
        'Пълен лог на всички действия',
        'SHA256 хеширане на файлове',
        'Невъзможност за изтриване на одит записи',
        'IP адрес логване',
        'Отслеждане на потребителска активност'
    ]
    for f in features4:
        doc.add_paragraph(f, style='List Bullet')
    
    doc.add_page_break()
    
    # CHAPTER 2
    add_heading_style(doc, 'ГЛАВА 2: ТЕХНИЧЕСКИ СПЕЦИФИКАЦИИ', 1)
    
    add_heading_style(doc, '2.1 Технологичен стек', 2)
    
    add_heading_style(doc, 'Backend', 3)
    backend_tech = [
        'Python 3.8+',
        'Django 4.2.13 - Web framework',
        'Django REST Framework 3.14 - API',
        'PostgreSQL 12+ - Database',
        'JWT (SimpleJWT 5.3.2) - Authentication'
    ]
    for tech in backend_tech:
        doc.add_paragraph(tech, style='List Bullet')
    
    add_heading_style(doc, 'Фронтенд (съществуващ)', 3)
    frontend_tech = [
        'React 18 - UI Framework',
        'TypeScript - Type Safety',
        'Vite - Build Tool',
        'Tailwind CSS - Styling'
    ]
    for tech in frontend_tech:
        doc.add_paragraph(tech, style='List Bullet')
    
    add_heading_style(doc, '2.2 Системни изисквания', 2)
    
    add_heading_style(doc, 'Минимални', 3)
    doc.add_paragraph('CPU: 2 ядра')
    doc.add_paragraph('Память: 4GB RAM')
    doc.add_paragraph('Диск: 50GB SSD')
    doc.add_paragraph('OS: Linux, macOS, или Windows')
    
    add_heading_style(doc, 'Препоръчани', 3)
    doc.add_paragraph('CPU: 4+ ядра')
    doc.add_paragraph('Память: 8+ GB RAM')
    doc.add_paragraph('Диск: 200GB+ SSD')
    doc.add_paragraph('OS: Linux (Ubuntu 20.04 LTS+)')
    
    add_heading_style(doc, '2.3 Поддържани браузери', 2)
    browsers = ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+']
    for browser in browsers:
        doc.add_paragraph(browser, style='List Bullet')
    
    add_heading_style(doc, '2.4 Поддържани типове файлове', 2)
    doc.add_paragraph('Документи: pdf, doc, docx, xls, xlsx, ppt, pptx, txt', style='List Bullet')
    doc.add_paragraph('Изображения: jpg, jpeg, png, gif', style='List Bullet')
    doc.add_paragraph('Архиви: zip, rar', style='List Bullet')
    
    add_heading_style(doc, '2.5 Ограничения на размер', 2)
    doc.add_paragraph('Максимален размер на един файл: 100MB')
    doc.add_paragraph('Максимален размер на query: 100MB (конфигурируемо)')
    doc.add_paragraph('Максимален брой едновременни качвания: 10')
    
    doc.add_page_break()
    
    # CHAPTER 3
    add_heading_style(doc, 'ГЛАВА 3: АРХИТЕКТУРА НА СИСТЕМАТА', 1)
    
    add_heading_style(doc, '3.1 Структура на база данни', 2)
    
    add_heading_style(doc, 'Главни таблици', 3)
    doc.add_paragraph(
        'Системата се състои от 15 основни таблици: Users, Documents, DocumentVersion, DocumentAccess, '
        'Category, DocumentTag, DocumentPermission, RolePermission, DepartmentPermission, ApprovalWorkflow, '
        'ApprovalStep, ApprovalComment, AuditLog, SecurityEvent, UserActivity'
    )
    
    add_heading_style(doc, '3.2 Микросервисна архитектура', 2)
    doc.add_paragraph('Системата е структурирана като пет независими Django приложения:', style='List Bullet')
    
    services = [
        ('Users App', 'Управление на потребители, аутентификация, ролеви управление'),
        ('Documents App', 'Качване, версионирано управление, категоризиране, отслеждане'),
        ('Permissions App', 'Контрол на достъпа, разрешения по документ и отдел'),
        ('Approvals App', 'Одобрителни работни процеси, многоступенни одобрения'),
        ('Audit App', 'Одит логване, безопасностни събития, отчети')
    ]
    
    for service_name, description in services:
        p = doc.add_paragraph()
        p.add_run(service_name).bold = True
        p.add_run(': ' + description)
    
    doc.add_page_break()
    
    # CHAPTER 4
    add_heading_style(doc, 'ГЛАВА 4: ИНСТАЛАЦИЯ И КОНФИГУРАЦИЯ', 1)
    
    add_heading_style(doc, '4.1 Предварителни изисквания', 2)
    doc.add_paragraph('Python 3.8 или по-високо')
    doc.add_paragraph('PostgreSQL 12 или по-високо')
    doc.add_paragraph('pip (Python Package Manager)')
    doc.add_paragraph('Виртуална среда (venv)')
    
    add_heading_style(doc, '4.2 Пълна инсталация (Windows)', 2)
    
    add_heading_style(doc, 'Етап 1: Подготовка на средата', 3)
    doc.add_paragraph('cd C:\\Users\\bobo2\\Desktop\\DMS\\backend', style='List Number')
    doc.add_paragraph('python -m venv venv', style='List Number')
    doc.add_paragraph('venv\\Scripts\\activate', style='List Number')
    doc.add_paragraph('python -m pip install --upgrade pip', style='List Number')
    
    add_heading_style(doc, 'Етап 2: Инсталиране на зависимости', 3)
    doc.add_paragraph('pip install -r requirements.txt', style='List Number')
    doc.add_paragraph('pip list | grep -i django', style='List Number')
    
    add_heading_style(doc, 'Етап 3: Конфигурация', 3)
    doc.add_paragraph('copy .env.example .env', style='List Number')
    doc.add_paragraph('Редактирайте .env с текстов редактор', style='List Number')
    doc.add_paragraph('Задайте SECRET_KEY, DB_NAME, DB_USER, DB_PASSWORD, ALLOWED_HOSTS', style='List Number')
    
    add_heading_style(doc, 'Етап 4: Подготовка на база данни', 3)
    doc.add_paragraph('psql -U postgres', style='List Number')
    doc.add_paragraph('CREATE DATABASE dms_db;', style='List Number')
    doc.add_paragraph('CREATE USER dms_user WITH PASSWORD \'your_password\';', style='List Number')
    doc.add_paragraph('GRANT ALL PRIVILEGES ON DATABASE dms_db TO dms_user;', style='List Number')
    doc.add_paragraph('\\q', style='List Number')
    
    add_heading_style(doc, 'Етап 5: Миграции', 3)
    doc.add_paragraph('python manage.py migrate', style='List Number')
    doc.add_paragraph('python manage.py createsuperuser', style='List Number')
    
    add_heading_style(doc, 'Етап 6: Запускане', 3)
    doc.add_paragraph('python manage.py runserver')
    doc.add_paragraph('Сървърът ще слуша на http://localhost:8000')
    
    doc.add_page_break()
    
    # CHAPTER 5
    add_heading_style(doc, 'ГЛАВА 5: УПРАВЛЕНИЕ НА ПОТРЕБИТЕЛИ', 1)
    
    add_heading_style(doc, '5.1 Роли и разрешения', 2)
    
    add_heading_style(doc, 'Администратор', 3)
    doc.add_paragraph('Пълен достъп до всички функции')
    doc.add_paragraph('Управление на потребители')
    doc.add_paragraph('Одобрение на нови потребители')
    doc.add_paragraph('Преглед на одит логове')
    doc.add_paragraph('Управление на разрешения')
    doc.add_paragraph('Архивиране на документи')
    
    add_heading_style(doc, 'Учител', 3)
    doc.add_paragraph('Качване и управление на свои документи')
    doc.add_paragraph('Достъп до документи за своя клас')
    doc.add_paragraph('Одобрение на студентски документи')
    doc.add_paragraph('Преглед на своя активност')
    
    add_heading_style(doc, 'Ученик', 3)
    doc.add_paragraph('Достъп до документи на своя клас')
    doc.add_paragraph('Качване на документи (при одобрение)')
    doc.add_paragraph('Преглед на своя активност')
    
    add_heading_style(doc, '5.2 Процес на регистрация', 2)
    
    add_heading_style(doc, 'За администратор', 3)
    doc.add_paragraph('Администраторът създава акаунт през админ панел', style='List Number')
    doc.add_paragraph('Акаунтът е активен веднага с пълни разрешения', style='List Number')
    
    add_heading_style(doc, 'За учител/ученик', 3)
    doc.add_paragraph('Потребителят се регистрира през приложението', style='List Number')
    doc.add_paragraph('Администратор получава известие', style='List Number')
    doc.add_paragraph('Администратор одобрява/отхвърля в админ панел', style='List Number')
    doc.add_paragraph('Потребител получава съобщение за статуса', style='List Number')
    
    doc.add_page_break()
    
    # CHAPTER 6
    add_heading_style(doc, 'ГЛАВА 6: УПРАВЛЕНИЕ НА ДОКУМЕНТИ', 1)
    
    add_heading_style(doc, '6.1 Качване на документ', 2)
    
    add_heading_style(doc, 'Начинен начин', 3)
    doc.add_paragraph('Отворете приложението на http://localhost:5173', style='List Number')
    doc.add_paragraph('Натиснете "Upload Document"', style='List Number')
    doc.add_paragraph('Попълнете: име, категория, отделение, предмет, тагове, файл', style='List Number')
    doc.add_paragraph('Натиснете Upload', style='List Number')
    doc.add_paragraph('Документът получава статус "Draft"', style='List Number')
    
    add_heading_style(doc, '6.2 Версионирано управление', 2)
    
    add_heading_style(doc, 'Преглед на версии', 3)
    doc.add_paragraph('Отворете документ', style='List Number')
    doc.add_paragraph('Преглед "Version History" показва всички версии', style='List Number')
    doc.add_paragraph('Клик "Download" до версията за сваляне', style='List Number')
    
    add_heading_style(doc, 'Качване на нова версия', 3)
    doc.add_paragraph('Клик "Upload New Version"', style='List Number')
    doc.add_paragraph('Изберете файл и добавете описание', style='List Number')
    doc.add_paragraph('Натиснете Upload', style='List Number')
    
    add_heading_style(doc, 'Възвръщане към предишна версия', 3)
    doc.add_paragraph('Version History → Клик "Restore" до желаната версия', style='List Number')
    doc.add_paragraph('Възвръщането създава нова версия, старата версия остава', style='List Number')
    
    add_heading_style(doc, '6.3 Търсене на документи', 2)
    doc.add_paragraph('По название: въведете текст в търсене')
    doc.add_paragraph('По категория: филтрирайте от падащото меню')
    doc.add_paragraph('По отделение: филтрирайте клас или отдел')
    doc.add_paragraph('По тагове: #Python #Тест')
    doc.add_paragraph('По автор: филтрирайте потребител')
    doc.add_paragraph('По дата: задайте диапазон От-До')
    
    doc.add_page_break()
    
    # CHAPTER 7
    add_heading_style(doc, 'ГЛАВА 7: СИСТЕМА ЗА РАЗРЕШЕНИЯ', 1)
    
    add_heading_style(doc, '7.1 Нивата на разрешения', 2)
    
    add_heading_style(doc, 'Ниво 1: Разрешения по роля', 3)
    doc.add_paragraph('Администратор: view, edit, delete, approve, share')
    doc.add_paragraph('Учител: view, edit, share (за свои документи)')
    doc.add_paragraph('Ученик: view, download')
    
    add_heading_style(doc, 'Ниво 2: Документ-специфични разрешения', 3)
    doc.add_paragraph('Разрешения за конкретни потребители: view, edit, delete, share')
    
    add_heading_style(doc, 'Ниво 3: Разрешения по отделение', 3)
    doc.add_paragraph('can_view - виждане на документи')
    doc.add_paragraph('can_upload - качване на документи')
    doc.add_paragraph('can_approve - одобрение на документи')
    
    add_heading_style(doc, 'Ниво 4: Временни разрешения', 3)
    doc.add_paragraph('Разрешения с дата на изтичане')
    doc.add_paragraph('След дата на изтичане, потребителят няма достъп')
    
    add_heading_style(doc, '7.2 Делегиране на разрешения', 2)
    doc.add_paragraph('За администратор: Администратор → Потребител → Редактиране разрешения')
    doc.add_paragraph('За учител: За свои документи → Документ → Manage Permissions → Grant Access')
    
    doc.add_page_break()
    
    # CHAPTER 8
    add_heading_style(doc, 'ГЛАВА 8: ПРОЦЕС НА ОДОБРЕНИЕ', 1)
    
    add_heading_style(doc, '8.1 Работни процеси на одобрение', 2)
    
    doc.add_paragraph('Draft (черновик)')
    doc.add_paragraph('↓')
    doc.add_paragraph('Pending Approval (чакащо одобрение)')
    doc.add_paragraph('↓')
    doc.add_paragraph('├─→ Approved (одобрено) ✓')
    doc.add_paragraph('└─→ Rejected (отхвърлено) ✗')
    
    add_heading_style(doc, '8.2 Процес на подаване за одобрение', 2)
    
    add_heading_style(doc, 'За учител', 3)
    doc.add_paragraph('Качите документ (автоматично status=draft)', style='List Number')
    doc.add_paragraph('Натиснете "Submit for Approval"', style='List Number')
    doc.add_paragraph('Документът отива в статус "pending_approval"', style='List Number')
    doc.add_paragraph('Администратор получава известие', style='List Number')
    
    add_heading_style(doc, '8.3 Одобрение или отхвърляне', 2)
    
    add_heading_style(doc, 'Одобрение', 3)
    doc.add_paragraph('Администратор → Pending Document → "Approve"', style='List Number')
    doc.add_paragraph('Документът отива в статус "approved"', style='List Number')
    doc.add_paragraph('Всички потребители с access могат да видят/свалят', style='List Number')
    
    add_heading_style(doc, 'Отхвърляне', 3)
    doc.add_paragraph('Администратор → Pending Document → "Reject"', style='List Number')
    doc.add_paragraph('Напишете причина за отхвърляне', style='List Number')
    doc.add_paragraph('Документът отива в статус "rejected"', style='List Number')
    doc.add_paragraph('Автор получава известие и може да преработи', style='List Number')
    
    doc.add_page_break()
    
    # CHAPTER 9
    add_heading_style(doc, 'ГЛАВА 9: API ДОКУМЕНТАЦИЯ', 1)
    
    add_heading_style(doc, '9.1 Аутентификация', 2)
    
    add_heading_style(doc, 'Получаване на JWT токен', 3)
    doc.add_paragraph('POST /api/auth/token/')
    doc.add_paragraph('Request: {"username": "user@example.com", "password": "password123"}')
    doc.add_paragraph('Response: {"access": "token...", "refresh": "token..."}')
    
    add_heading_style(doc, 'Ползване на токена', 3)
    doc.add_paragraph('Header: "Authorization: Bearer YOUR_ACCESS_TOKEN"')
    doc.add_paragraph('Токенът експирира след 1 час')
    doc.add_paragraph('Используйте refresh token за получаване на нов access token')
    
    add_heading_style(doc, '9.2 Потребители (API)', 2)
    
    add_heading_style(doc, 'Регистрация', 3)
    doc.add_paragraph('POST /api/users/')
    doc.add_paragraph('Параметри: username, email, password, role, department')
    doc.add_paragraph('Отговор: Новият потребител с is_approved=false')
    
    add_heading_style(doc, 'Текущ потребител', 3)
    doc.add_paragraph('GET /api/users/me/')
    doc.add_paragraph('Показва информацията на влеклия потребител')
    
    add_heading_style(doc, '9.3 Документи (API)', 2)
    
    add_heading_style(doc, 'Качване на документ', 3)
    doc.add_paragraph('POST /api/documents/')
    doc.add_paragraph('Параметри: title, category, file, department, subject')
    doc.add_paragraph('Отговор: Новият документ със status=draft')
    
    add_heading_style(doc, 'Събиране на документи', 3)
    doc.add_paragraph('GET /api/documents/')
    doc.add_paragraph('Филтри: category, status, department, search')
    doc.add_paragraph('Пейджиране: page, page_size (по подразбиране 20)')
    
    add_heading_style(doc, 'Преглед на документ', 3)
    doc.add_paragraph('GET /api/documents/{id}/')
    doc.add_paragraph('Показва всички версии и метаданни')
    
    add_heading_style(doc, 'Качване на нова версия', 3)
    doc.add_paragraph('POST /api/documents/{id}/upload_version/')
    doc.add_paragraph('Параметри: file, change_description')
    doc.add_paragraph('Результат: Нова версия със увеличен версионен номер')
    
    add_heading_style(doc, 'История на версии', 3)
    doc.add_paragraph('GET /api/documents/{id}/version_history/')
    doc.add_paragraph('Показва всички версии на документ')
    
    add_heading_style(doc, 'Възвръщане към версия', 3)
    doc.add_paragraph('POST /api/documents/{id}/restore_version/')
    doc.add_paragraph('Параметри: version_number')
    doc.add_paragraph('Резултат: Нова версия, възстановена от старата')
    
    add_heading_style(doc, 'Сваляне на документ', 3)
    doc.add_paragraph('GET /api/documents/{id}/download/')
    doc.add_paragraph('Логва действието (IP, време, потребител)')
    doc.add_paragraph('Отговор: URL на файла за сваляне')
    
    add_heading_style(doc, '9.4 Одобрения (API)', 2)
    
    add_heading_style(doc, 'Список на чакащи одобрения', 3)
    doc.add_paragraph('GET /api/approvals/?status=pending')
    doc.add_paragraph('Показва всички документи, чакащи одобрение')
    
    add_heading_style(doc, 'Одобрение на документ', 3)
    doc.add_paragraph('POST /api/approvals/{id}/approve/')
    doc.add_paragraph('Резултат: Документът отива в статус "approved"')
    
    add_heading_style(doc, 'Отхвърляне на документ', 3)
    doc.add_paragraph('POST /api/approvals/{id}/reject/')
    doc.add_paragraph('Параметри: reason (причина)')
    doc.add_paragraph('Резултат: Документът отива в статус "rejected"')
    
    add_heading_style(doc, '9.5 Одит логове (API)', 2)
    doc.add_paragraph('GET /api/audit/logs/ (само администратор)')
    doc.add_paragraph('Филтри: action, user, status, date_from, date_to')
    doc.add_paragraph('Показва всички действия на потребителите')
    
    doc.add_page_break()
    
    # CHAPTER 10
    add_heading_style(doc, 'ГЛАВА 10: ОДИТ И СИГУРНОСТ', 1)
    
    add_heading_style(doc, '10.1 Одит логове', 2)
    
    add_heading_style(doc, 'Покрити действия', 3)
    audit_actions = [
        'Користувателски: login, logout, registration, approval',
        'Документни: upload, download, view, edit, delete',
        'Версионни: version_upload, version_restore',
        'Одобрителни: document_approve, document_reject',
        'Разрешително: permission_grant, permission_revoke'
    ]
    for action in audit_actions:
        doc.add_paragraph(action, style='List Bullet')
    
    add_heading_style(doc, 'Информация логирана', 3)
    info = [
        'Потребител (user ID)',
        'Действие (action type)',
        'Време (timestamp)',
        'IP адрес (ip_address)',
        'User Agent (браузър, ОС)',
        'Статус (success, failure, warning)',
        'Подробности (JSON metadata)'
    ]
    for i in info:
        doc.add_paragraph(i, style='List Bullet')
    
    add_heading_style(doc, '10.2 Сигурностни събития', 2)
    
    events = [
        'failed_login - Неудачен опит за влизане',
        'suspicious_activity - Подозрителна активност',
        'permission_denied - Отказан достъп',
        'file_access_denied - Отказан достъп до файл',
        'invalid_token - Невалиден JWT токен',
        'unusual_download - Необичайно сваляне'
    ]
    for event in events:
        doc.add_paragraph(event, style='List Bullet')
    
    add_heading_style(doc, '10.3 Файлова сигурност', 2)
    
    add_heading_style(doc, 'SHA256 хеширане', 3)
    doc.add_paragraph('Всеки файл получава SHA256 хеш при качване')
    doc.add_paragraph('Използва се за проверка на интегритета')
    doc.add_paragraph('Невъзможност е да бъди подмениран файл')
    
    add_heading_style(doc, 'Валидация на типа файл', 3)
    doc.add_paragraph('Всеки файл се проверява преди качване')
    doc.add_paragraph('Разрешени типове: pdf, doc, docx, xls, xlsx, ppt, pptx, txt, jpg, jpeg, png, gif, zip, rar')
    
    add_heading_style(doc, 'Ограничение на размер', 3)
    doc.add_paragraph('Максимален размер: 100MB')
    doc.add_paragraph('Защита срещу DDoS атаки')
    doc.add_paragraph('Защита на дисковото пространство')
    
    doc.add_page_break()
    
    # CHAPTER 11
    add_heading_style(doc, 'ГЛАВА 11: АДМИНИСТРАТОРСКИ РЪКОВОДСТВО', 1)
    
    add_heading_style(doc, '11.1 Панел администратор', 2)
    
    add_heading_style(doc, 'Достъп до админ панела', 3)
    doc.add_paragraph('URL: http://localhost:8000/admin')
    doc.add_paragraph('Влизане със администраторските учетни данни')
    
    add_heading_style(doc, '11.2 Управление на потребители', 2)
    
    add_heading_style(doc, 'Створяване на нов потребител', 3)
    doc.add_paragraph('Администратор → Users → Add User', style='List Number')
    doc.add_paragraph('Попълнете: username, email, password, role, department', style='List Number')
    doc.add_paragraph('Натиснете Save', style='List Number')
    
    add_heading_style(doc, 'Редактиране на потребител', 3)
    doc.add_paragraph('Администратор → Users → Избор потребител', style='List Number')
    doc.add_paragraph('Смяна на role, department, is_approved, is_active', style='List Number')
    doc.add_paragraph('Натиснете Save', style='List Number')
    
    add_heading_style(doc, 'Одобрение на нови потребители', 3)
    doc.add_paragraph('Администратор → Users → Филтър: is_approved=False', style='List Number')
    doc.add_paragraph('За всеки потребител: проверка на информация', style='List Number')
    doc.add_paragraph('Достав galochka в "Is Approved" и Save', style='List Number')
    
    add_heading_style(doc, '11.3 Управление на документи', 2)
    
    add_heading_style(doc, 'Преглед на всички документи', 3)
    doc.add_paragraph('Администратор → Documents')
    doc.add_paragraph('Филтър по: Status, Category, Department, Upload Date')
    
    add_heading_style(doc, 'Редактиране на документ', 3)
    doc.add_paragraph('Администратор → Documents → Избор документ', style='List Number')
    doc.add_paragraph('Смяна на: Title, Category, Status, Department, Tags', style='List Number')
    doc.add_paragraph('Натиснете Save', style='List Number')
    
    add_heading_style(doc, '11.4 Управление на одобрения', 2)
    
    add_heading_style(doc, 'Преглед на чакащи одобрения', 3)
    doc.add_paragraph('Администратор → Approvals → Филтър: status=pending')
    
    add_heading_style(doc, 'Одобрение на документ', 3)
    doc.add_paragraph('Отворете одобренато', style='List Number')
    doc.add_paragraph('Преглед на документ и метаданни', style='List Number')
    doc.add_paragraph('Натиснете "Approve"', style='List Number')
    doc.add_paragraph('Документът отива в status "approved"', style='List Number')
    
    add_heading_style(doc, 'Отхвърляне на документ', 3)
    doc.add_paragraph('Отворете одобренато', style='List Number')
    doc.add_paragraph('Напишете причина в "Rejection Reason"', style='List Number')
    doc.add_paragraph('Натиснете "Reject"', style='List Number')
    doc.add_paragraph('Документът отива в status "rejected"', style='List Number')
    
    doc.add_page_break()
    
    # CHAPTER 12
    add_heading_style(doc, 'ГЛАВА 12: РЪКОВОДСТВО ЗА ПОТРЕБИТЕЛИ', 1)
    
    add_heading_style(doc, '12.1 Регистрация и влизане', 2)
    
    add_heading_style(doc, 'Регистрация', 3)
    doc.add_paragraph('Адрес: http://localhost:5173', style='List Number')
    doc.add_paragraph('Натиснете "Sign Up"', style='List Number')
    doc.add_paragraph('Попълнете: потребителско име, имейл, пароль, роля, клас', style='List Number')
    doc.add_paragraph('Натиснете "Register"', style='List Number')
    doc.add_paragraph('Чакайте одобрение от администратор', style='List Number')
    
    add_heading_style(doc, 'Влизане', 3)
    doc.add_paragraph('Адрес: http://localhost:5173', style='List Number')
    doc.add_paragraph('Натиснете "Sign In"', style='List Number')
    doc.add_paragraph('Въведете потребителско име и пароль', style='List Number')
    doc.add_paragraph('Натиснете "Sign In"', style='List Number')
    
    add_heading_style(doc, '12.2 Профил потребител', 2)
    
    add_heading_style(doc, 'Преглед на профил', 3)
    doc.add_paragraph('Горен десен ъгъл → "Profile"')
    doc.add_paragraph('Вижте: име, имейл, роля, клас, дата на регистрация')
    
    add_heading_style(doc, 'Промяна на пароль', 3)
    doc.add_paragraph('Профил → "Change Password"', style='List Number')
    doc.add_paragraph('Въведете стара и нова пароль', style='List Number')
    doc.add_paragraph('Натиснете "Save"', style='List Number')
    
    add_heading_style(doc, '12.3 Качване на документ', 2)
    
    add_heading_style(doc, 'Пълна процедура', 3)
    doc.add_paragraph('Клик "Upload Document"', style='List Number')
    doc.add_paragraph('Попълнете форма: название, категория, отделение, предмет, тагове, файл', style='List Number')
    doc.add_paragraph('Натиснете "Upload"', style='List Number')
    doc.add_paragraph('Документът получава статус "Draft"', style='List Number')
    
    add_heading_style(doc, '12.4 Преглед на документи', 2)
    
    add_heading_style(doc, 'Търсене на документ', 3)
    doc.add_paragraph('Въведете текст в търсене: "Математика"', style='List Number')
    doc.add_paragraph('Или филтрирайте по: категория, дата, автор', style='List Number')
    doc.add_paragraph('Резултатите се показват веднага', style='List Number')
    
    add_heading_style(doc, '12.5 Сваляне на документ', 2)
    doc.add_paragraph('Отворете документ', style='List Number')
    doc.add_paragraph('Натиснете "Download"', style='List Number')
    doc.add_paragraph('Файлът ще се изтегли на компютъра', style='List Number')
    doc.add_paragraph('Действието се логва (време, IP адрес)', style='List Number')
    
    doc.add_page_break()
    
    # CHAPTER 13
    add_heading_style(doc, 'ГЛАВА 13: РАЗШИРЕНИ ФУНКЦИИ', 1)
    
    add_heading_style(doc, '13.1 Групови разрешения', 2)
    doc.add_paragraph('Администратор може да даде разрешения на цял отдел')
    doc.add_paragraph('Администратор → Department Permissions')
    doc.add_paragraph('Всички студенти на отдела получават достъп')
    
    add_heading_style(doc, '13.2 Временни разрешения', 2)
    doc.add_paragraph('Разрешение, което изтича автоматично')
    doc.add_paragraph('Дата на даяние: 01.09.2026')
    doc.add_paragraph('Дата на изтичане: 31.12.2026')
    doc.add_paragraph('След дата на изтичане потребителят няма достъп')
    
    add_heading_style(doc, '13.3 Отчеты', 2)
    
    add_heading_style(doc, 'Най-активни потребители', 3)
    doc.add_paragraph('Администратор → Reports → "Most Active Users"')
    doc.add_paragraph('Показва: брой качвания, сваляния, одобрения, последна активност')
    
    add_heading_style(doc, 'Най-активни документи', 3)
    doc.add_paragraph('Администратор → Reports → "Most Downloaded"')
    doc.add_paragraph('Показва: брой сваляния, потребители, версия')
    
    add_heading_style(doc, '13.4 Масово действие', 2)
    doc.add_paragraph('Масово качване на категория')
    doc.add_paragraph('Масово одобрение на документи')
    doc.add_paragraph('Масово даяние на разрешения')
    doc.add_paragraph('Масово архивиране на документи')
    
    doc.add_page_break()
    
    # CHAPTER 14
    add_heading_style(doc, 'ГЛАВА 14: ОТСТРАНУВАЊЕ НА НЕПОЛАДКИ', 1)
    
    add_heading_style(doc, '14.1 Проблеми при инсталация', 2)
    
    add_heading_style(doc, 'PostgreSQL не е инсталиран', 3)
    doc.add_paragraph('Проблем: psql: command not found', style='List Bullet')
    doc.add_paragraph('Решение: Download PostgreSQL от https://www.postgresql.org/download/windows/', style='List Bullet')
    
    add_heading_style(doc, 'Грешка при миграция', 3)
    doc.add_paragraph('Проблем: django.db.utils.ProgrammingError', style='List Bullet')
    doc.add_paragraph('Решение: python manage.py migrate', style='List Bullet')
    
    add_heading_style(doc, '14.2 Проблеми при качване', 2)
    
    add_heading_style(doc, 'Файлът е твърде голям', 3)
    doc.add_paragraph('Проблем: File exceeds maximum size')
    doc.add_paragraph('Решение: Максимум е 100MB, компресирайте файла')
    
    add_heading_style(doc, 'Неподдържан тип файл', 3)
    doc.add_paragraph('Проблем: File type not allowed')
    doc.add_paragraph('Решение: Преобразувайте в .pdf или друг поддържан формат')
    
    add_heading_style(doc, '14.3 Проблеми с производителност', 2)
    
    add_heading_style(doc, 'Списъче на документи се зарежда бавно', 3)
    doc.add_paragraph('Решение: Използвайте филтър или търсене')
    doc.add_paragraph('Решение: Намалете страницата (по-малко документи)')
    
    doc.add_page_break()
    
    # CHAPTER 15
    add_heading_style(doc, 'ГЛАВА 15: DEPLOYMENT И ПРОДУКТИВНА СРЕДА', 1)
    
    add_heading_style(doc, '15.1 Подготовка за продуктивна среда', 2)
    
    add_heading_style(doc, 'Сигурност', 3)
    doc.add_paragraph('DEBUG = False')
    doc.add_paragraph('ALLOWED_HOSTS = [\'your-domain.com\']')
    doc.add_paragraph('SECURE_SSL_REDIRECT = True')
    doc.add_paragraph('SESSION_COOKIE_SECURE = True')
    doc.add_paragraph('CSRF_COOKIE_SECURE = True')
    
    add_heading_style(doc, '15.2 Deployment с Gunicorn', 2)
    doc.add_paragraph('pip install gunicorn')
    doc.add_paragraph('gunicorn --config gunicorn_config.py dms.wsgi:application')
    
    add_heading_style(doc, '15.3 SSL/TLS Сертификат', 2)
    doc.add_paragraph('sudo apt-get install certbot python3-certbot-nginx')
    doc.add_paragraph('sudo certbot certonly --nginx -d your-domain.com')
    
    add_heading_style(doc, '15.4 Архивиране и възстановяване', 2)
    
    add_heading_style(doc, 'Архивиране на база данни', 3)
    doc.add_paragraph('pg_dump -U dms_user -h localhost dms_db > backup.sql')
    
    add_heading_style(doc, 'Възстановяване', 3)
    doc.add_paragraph('psql -U dms_user -h localhost -d dms_db < backup.sql')
    
    add_heading_style(doc, 'Архивиране на файлове', 3)
    doc.add_paragraph('tar -czf media_backup.tar.gz media/')
    
    doc.add_page_break()
    
    # Conclusion
    add_heading_style(doc, 'ЗАКЛЮЧЕНИЕ', 1)
    doc.add_paragraph(
        'Системата за управление на документи е компилирана с всички необходимите компоненти за '
        'образователни заведения. Всяка глава на документацията предоставя подробни инструкции за '
        'всеобхватното разбиране и управление на системата.'
    )
    doc.add_paragraph()
    doc.add_paragraph('За допълнителна помощ, свържете се с администратора или разработчика на системата.')
    doc.add_paragraph()
    doc.add_paragraph('Документация версия: 1.0')
    doc.add_paragraph('Дата на издание: Август 14, 2026')
    doc.add_paragraph('Статус: Production Ready ✅')
    
    # Save document
    doc.save('DOCUMENTATION.docx')
    print("✅ Word документация създана успешно!")
    print("📄 Файл: DOCUMENTATION.docx")
    print("📁 Локация: C:\\Users\\bobo2\\Desktop\\DMS\\backend\\DOCUMENTATION.docx")

if __name__ == '__main__':
    create_documentation()
