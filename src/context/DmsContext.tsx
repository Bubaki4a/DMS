import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EducationalDocument,
  AuditLogEntry,
  User,
  UserRole,
  DocumentCategoryId,
  Subject,
  TargetGrade,
  ApprovalStatus,
  AuditActionType,
  DocumentVersion,
  AccessPolicy,
  AIAnalysis,
  ThemeMode,
} from '../types';
import { INITIAL_USERS, CATEGORIES } from '../data/categories';
import { INITIAL_DOCUMENTS, INITIAL_AUDIT_LOGS } from '../data/mockDocuments';
import { generateChecksum, getFileTypeCategory, downloadSimulatedFile } from '../utils/fileHelpers';
import { canUserViewDocument } from '../utils/permissions';

interface NotificationToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
}

interface DmsContextType {
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  switchUserById: (userId: string) => void;

  documents: EducationalDocument[];
  auditLogs: AuditLogEntry[];
  
  // Navigation & Filtering
  activeTab: 'documents' | 'approvals' | 'upload' | 'audit' | 'analytics' | 'permissions';
  setActiveTab: (tab: 'documents' | 'approvals' | 'upload' | 'audit' | 'analytics' | 'permissions') => void;
  
  activeCategory: DocumentCategoryId | 'all';
  setActiveCategory: (cat: DocumentCategoryId | 'all') => void;
  
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  selectedSubject: Subject | 'all';
  setSelectedSubject: (s: Subject | 'all') => void;
  
  selectedGrade: TargetGrade | 'all';
  setSelectedGrade: (g: TargetGrade | 'all') => void;
  
  selectedStatus: ApprovalStatus | 'all';
  setSelectedStatus: (st: ApprovalStatus | 'all') => void;
  
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;

  // Selected document modal / preview
  activeModalDoc: EducationalDocument | null;
  setActiveModalDoc: (doc: EducationalDocument | null) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;

  // Document Operations
  createDocument: (data: {
    title: string;
    description: string;
    category: DocumentCategoryId;
    subject: Subject;
    targetGrade: TargetGrade;
    tags: string[];
    file: { name: string; size: number; content: string; fileType?: string };
    accessPolicy?: AccessPolicy;
    submitImmediately?: boolean;
  }) => Promise<EducationalDocument>;

  addNewVersion: (
    docId: string,
    file: { name: string; size: number; content: string; fileType?: string },
    changeSummary: string
  ) => void;

  rollbackVersion: (docId: string, targetVersionNumber: string) => void;

  submitForApproval: (docId: string, comment?: string) => void;
  approveDocument: (docId: string, comment?: string) => void;
  rejectDocument: (docId: string, reason: string) => void;
  archiveDocument: (docId: string) => void;
  deleteDocument: (docId: string) => void;
  updateDocumentAccessPolicy: (docId: string, policy: AccessPolicy) => void;

  // Interactions & Logs
  recordDocumentView: (docId: string) => void;
  downloadDocument: (doc: EducationalDocument, version?: DocumentVersion) => void;
  runAiDocumentAnalysis: (docId: string) => Promise<AIAnalysis | null>;
  resetToDefaultData: () => void;

  // Notifications
  toasts: NotificationToast[];
  removeToast: (id: string) => void;
  addToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;

  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;

  // Helpers
  visibleDocuments: EducationalDocument[];
  pendingApprovalsCount: number;
}

const DmsContext = createContext<DmsContextType | undefined>(undefined);

export const DmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('edudoc_current_user');
    if (saved) {
      try {
        const found = INITIAL_USERS.find((u) => u.id === JSON.parse(saved).id);
        if (found) return found;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS[0]; // Admin by default
  });

  const [documents, setDocuments] = useState<EducationalDocument[]>(() => {
    const saved = localStorage.getItem('edudoc_documents_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DOCUMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('edudoc_audit_logs_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [activeTab, setActiveTab] = useState<'documents' | 'approvals' | 'upload' | 'audit' | 'analytics' | 'permissions'>('documents');
  const [activeCategory, setActiveCategory] = useState<DocumentCategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [selectedGrade, setSelectedGrade] = useState<TargetGrade | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ApprovalStatus | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [activeModalDoc, setActiveModalDoc] = useState<EducationalDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('edudoc_theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync theme with HTML documentElement class and localStorage
  useEffect(() => {
    localStorage.setItem('edudoc_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('edudoc_documents_v2', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('edudoc_audit_logs_v2', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('edudoc_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Toast Helpers
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message, timestamp: Date.now() }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch User
  const switchUserById = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      addToast('info', 'Превключване на потребител', `Вече работите като: ${found.name} (${found.positionTitle})`);
      logAudit('VIEW', undefined, undefined, `Превключване на активна сесия към потребител ${found.name} (${found.role})`);
    }
  };

  // Logging function
  const logAudit = (
    action: AuditActionType,
    documentId?: string,
    documentTitle?: string,
    details: string = '',
    status: 'SUCCESS' | 'WARNING' | 'DENIED' = 'SUCCESS'
  ) => {
    const newEntry: AuditLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      user: currentUser,
      action,
      documentId,
      documentTitle,
      details,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
      userAgent: navigator.userAgent.slice(0, 70),
      status,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Record Document View
  const recordDocumentView = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return { ...d, viewCount: d.viewCount + 1 };
        }
        return d;
      })
    );
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      logAudit('VIEW', doc.id, doc.title, `Преглед на документ от ${currentUser.name} (${currentUser.role})`);
    }
  };

  // Download Document
  const downloadDocument = (doc: EducationalDocument, version?: DocumentVersion) => {
    const targetVer = version || doc.versions[doc.versions.length - 1];
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === doc.id) {
          return { ...d, downloadCount: d.downloadCount + 1 };
        }
        return d;
      })
    );

    logAudit(
      'DOWNLOAD',
      doc.id,
      doc.title,
      `Сваляне на файл "${targetVer.fileName}" (${targetVer.versionNumber}) от ${currentUser.name}`
    );

    const fullContent = `${doc.title}
-------------------------------------------------------------
Категория: ${CATEGORIES.find((c) => c.id === doc.category)?.label || doc.category}
Учебен предмет: ${doc.subject}
Целеви клас: ${doc.targetGrade}
Автор: ${doc.author.name} (${doc.author.positionTitle})
Версия: ${targetVer.versionNumber} (Качена на ${new Date(targetVer.uploadedAt).toLocaleString('bg-BG')})
Хеш контролна сума: ${targetVer.checksum}
Статус: ${doc.status.toUpperCase()}
-------------------------------------------------------------

${targetVer.contentSnippet || doc.description}`;

    downloadSimulatedFile(targetVer.fileName, fullContent, targetVer.fileType);
    addToast('success', 'Файлът е изтеглен', `Успешно свалихте "${targetVer.fileName}"`);
  };

  // Create Document
  const createDocument = async (data: {
    title: string;
    description: string;
    category: DocumentCategoryId;
    subject: Subject;
    targetGrade: TargetGrade;
    tags: string[];
    file: { name: string; size: number; content: string; fileType?: string };
    accessPolicy?: AccessPolicy;
    submitImmediately?: boolean;
  }): Promise<EducationalDocument> => {
    const fileType = (data.file.fileType || getFileTypeCategory(data.file.name)) as any;
    const initialVersion: DocumentVersion = {
      id: `ver_${Date.now()}_1`,
      versionNumber: 'v1.0',
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser,
      fileName: data.file.name,
      fileType,
      fileSize: data.file.size,
      changeSummary: 'Първоначално качване на документа в системата.',
      contentSnippet: data.file.content || data.description,
      checksum: generateChecksum(data.file.content || data.title),
    };

    const initialStatus: ApprovalStatus =
      currentUser.role === 'admin'
        ? 'approved'
        : data.submitImmediately
        ? 'pending'
        : 'draft';

    const newDoc: EducationalDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: data.title,
      description: data.description,
      category: data.category,
      subject: data.subject,
      targetGrade: data.targetGrade,
      tags: data.tags,
      status: initialStatus,
      author: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentVersion: 'v1.0',
      versions: [initialVersion],
      approvalHistory:
        currentUser.role === 'admin'
          ? [
              {
                id: `app_${Date.now()}`,
                reviewedBy: currentUser,
                reviewedAt: new Date().toISOString(),
                action: 'approved',
                comment: 'Директно одобрен административен документ.',
                versionReviewed: 'v1.0',
              },
            ]
          : data.submitImmediately
          ? [
              {
                id: `app_${Date.now()}`,
                reviewedBy: currentUser,
                reviewedAt: new Date().toISOString(),
                action: 'submitted',
                comment: 'Изпратен за преглед и одобрение при качването.',
                versionReviewed: 'v1.0',
              },
            ]
          : [],
      accessPolicy: data.accessPolicy || {
        allowedRoles: ['admin', 'teacher', 'student'],
        allowedGrades: [data.targetGrade],
        isPublicForSchool: true,
      },
      downloadCount: 0,
      viewCount: 1,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    logAudit(
      'UPLOAD',
      newDoc.id,
      newDoc.title,
      `Качване на нов документ "${newDoc.title}" (${initialVersion.versionNumber}, ${fileType}) със статус ${initialStatus}`
    );

    addToast(
      'success',
      'Документът е качен',
      initialStatus === 'pending'
        ? 'Документът е качен и изпратен в центъра за одобрения.'
        : initialStatus === 'approved'
        ? 'Документът е качен и одобрен.'
        : 'Документът е записан като чернова.'
    );

    return newDoc;
  };

  // Add New Version to existing document
  const addNewVersion = (
    docId: string,
    file: { name: string; size: number; content: string; fileType?: string },
    changeSummary: string
  ) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    const lastVersion = doc.versions[doc.versions.length - 1];
    const match = lastVersion.versionNumber.match(/v(\d+)\.(\d+)/);
    let nextVersionNum = 'v2.0';
    if (match) {
      const major = parseInt(match[1], 10);
      const minor = parseInt(match[2], 10);
      nextVersionNum = `v${major}.${minor + 1}`;
    }

    const fileType = (file.fileType || getFileTypeCategory(file.name)) as any;
    const newVersion: DocumentVersion = {
      id: `ver_${Date.now()}_${doc.versions.length + 1}`,
      versionNumber: nextVersionNum,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser,
      fileName: file.name,
      fileType,
      fileSize: file.size,
      changeSummary: changeSummary || `Обновяване на файла до версия ${nextVersionNum}`,
      contentSnippet: file.content || lastVersion.contentSnippet,
      checksum: generateChecksum(file.content || file.name + nextVersionNum),
    };

    const newStatus: ApprovalStatus =
      currentUser.role === 'admin'
        ? doc.status
        : doc.status === 'approved'
        ? 'pending'
        : doc.status;

    const updatedDoc: EducationalDocument = {
      ...doc,
      currentVersion: nextVersionNum,
      updatedAt: new Date().toISOString(),
      status: newStatus,
      versions: [...doc.versions, newVersion],
      approvalHistory:
        newStatus === 'pending' && doc.status === 'approved'
          ? [
              ...doc.approvalHistory,
              {
                id: `app_${Date.now()}`,
                reviewedBy: currentUser,
                reviewedAt: new Date().toISOString(),
                action: 'submitted',
                comment: `Качена е нова версия ${nextVersionNum}. Документът изисква повторно одобрение.`,
                versionReviewed: nextVersionNum,
              },
            ]
          : doc.approvalHistory,
    };

    setDocuments((prev) => prev.map((d) => (d.id === docId ? updatedDoc : d)));
    if (activeModalDoc?.id === docId) {
      setActiveModalDoc(updatedDoc);
    }

    logAudit(
      'NEW_VERSION',
      doc.id,
      doc.title,
      `Качване на версия ${nextVersionNum} (${newVersion.fileName}). Описание: ${changeSummary}`
    );

    addToast('success', 'Нова версия е добавена', `Версия ${nextVersionNum} е регистрирана успешно.`);
  };

  // Rollback to prior version without data loss (creates a new version based on historic version)
  const rollbackVersion = (docId: string, targetVersionNumber: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    const targetVer = doc.versions.find((v) => v.versionNumber === targetVersionNumber);
    if (!targetVer) return;

    const lastVer = doc.versions[doc.versions.length - 1];
    const match = lastVer.versionNumber.match(/v(\d+)\.(\d+)/);
    let nextVerNum = 'v3.0';
    if (match) {
      const major = parseInt(match[1], 10);
      const minor = parseInt(match[2], 10);
      nextVerNum = `v${major}.${minor + 1}`;
    }

    const rollbackVersionObj: DocumentVersion = {
      id: `ver_rollback_${Date.now()}`,
      versionNumber: nextVerNum,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser,
      fileName: targetVer.fileName,
      fileType: targetVer.fileType,
      fileSize: targetVer.fileSize,
      changeSummary: `Връщане към състоянието от версия ${targetVersionNumber} (създадена на ${new Date(
        targetVer.uploadedAt
      ).toLocaleDateString('bg-BG')})`,
      contentSnippet: targetVer.contentSnippet,
      checksum: targetVer.checksum,
    };

    const updatedDoc: EducationalDocument = {
      ...doc,
      currentVersion: nextVerNum,
      updatedAt: new Date().toISOString(),
      versions: [...doc.versions, rollbackVersionObj],
    };

    setDocuments((prev) => prev.map((d) => (d.id === docId ? updatedDoc : d)));
    if (activeModalDoc?.id === docId) {
      setActiveModalDoc(updatedDoc);
    }

    logAudit(
      'ROLLBACK',
      doc.id,
      doc.title,
      `Възстановяване на документ до съдържание от версия ${targetVersionNumber} (генерирана нова версия ${nextVerNum}) от ${currentUser.name}`
    );

    addToast(
      'success',
      'Версията е възстановена',
      `Документът е върнат към съдържанието от ${targetVersionNumber} като нова версия ${nextVerNum}.`
    );
  };

  // Submit for approval
  const submitForApproval = (docId: string, comment: string = 'Изпратено за одобрение от автора') => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    const updatedDoc: EducationalDocument = {
      ...doc,
      status: 'pending',
      updatedAt: new Date().toISOString(),
      approvalHistory: [
        ...doc.approvalHistory,
        {
          id: `app_${Date.now()}`,
          reviewedBy: currentUser,
          reviewedAt: new Date().toISOString(),
          action: 'submitted',
          comment,
          versionReviewed: doc.currentVersion,
        },
      ],
    };

    setDocuments((prev) => prev.map((d) => (d.id === docId ? updatedDoc : d)));
    if (activeModalDoc?.id === docId) setActiveModalDoc(updatedDoc);

    logAudit('EDIT', doc.id, doc.title, `Документът е изпратен за одобрение към ръководството.`);
    addToast('info', 'Изпратено за одобрение', `Документът "${doc.title}" очаква преглед.`);
  };

  // Approve Document
  const approveDocument = (docId: string, comment: string = 'Одобрено от администрацията') => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    const updatedDoc: EducationalDocument = {
      ...doc,
      status: 'approved',
      updatedAt: new Date().toISOString(),
      rejectionReason: undefined,
      approvalHistory: [
        ...doc.approvalHistory,
        {
          id: `app_${Date.now()}`,
          reviewedBy: currentUser,
          reviewedAt: new Date().toISOString(),
          action: 'approved',
          comment,
          versionReviewed: doc.currentVersion,
        },
      ],
    };

    setDocuments((prev) => prev.map((d) => (d.id === docId ? updatedDoc : d)));
    if (activeModalDoc?.id === docId) setActiveModalDoc(updatedDoc);

    logAudit('APPROVE', doc.id, doc.title, `Документът е одобрен от ${currentUser.name} (${currentUser.positionTitle}). Коментар: ${comment}`);
    addToast('success', 'Документът е одобрен', `"${doc.title}" вече е публично достъпен за целевите потребители.`);
  };

  // Reject Document
  const rejectDocument = (docId: string, reason: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    const updatedDoc: EducationalDocument = {
      ...doc,
      status: 'rejected',
      rejectionReason: reason,
      updatedAt: new Date().toISOString(),
      approvalHistory: [
        ...doc.approvalHistory,
        {
          id: `app_${Date.now()}`,
          reviewedBy: currentUser,
          reviewedAt: new Date().toISOString(),
          action: 'rejected',
          comment: reason,
          versionReviewed: doc.currentVersion,
        },
      ],
    };

    setDocuments((prev) => prev.map((d) => (d.id === docId ? updatedDoc : d)));
    if (activeModalDoc?.id === docId) setActiveModalDoc(updatedDoc);

    logAudit('REJECT', doc.id, doc.title, `Документът е върнат за корекция от ${currentUser.name}. Причина: ${reason}`);
    addToast('warning', 'Документът е върнат за корекция', `Забележка: ${reason}`);
  };

  // Archive Document
  const archiveDocument = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    const updatedDoc: EducationalDocument = {
      ...doc,
      status: 'archived',
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => prev.map((d) => (d.id === docId ? updatedDoc : d)));
    if (activeModalDoc?.id === docId) setActiveModalDoc(updatedDoc);

    logAudit('ARCHIVE', doc.id, doc.title, `Архивиране на документ от ${currentUser.name}`);
    addToast('info', 'Документът е архивиран', `"${doc.title}" е преместен в архива.`);
  };

  // Delete Document
  const deleteDocument = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    if (activeModalDoc?.id === docId) setActiveModalDoc(null);

    logAudit('EDIT', doc.id, doc.title, `Изтриване на документ "${doc.title}" от ${currentUser.name}`);
    addToast('info', 'Документът е изтрит', `"${doc.title}" беше премахнат.`);
  };

  // Update Access Policy
  const updateDocumentAccessPolicy = (docId: string, policy: AccessPolicy) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    const updatedDoc: EducationalDocument = {
      ...doc,
      accessPolicy: policy,
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => prev.map((d) => (d.id === docId ? updatedDoc : d)));
    if (activeModalDoc?.id === docId) setActiveModalDoc(updatedDoc);

    logAudit(
      'PERMISSION_UPDATE',
      doc.id,
      doc.title,
      `Актуализирани права за достъп: Роли=[${policy.allowedRoles.join(', ')}], Класове=[${policy.allowedGrades.join(', ')}]`
    );

    addToast('success', 'Правата са обновени', 'Конфигурацията на достъпа е запазена.');
  };

  // Run AI Document Analysis
  const runAiDocumentAnalysis = async (docId: string): Promise<AIAnalysis | null> => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return null;

    try {
      const lastVer = doc.versions[doc.versions.length - 1];
      const response = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: doc.title,
          category: CATEGORIES.find((c) => c.id === doc.category)?.label || doc.category,
          subject: doc.subject,
          targetGrade: doc.targetGrade,
          fileName: lastVer.fileName,
          content: lastVer.contentSnippet || doc.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Грешка при AI анализа');
      }

      const analysis: AIAnalysis = await response.json();

      const updatedDoc: EducationalDocument = {
        ...doc,
        aiAnalysis: analysis,
        // merge suggested tags if needed
        tags: Array.from(new Set([...doc.tags, ...(analysis.suggestedTags || [])])),
      };

      setDocuments((prev) => prev.map((d) => (d.id === docId ? updatedDoc : d)));
      if (activeModalDoc?.id === docId) setActiveModalDoc(updatedDoc);

      logAudit('EDIT', doc.id, doc.title, `Генериран интелигентен AI анализ и резюме за документа.`);
      addToast('success', 'AI Анализът е готов', 'Извлечени са ключови концепции и оценка за съответствие.');
      return analysis;
    } catch (err: any) {
      console.error(err);
      addToast('error', 'AI Грешка', 'Неуспешно генериране на AI анализ.');
      return null;
    }
  };

  // Reset demo data
  const resetToDefaultData = () => {
    setDocuments(INITIAL_DOCUMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.removeItem('edudoc_documents_v2');
    localStorage.removeItem('edudoc_audit_logs_v2');
    localStorage.removeItem('edudoc_current_user');
    addToast('info', 'Демо данните са възстановени', 'Системата е върната в първоначално състояние.');
  };

  // Filtered documents for current view
  const visibleDocuments = documents.filter((doc) => {
    // 1. Role permission check
    if (!canUserViewDocument(currentUser, doc)) {
      return false;
    }

    // 2. Category filter
    if (activeCategory !== 'all' && doc.category !== activeCategory) {
      return false;
    }

    // 3. Subject filter
    if (selectedSubject !== 'all' && doc.subject !== selectedSubject) {
      return false;
    }

    // 4. Grade filter
    if (selectedGrade !== 'all' && doc.targetGrade !== selectedGrade) {
      return false;
    }

    // 5. Status filter
    if (selectedStatus !== 'all' && doc.status !== selectedStatus) {
      return false;
    }

    // 6. Tag filter
    if (selectedTag && !doc.tags.includes(selectedTag)) {
      return false;
    }

    // 7. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const catLabel = (CATEGORIES.find((c) => c.id === doc.category)?.label || '').toLowerCase();
      const inTitle = doc.title.toLowerCase().includes(q);
      const inDesc = doc.description.toLowerCase().includes(q);
      const inAuthor = doc.author.name.toLowerCase().includes(q);
      const inSubject = doc.subject.toLowerCase().includes(q);
      const inGrade = doc.targetGrade.toLowerCase().includes(q);
      const inCat = catLabel.includes(q);
      const inTags = doc.tags.some((t) => t.toLowerCase().includes(q));
      const inVer = doc.versions.some(
        (v) => v.fileName.toLowerCase().includes(q) || v.contentSnippet.toLowerCase().includes(q)
      );

      if (!inTitle && !inDesc && !inAuthor && !inSubject && !inGrade && !inCat && !inTags && !inVer) {
        return false;
      }
    }

    return true;
  });

  const pendingApprovalsCount = documents.filter((d) => d.status === 'pending').length;

  return (
    <DmsContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        switchUserById,
        documents,
        auditLogs,
        activeTab,
        setActiveTab,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedSubject,
        setSelectedSubject,
        selectedGrade,
        setSelectedGrade,
        selectedStatus,
        setSelectedStatus,
        selectedTag,
        setSelectedTag,
        activeModalDoc,
        setActiveModalDoc,
        isUploadModalOpen,
        setIsUploadModalOpen,
        createDocument,
        addNewVersion,
        rollbackVersion,
        submitForApproval,
        approveDocument,
        rejectDocument,
        archiveDocument,
        deleteDocument,
        updateDocumentAccessPolicy,
        recordDocumentView,
        downloadDocument,
        runAiDocumentAnalysis,
        resetToDefaultData,
        toasts,
        removeToast,
        addToast,
        visibleDocuments,
        pendingApprovalsCount,
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </DmsContext.Provider>
  );
};

export const useDms = () => {
  const context = useContext(DmsContext);
  if (!context) {
    throw new Error('useDms must be used within a DmsProvider');
  }
  return context;
};
