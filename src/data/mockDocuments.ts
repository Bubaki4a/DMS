import { EducationalDocument, AuditLogEntry } from '../types';
import { INITIAL_USERS } from './categories';

const admin = INITIAL_USERS[0];
const teacherMath = INITIAL_USERS[1];
const teacherBulgarian = INITIAL_USERS[2];
const studentAlex = INITIAL_USERS[3];
const studentElena = INITIAL_USERS[4];

export const INITIAL_DOCUMENTS: EducationalDocument[] = [
  {
    id: 'doc_math_plan_11',
    title: 'Годишно тематично разпределение по Математика — 11 клас (ПП)',
    description: 'Утвърдено тематично разпределение за профилирана подготовка по математика за 11 клас, модул 1 (Геометрия) и модул 2 (Анализ).',
    category: 'curriculum',
    subject: 'Математика',
    targetGrade: '11 клас',
    tags: ['учебен-план', 'математика-11-клас', 'профилирана-подготовка', 'МОН-2025-2026', 'модул-1-2'],
    status: 'approved',
    author: teacherMath,
    createdAt: '2026-02-01T08:30:00Z',
    updatedAt: '2026-02-10T14:15:00Z',
    currentVersion: 'v1.2',
    versions: [
      {
        id: 'ver_math_1',
        versionNumber: 'v1.0',
        uploadedAt: '2026-02-01T08:30:00Z',
        uploadedBy: teacherMath,
        fileName: 'Tematichno_Razpredelenie_Math_11_v1.0.docx',
        fileType: 'docx',
        fileSize: 482000,
        changeSummary: 'Първоначално изготвяне на годишен план по новия учебен стандарт.',
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        contentSnippet: `# ГОДИШНО ТЕМАТИЧНО РАЗПРЕДЕЛЕНИЕ
Учебно заведение: СПГ "Електроника и Информатика"
Учебен предмет: Математика (Профилирана подготовка)
Клас: 11 клас, Учебна година: 2025/2026
Преподавател: д-р Мария Георгиева

Раздел 1: Стереометрия и вектори в пространството (36 часа)
- Взаимно положение на прави и равнини в пространството
- Перпендикулярност и ъгъл между права и равнина
- Двустенни и многостенни ъгли
- Координатна система и скаларно произведение в пространството

Раздел 2: Математически анализ — Числови редици и функции (44 часа)
- Граница на числова редица, теореми за граници
- Непрекъснатост на функция, точки на прекъсване
- Производна на функция и геометричен смисъл
- Изследване на функции и построяване на графики`,
      },
      {
        id: 'ver_math_2',
        versionNumber: 'v1.1',
        uploadedAt: '2026-02-05T11:20:00Z',
        uploadedBy: teacherMath,
        fileName: 'Tematichno_Razpredelenie_Math_11_v1.1.docx',
        fileType: 'docx',
        fileSize: 498000,
        changeSummary: 'Добавени часове за лабораторни упражнения със софтуер GeoGebra.',
        checksum: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
        contentSnippet: `# ГОДИШНО ТЕМАТИЧНО РАЗПРЕДЕЛЕНИЕ (Редакция GeoGebra)
Добавен специален модул: "Практическо моделиране със софтуер GeoGebra 3D Calculator"
- 8 учебни часа в компютърния кабинет
- Практически тестове за 3D визуализация на сечения`,
      },
      {
        id: 'ver_math_3',
        versionNumber: 'v1.2',
        uploadedAt: '2026-02-10T14:15:00Z',
        uploadedBy: teacherMath,
        fileName: 'Tematichno_Razpredelenie_Math_11_Final_Approved.pdf',
        fileType: 'pdf',
        fileSize: 524000,
        changeSummary: 'Финален одобрен вариант след съгласуване с ръководството на методическото обединение.',
        checksum: '88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589',
        contentSnippet: `# ГОДИШНО ТЕМАТИЧНО РАЗПРЕДЕЛЕНИЕ — ОДОБРЕНО
Утвърдено от Директора на 10.02.2026 г. с Протокол № 4
Разпределението е в пълно съответствие с учебната програма на МОН.
Включва 144 учебни часа, от които:
- Нови знания: 68 часа
- Упражнения: 48 часа
- Контрол и оценка: 18 часа
- Проектни дейности с GeoGebra: 10 часа`,
      },
    ],
    approvalHistory: [
      {
        id: 'app_m1',
        reviewedBy: teacherMath,
        reviewedAt: '2026-02-01T08:35:00Z',
        action: 'submitted',
        comment: 'Изпратено за преглед и утвърждаване.',
        versionReviewed: 'v1.0',
      },
      {
        id: 'app_m2',
        reviewedBy: admin,
        reviewedAt: '2026-02-03T16:00:00Z',
        action: 'requested_changes',
        comment: 'Моля добавете часове за работа със специализиран софтуер за визуализация на пространствени фигури.',
        versionReviewed: 'v1.0',
      },
      {
        id: 'app_m3',
        reviewedBy: teacherMath,
        reviewedAt: '2026-02-05T11:22:00Z',
        action: 'submitted',
        comment: 'Добавени са 8 часа лабораторни упражнения с GeoGebra в v1.1.',
        versionReviewed: 'v1.1',
      },
      {
        id: 'app_m4',
        reviewedBy: admin,
        reviewedAt: '2026-02-10T14:30:00Z',
        action: 'approved',
        comment: 'Отговаря на всички изисквания. Утвърждавам тематичното разпределение.',
        versionReviewed: 'v1.2',
      },
    ],
    accessPolicy: {
      allowedRoles: ['admin', 'teacher', 'student'],
      allowedGrades: ['11 клас', 'Всички класове'],
      isPublicForSchool: true,
    },
    downloadCount: 42,
    viewCount: 189,
    aiAnalysis: {
      summary: 'Документът дефинира годишния учебен план за профилирана подготовка по математика в 11 клас с фокус върху пространствена геометрия, анализ и GeoGebra симулации.',
      keyConcepts: [
        'Стереометрия и векторен анализ',
        'Диференциално смятане и граници',
        'Лабораторни проекти с GeoGebra 3D',
      ],
      suggestedTags: ['математика-11', 'стереометрия', 'геогебра', 'МОН'],
      complianceScore: 98,
      complianceFeedback: 'Пълно покритие на ядрата на учебното съдържание за 11 клас профилирано обучение.',
    },
  },

  {
    id: 'doc_bel_dzi_guide_12',
    title: 'Наръчник и примерни тестове за ДЗИ по БЕЛ — 12 клас',
    description: 'Обобщени материали за държавен зрелостен изпит: анализ на автори, типови тестови задачи и критерии за оценяване на аргументативен текст.',
    category: 'exam_materials',
    subject: 'Български език и литература',
    targetGrade: '12 клас',
    tags: ['ДЗИ', 'матура-БЕЛ', '12-клас', 'литературен-анализ', 'есе-интерпретативно-съчинение'],
    status: 'approved',
    author: teacherBulgarian,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-20T16:40:00Z',
    currentVersion: 'v1.0',
    versions: [
      {
        id: 'ver_bel_1',
        versionNumber: 'v1.0',
        uploadedAt: '2026-01-15T10:00:00Z',
        uploadedBy: teacherBulgarian,
        fileName: 'Narychnik_DZI_BEL_2026_Final.pdf',
        fileType: 'pdf',
        fileSize: 1250000,
        changeSummary: 'Първа цялостна редакция за випуск 2026 с включени 5 примерни варианта.',
        checksum: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
        contentSnippet: `# ПОМАГАЛО ЗА ДЪРЖАВЕН ЗРЕЛОСТЕН ИЗПИТ ПО БЕЛ
Съставител: Пламен Димитров, старши учител

СТРУКТУРА НА ИЗПИТА:
Модул 1: Тестови въпроси по български правопис, пунктуация и стилистика (въпроси 1-25)
Модул 2: Извличане на информация и текстови анализ (въпроси 26-40)
Модул 3: Създаване на аргументативен текст (тема 41 — ЛИС или есе)

Ключови автори в конспекта:
1. Христо Ботев („Майце си“, „Към брата си“, „Хаджи Димитър“, „Обесването на Васил Левски“)
2. Иван Вазов („Левски“, „Паисий“, „Опълченците на Шипка“, „Чичовци“, „Под игото“)
3. Алеко Константинов („Разни хора, разни идеали“, „Бай Ганьо“)
4. Пенчо Славейков, Пейо Яворов, Димчо Дебелянов, Гео Милев, Никола Вапцаров, Димитър Димов, Димитър Талев.`,
      },
    ],
    approvalHistory: [
      {
        id: 'app_b1',
        reviewedBy: teacherBulgarian,
        reviewedAt: '2026-01-15T10:05:00Z',
        action: 'submitted',
        comment: 'Готово помагало за 12 клас.',
        versionReviewed: 'v1.0',
      },
      {
        id: 'app_b2',
        reviewedBy: admin,
        reviewedAt: '2026-01-20T16:40:00Z',
        action: 'approved',
        comment: 'Отличен наръчник. Одобрено за публикуване към всички 12-ти класове.',
        versionReviewed: 'v1.0',
      },
    ],
    accessPolicy: {
      allowedRoles: ['admin', 'teacher', 'student'],
      allowedGrades: ['12 клас', 'Всички класове'],
      isPublicForSchool: true,
    },
    downloadCount: 112,
    viewCount: 345,
    aiAnalysis: {
      summary: 'Изчерпателен наръчник за подготовка за ДЗИ по БЕЛ за 12 клас с анализи на конспектните автори, граматични правила и методики за писане на аргументативен текст.',
      keyConcepts: [
        'Норми на книжовния български език',
        'Интерпретативно съчинение vs. Есе',
        'Периодизация и тематични кръгове в българската литература',
      ],
      suggestedTags: ['ДЗИ', 'матура-БЕЛ', 'Ботев', 'Вазов', 'аргументативен-текст'],
      complianceScore: 100,
      complianceFeedback: 'Строго съответствие с официалния модел на МОН за ДЗИ по БЕЛ.',
    },
  },

  {
    id: 'doc_order_school_rules',
    title: 'Заповед № РД-09-142/2026: Организация на втория учебен срок и вътрешен ред',
    description: 'Официална заповед на Директора за утвърждаване на графика за контролни и класни работи, дежурства на учители и мерки за сигурност.',
    category: 'admin_orders',
    subject: 'Администрация',
    targetGrade: 'Всички класове',
    tags: ['заповед', 'директор', 'вътрешен-ред', 'график-класни', 'дежурства', 'сигурност'],
    status: 'approved',
    author: admin,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-01T09:00:00Z',
    currentVersion: 'v1.0',
    versions: [
      {
        id: 'ver_ord_1',
        versionNumber: 'v1.0',
        uploadedAt: '2026-02-01T09:00:00Z',
        uploadedBy: admin,
        fileName: 'Zapoved_RD_09_142_Vtori_Srok_2026.pdf',
        fileType: 'pdf',
        fileSize: 310000,
        changeSummary: 'Официално издадена заповед.',
        checksum: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        contentSnippet: `РЕПУБЛИКА БЪЛГАРИЯ
МИНИСТЕРСТВО НА ОБРАЗОВАНИЕТО И НАУКАТА
СПГ "ЕЛЕКТРОНИКА И ИНФОРМАТИКА"

ЗАПОВЕД № РД-09-142
гр. София, 01.02.2026 г.

На основание чл. 259, ал. 1 от ЗПУО и решение на Педагогическия съвет,

НАРЕЖДАМ:
1. Утвърждавам графика за провеждане на класните и контролните работи за втория учебен срок на учебната 2025/2026 година.
2. Всички учители да нанесат темите и датите в електронната система не по-късно от 7 дни преди провеждането.
3. Учениците да бъдат запознати с критериите за оценяване предварително.
4. Контрол по изпълнението възлагам на заместник-директора по учебната дейност.

Директор: инж. Иван Петров`,
      },
    ],
    approvalHistory: [
      {
        id: 'app_ord_1',
        reviewedBy: admin,
        reviewedAt: '2026-02-01T09:00:00Z',
        action: 'approved',
        comment: 'Директно издадена и подписана от директора административна заповед.',
        versionReviewed: 'v1.0',
      },
    ],
    accessPolicy: {
      allowedRoles: ['admin', 'teacher', 'student'],
      allowedGrades: ['Всички класове'],
      isPublicForSchool: true,
    },
    downloadCount: 78,
    viewCount: 420,
    aiAnalysis: {
      summary: 'Официална административна заповед за регламентиране на графика на контролните работи и дежурствата през втория учебен срок.',
      keyConcepts: ['График за класни работи', 'Задължения на педагогическия състав', 'Срокове и контрол'],
      suggestedTags: ['заповед-директор', 'втори-срок', 'ЗПУО'],
      complianceScore: 100,
      complianceFeedback: 'Юридически изрядна заповед по чл. 259 от ЗПУО.',
    },
  },

  {
    id: 'doc_it_project_11a',
    title: 'Курсов проект: Архитектура на REST API с Python Django и PostgreSQL',
    description: 'Учебно задание и разработка на софтуерен проект за учениците от 11А клас, специалност „Системно програмиране“.',
    category: 'homework_projects',
    subject: 'Информатика и ИТ',
    targetGrade: '11 клас',
    tags: ['курсов-проект', 'Django', 'REST-API', 'PostgreSQL', '11А-клас', 'ИТ'],
    status: 'pending',
    author: studentAlex,
    createdAt: '2026-02-12T13:00:00Z',
    updatedAt: '2026-02-13T09:45:00Z',
    currentVersion: 'v1.1',
    versions: [
      {
        id: 'ver_it_1',
        versionNumber: 'v1.0',
        uploadedAt: '2026-02-12T13:00:00Z',
        uploadedBy: studentAlex,
        fileName: 'Alex_Dimitrov_Project_Django_v1.0.docx',
        fileType: 'docx',
        fileSize: 840000,
        changeSummary: 'Първа чернова на курсовата работа.',
        checksum: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
        contentSnippet: `# КУРСОВ ПРОЕКТ ПО СОФТУЕРНИ СИСТЕМИ
Тема: "Разработка на защитен бекенд REST API за училищна система с Django и PostgreSQL"
Автор: Александър Димитров, 11А клас
Ръководител: д-р Мария Георгиева

1. Въведение и архитектурен стек:
- Python 3.12 + Django 5.x
- Django REST Framework (DRF)
- PostgreSQL база данни с connection pooling
- JWT (JSON Web Tokens) автентикация с ролеви достъп (RBAC)

2. Модел на данни:
- User (Custom AbstractUser с роли: Admin, Teacher, Student)
- Document (title, file_path, category, grade_level, status)
- DocumentVersion (document_fk, version_num, hash, change_log)
- AuditLog (action, user_fk, timestamp, ip_address)`,
      },
      {
        id: 'ver_it_2',
        versionNumber: 'v1.1',
        uploadedAt: '2026-02-13T09:45:00Z',
        uploadedBy: studentAlex,
        fileName: 'Alex_Dimitrov_Project_Django_v1.1_with_Tests.docx',
        fileType: 'docx',
        fileSize: 920000,
        changeSummary: 'Добавени unit тестове за проверка на версионирането и правата за достъп.',
        checksum: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
        contentSnippet: `# КУРСОВ ПРОЕКТ (Редакция v1.1 с Тестове)
Добавен раздел 3: "Автоматизирано тестване и сигурност":
- Django TestCase за ролеви права (ученикът няма достъп до чернови на учители)
- Тест за валидация на файлови разширения (.pdf, .docx, .xlsx, .pptx)
- Тест за гарантиране на неделимост на одит логовете`,
      },
    ],
    approvalHistory: [
      {
        id: 'app_it_1',
        reviewedBy: studentAlex,
        reviewedAt: '2026-02-13T09:50:00Z',
        action: 'submitted',
        comment: 'Предавам курсовия проект за проверка и оценка от комисията.',
        versionReviewed: 'v1.1',
      },
    ],
    accessPolicy: {
      allowedRoles: ['admin', 'teacher', 'student'],
      allowedGrades: ['11 клас', 'Всички класове'],
      isPublicForSchool: false,
    },
    downloadCount: 15,
    viewCount: 56,
    aiAnalysis: {
      summary: 'Технически курсов проект на ученик от 11А клас, разглеждащ дизайн на REST API с Django, PostgreSQL, ролево базиран достъп и автоматизирани тестове.',
      keyConcepts: [
        'Django ORM и PostgreSQL транзакции',
        'Ролеви права (RBAC)',
        'Автоматизирано тестване и валидация на файлове',
      ],
      suggestedTags: ['Django', 'PostgreSQL', 'курсова-работа', '11А', 'REST-API'],
      complianceScore: 96,
      complianceFeedback: 'Отлично структурирана инженерна разработка за среден курс по софтуерни науки.',
    },
  },

  {
    id: 'doc_pedagogical_prot_6',
    title: 'Протокол № 6 от заседание на Педагогическия съвет (08.02.2026 г.)',
    description: 'Официален протокол с взети решения относно утвърждаване на учебни планове, стипендии за отличен успех и олимпиади.',
    category: 'pedagogical_protocols',
    subject: 'Администрация',
    targetGrade: 'Педагогически съвет',
    tags: ['протокол', 'педагогически-съвет', 'стипендии', 'решения', 'учители'],
    status: 'approved',
    author: admin,
    createdAt: '2026-02-08T17:00:00Z',
    updatedAt: '2026-02-08T17:00:00Z',
    currentVersion: 'v1.0',
    versions: [
      {
        id: 'ver_ped_1',
        versionNumber: 'v1.0',
        uploadedAt: '2026-02-08T17:00:00Z',
        uploadedBy: admin,
        fileName: 'Protokol_PS_06_2026_02_08.pdf',
        fileType: 'pdf',
        fileSize: 620000,
        changeSummary: 'Официално подписан протокол с присъствен лист.',
        checksum: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        contentSnippet: `ПРОТОКОЛ № 6
от заседание на Педагогическия съвет на СПГ "Електроника и Информатика"
проведено на 08.02.2026 г.

ПРИСЪСТВАТ: 46 членове на педагогическия състав.
ДНЕВЕН РЕД:
1. Анализ на резултатите от първия учебен срок.
2. Присъждане на стипендии за постигнати високи образователни резултати.
3. Одобряване на графици за допълнителна подготовка за ДЗИ и НВО.

РЕШЕНИЯ:
По т. 1: Приема се отчетът на заместник-директора с 45 гласа "ЗА", 1 "ВЪЗДЪРЖАЛ СЕ".
По т. 2: Одобрява се списъкът на 84 ученици с успех над 5.50 за месечна стипендия.
По т. 3: Утвърждават се часовете за консултации за 10 и 12 клас.

Протоколчик: старши учител Е. Иванова
Председател: инж. Иван Петров`,
      },
    ],
    approvalHistory: [
      {
        id: 'app_ped_1',
        reviewedBy: admin,
        reviewedAt: '2026-02-08T17:05:00Z',
        action: 'approved',
        comment: 'Утвърден и влязъл в сила протокол.',
        versionReviewed: 'v1.0',
      },
    ],
    accessPolicy: {
      allowedRoles: ['admin', 'teacher'],
      allowedGrades: ['Педагогически съвет', 'Административно ръководство'],
      isPublicForSchool: false,
    },
    downloadCount: 38,
    viewCount: 92,
    aiAnalysis: {
      summary: 'Протокол от заседание на педагогически съвет, включващ решения за присъждане на стипендии на 84 ученици и отчет за първи срок.',
      keyConcepts: ['Анализ на успеха', 'Училищни стипендии', 'Консултации за ДЗИ/НВО'],
      suggestedTags: ['протокол-ПС', 'стипендии', 'първи-срок'],
      complianceScore: 100,
      complianceFeedback: 'Официален документ за вътрешно-институционално ползване от педагогическия състав.',
    },
  },

  {
    id: 'doc_form_absence_request',
    title: 'Бланка: Заявление за отсъствие на ученик до 15 дни (по уважителни причини)',
    description: 'Стандартна бланка за родители и настойници съгласно чл. 62 от Наредбата за приобщаващо образование.',
    category: 'forms_templates',
    subject: 'Общоучилищни',
    targetGrade: 'Всички класове',
    tags: ['бланка', 'заявление', 'отсъствия', 'родители', 'образец-МОН'],
    status: 'approved',
    author: admin,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
    currentVersion: 'v1.0',
    versions: [
      {
        id: 'ver_form_1',
        versionNumber: 'v1.0',
        uploadedAt: '2026-01-10T08:00:00Z',
        uploadedBy: admin,
        fileName: 'Blank_Zayavlenie_Otsystvie_15_Dni.docx',
        fileType: 'docx',
        fileSize: 185000,
        changeSummary: 'Актуализиран образец по Наредбата за приобщаващо образование.',
        checksum: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        contentSnippet: `ДО ДИРЕКТОРА НА
СПГ "ЕЛЕКТРОНИКА И ИНФОРМАТИКА"

З А Я В Л Е Н И Е
от родител / настойник: ........................................................................
Телефон за контакт: ........................................... Е-поща: ....................................

УВАЖАЕМИ ГОСПОДИН ДИРЕКТОР,
Моля да разрешите на сина/дъщеря ми: ......................................................,
ученик/чка в ........ клас, да отсъства от учебни занятия за периода:
от ...................... г. до ...................... г. (общо ...... учебни дни),
по следните уважителни семейни причини: ......................................................

Дата: ......................                               Подпис на родителя: ......................`,
      },
    ],
    approvalHistory: [
      {
        id: 'app_f1',
        reviewedBy: admin,
        reviewedAt: '2026-01-10T08:10:00Z',
        action: 'approved',
        comment: 'Официален образец за свободно сваляне от родители и ученици.',
        versionReviewed: 'v1.0',
      },
    ],
    accessPolicy: {
      allowedRoles: ['admin', 'teacher', 'student'],
      allowedGrades: ['Всички класове'],
      isPublicForSchool: true,
    },
    downloadCount: 164,
    viewCount: 512,
    aiAnalysis: {
      summary: 'Официална бланка за извиняване на отсъствия до 15 дни с мотивирано заявление от родител съгласно актуалните разпоредби на МОН.',
      keyConcepts: ['Заявление за отсъствие', 'Наредба за приобщаващо образование', 'Права на родителите'],
      suggestedTags: ['бланка', 'заявление', 'отсъствие-15-дни'],
      complianceScore: 100,
      complianceFeedback: 'Стандартизиран формуляр.',
    },
  },

  {
    id: 'doc_physics_draft_10',
    title: 'Тест за входно ниво по Физика и астрономия — 10 клас (Вариант А и Б)',
    description: 'Проект на диагностичен тест за проверка на знанията за електричен ток, електромагнетизъм и оптични явления.',
    category: 'exam_materials',
    subject: 'Физика и астрономия',
    targetGrade: '10 клас',
    tags: ['физика-10-клас', 'тест', 'електромагнетизъм', 'оптика', 'чернова'],
    status: 'draft',
    author: teacherMath,
    createdAt: '2026-02-13T11:00:00Z',
    updatedAt: '2026-02-13T11:00:00Z',
    currentVersion: 'v0.9',
    versions: [
      {
        id: 'ver_phy_1',
        versionNumber: 'v0.9',
        uploadedAt: '2026-02-13T11:00:00Z',
        uploadedBy: teacherMath,
        fileName: 'Test_Fizika_10_Vhodno_Draft.docx',
        fileType: 'docx',
        fileSize: 340000,
        changeSummary: 'Работна чернова за колегиално обсъждане.',
        checksum: 'c2356056e8e82ef6f9e2b1eb79cf995287f3b55a0134f71a067ff505d04588cb',
        contentSnippet: `# ТЕСТ ПО ФИЗИКА И АСТРОНОМИЯ — 10 КЛАС (Чернова)
Въпрос 1: Закон на Ом за част от веригата — формула и мерни единици.
Въпрос 2: Пресметнете еквивалентното съпротивление на три резистора по 6 Ohm, свързани успоредно.
Въпрос 3: Опишете явлението пълно вътрешно отражение и приложението му в оптичните кабели.
Въпрос 4: Спектрални класове на звездите и диаграма на Херцшпрунг-Ръсел.`,
      },
    ],
    approvalHistory: [],
    accessPolicy: {
      allowedRoles: ['admin', 'teacher'],
      allowedGrades: ['10 клас'],
      isPublicForSchool: false,
    },
    downloadCount: 2,
    viewCount: 8,
    aiAnalysis: {
      summary: 'Чернова на тест за входно ниво по физика за 10 клас, обхващащ раздели електричество, оптика и основи на астрономията.',
      keyConcepts: ['Закон на Ом', 'Оптика и отражение', 'Астрофизика'],
      suggestedTags: ['физика-10', 'тест-входно-ниво', 'закон-на-Ом'],
      complianceScore: 92,
      complianceFeedback: 'Балансирани въпроси с различна степен на сложност.',
    },
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_001',
    timestamp: '2026-02-13T14:38:12Z',
    user: studentAlex,
    action: 'VIEW',
    documentId: 'doc_math_plan_11',
    documentTitle: 'Годишно тематично разпределение по Математика — 11 клас (ПП)',
    details: 'Преглед на версия v1.2 от ученик 11А клас през уеб браузър',
    ipAddress: '192.168.10.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Chrome/122.0)',
    status: 'SUCCESS',
  },
  {
    id: 'log_002',
    timestamp: '2026-02-13T14:10:05Z',
    user: studentAlex,
    action: 'DOWNLOAD',
    documentId: 'doc_bel_dzi_guide_12',
    documentTitle: 'Наръчник и примерни тестове за ДЗИ по БЕЛ — 12 клас',
    details: 'Сваляне на файл "Narychnik_DZI_BEL_2026_Final.pdf" (1.2 MB)',
    ipAddress: '192.168.10.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Chrome/122.0)',
    status: 'SUCCESS',
  },
  {
    id: 'log_003',
    timestamp: '2026-02-13T09:50:00Z',
    user: studentAlex,
    action: 'NEW_VERSION',
    documentId: 'doc_it_project_11a',
    documentTitle: 'Курсов проект: Архитектура на REST API с Python Django и PostgreSQL',
    details: 'Качване на нова версия v1.1 с добавени unit тестове',
    ipAddress: '192.168.10.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Chrome/122.0)',
    status: 'SUCCESS',
  },
  {
    id: 'log_004',
    timestamp: '2026-02-10T14:30:00Z',
    user: admin,
    action: 'APPROVE',
    documentId: 'doc_math_plan_11',
    documentTitle: 'Годишно тематично разпределение по Математика — 11 клас (ПП)',
    details: 'Одобрение на финална версия v1.2 от директора с коментар за съответствие',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2)',
    status: 'SUCCESS',
  },
  {
    id: 'log_005',
    timestamp: '2026-02-08T17:05:00Z',
    user: admin,
    action: 'UPLOAD',
    documentId: 'doc_pedagogical_prot_6',
    documentTitle: 'Протокол № 6 от заседание на Педагогическия съвет (08.02.2026 г.)',
    details: 'Публикуване на официален протокол от ПС за учителския колектив',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2)',
    status: 'SUCCESS',
  },
  {
    id: 'log_006',
    timestamp: '2026-02-05T11:20:00Z',
    user: teacherMath,
    action: 'EDIT',
    documentId: 'doc_math_plan_11',
    documentTitle: 'Годишно тематично разпределение по Математика — 11 клас (ПП)',
    details: 'Редакция на метаданни и качване на версия v1.1 с GeoGebra часове',
    ipAddress: '192.168.2.14',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Firefox/123.0)',
    status: 'SUCCESS',
  },
  {
    id: 'log_007',
    timestamp: '2026-02-01T09:00:00Z',
    user: admin,
    action: 'UPLOAD',
    documentId: 'doc_order_school_rules',
    documentTitle: 'Заповед № РД-09-142/2026: Организация на втория учебен срок и вътрешен ред',
    details: 'Издаване и публикуване на заповед на директора за цялото училище',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2)',
    status: 'SUCCESS',
  },
  {
    id: 'log_008',
    timestamp: '2026-01-10T08:10:00Z',
    user: studentElena,
    action: 'DOWNLOAD',
    documentId: 'doc_form_absence_request',
    documentTitle: 'Бланка: Заявление за отсъствие на ученик до 15 дни (по уважителни причини)',
    details: 'Сваляне на формуляр за извиняване на отсъствие',
    ipAddress: '192.168.10.88',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3)',
    status: 'SUCCESS',
  },
];
