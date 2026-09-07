import React, { useState, useEffect } from 'react';
import { useDms } from '../context/DmsContext';
import { EducationalDocument, DocumentVersion, AccessPolicy } from '../types';
import { CATEGORIES, TARGET_GRADES } from '../data/categories';
import { formatFileSize, formatDate, generateChecksum } from '../utils/fileHelpers';
import {
  canUserEditDocument,
  canUserApproveDocument,
  canUserDeleteDocument,
} from '../utils/permissions';
import {
  X,
  FileText,
  GitBranch,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Shield,
  Activity,
  UserCheck,
  Send,
  Trash2,
  Archive,
  Copy,
  Hash,
  BookOpen,
} from 'lucide-react';

interface DocumentDetailModalProps {
  doc: EducationalDocument | null;
  onClose: () => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({ doc, onClose }) => {
  const {
    currentUser,
    downloadDocument,
    addNewVersion,
    rollbackVersion,
    submitForApproval,
    approveDocument,
    rejectDocument,
    archiveDocument,
    deleteDocument,
    updateDocumentAccessPolicy,
    runAiDocumentAnalysis,
    auditLogs,
    addToast,
  } = useDms();

  const [activeTab, setActiveTab] = useState<'preview' | 'versions' | 'approval' | 'audit' | 'ai' | 'access'>('preview');
  
  // New version state
  const [newVersionFile, setNewVersionFile] = useState<{ name: string; size: number; content: string } | null>(null);
  const [newVersionSummary, setNewVersionSummary] = useState('');
  
  // Rejection reason state
  const [rejectReason, setRejectReason] = useState('');
  const [approvalComment, setApprovalComment] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Access policy edit state
  const [policyRoles, setPolicyRoles] = useState<'admin' | 'teacher' | 'student'[]>(doc?.accessPolicy.allowedRoles || ['admin', 'teacher', 'student']);
  const [policyGrades, setPolicyGrades] = useState<string[]>(doc?.accessPolicy.allowedGrades || ['Всички класове']);

  // Sync access policy state when doc changes
  useEffect(() => {
    if (doc) {
      setPolicyRoles(doc.accessPolicy.allowedRoles);
      setPolicyGrades(doc.accessPolicy.allowedGrades);
    }
  }, [doc?.id, doc?.accessPolicy]);

  // Prevent non-admin being stuck on access tab
  useEffect(() => {
    if (currentUser.role !== 'admin' && activeTab === 'access') {
      setActiveTab('preview');
    }
  }, [currentUser.role, activeTab]);

  if (!doc) return null;

  const lastVersion = doc.versions[doc.versions.length - 1];
  const categoryObj = CATEGORIES.find((c) => c.id === doc.category);
  const canEdit = canUserEditDocument(currentUser, doc);
  const canApprove = canUserApproveDocument(currentUser, doc);
  const canDelete = canUserDeleteDocument(currentUser, doc);

  const docLogs = auditLogs.filter((l) => l.documentId === doc.id);

  // Handle uploading new version
  const handleUploadNewVersionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionFile) {
      addToast('warning', 'Липсва файл', 'Моля изберете или въведете файл за новата версия.');
      return;
    }
    addNewVersion(doc.id, newVersionFile, newVersionSummary);
    setNewVersionFile(null);
    setNewVersionSummary('');
    setActiveTab('versions');
  };

  // Handle file select for new version
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        addToast('error', 'Превишен размер', 'Максималният размер на файла е 25 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewVersionFile({
          name: file.name,
          size: file.size,
          content: (event.target?.result as string) || `# ${doc.title}\nФайл: ${file.name}\nАктуализирано съдържание.`,
        });
      };
      reader.readAsText(file);
    }
  };

  // Handle AI analysis trigger
  const handleRunAi = async () => {
    setIsAiLoading(true);
    await runAiDocumentAnalysis(doc.id);
    setIsAiLoading(false);
  };

  // Handle save access policy
  const handleSavePolicy = () => {
    updateDocumentAccessPolicy(doc.id, {
      ...doc.accessPolicy,
      allowedRoles: policyRoles,
      allowedGrades: policyGrades,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150 transition-colors">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-5 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {categoryObj?.label || doc.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {doc.subject}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <GitBranch className="w-3 h-3" /> {doc.currentVersion}
              </span>
              {doc.status === 'approved' && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Одобрен
                </span>
              )}
              {doc.status === 'pending' && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Чака одобрение
                </span>
              )}
              {doc.status === 'draft' && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600">
                  Чернова
                </span>
              )}
              {doc.status === 'rejected' && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> За корекция
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white leading-tight break-words">
              {doc.title}
            </h2>
            <p className="text-xs text-slate-400">
              Автор: <strong className="text-slate-200">{doc.author.name}</strong> ({doc.author.positionTitle}) • Последна промяна: {formatDate(doc.updatedAt)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            title="Затвори (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 px-5 flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-medium transition-colors">
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Преглед на съдържанието</span>
          </button>

          <button
            onClick={() => setActiveTab('versions')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'versions'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Версиониране ({doc.versions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('approval')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'approval'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Одобрителен процес</span>
            {doc.status === 'pending' && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Одит лог ({docLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ai'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>AI Анализ & Резюме</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('access')}
              className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'access'
                  ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Контрол на достъпа</span>
            </button>
          )}
        </div>

        {/* Modal Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50 dark:bg-slate-900/60 transition-colors">
          
          {/* TAB 1: PREVIEW & IN-APP READER */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              
              {/* Document Overview Strip */}
              <div className="bg-white dark:bg-slate-850 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{lastVersion.fileName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Размер: {formatFileSize(lastVersion.fileSize)} • Тип: {lastVersion.fileType.toUpperCase()} • Хеш: {lastVersion.checksum.slice(0, 16)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadDocument(doc)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Свали файла</span>
                  </button>

                  {canEdit && (
                    <button
                      onClick={() => setActiveTab('versions')}
                      className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium px-3 py-2 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Качи нова версия</span>
                    </button>
                  )}
                </div>
              </div>

              {/* In-App Reader Document Canvas */}
              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Интегриран преглед на учебния документ</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    Версия {doc.currentVersion} • Сваляния: {doc.downloadCount} • Прегледи: {doc.viewCount}
                  </span>
                </div>

                <div className="p-6 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans min-h-[280px] bg-slate-50/30 dark:bg-slate-900/40 whitespace-pre-wrap font-mono text-xs border-b border-slate-100 dark:border-slate-800">
                  {lastVersion.contentSnippet || doc.description}
                </div>

                <div className="p-4 bg-white dark:bg-slate-850 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Тагове:</span>
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-slate-400 dark:text-slate-500">
                    Контролна сума: <code className="text-slate-600 dark:text-slate-400 font-mono">{lastVersion.checksum}</code>
                  </span>
                </div>
              </div>

              {/* Status Note if Rejected */}
              {doc.status === 'rejected' && doc.rejectionReason && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 text-xs text-rose-800 dark:text-rose-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-900 dark:text-rose-200">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    Забележка за коригиране от проверяващия:
                  </div>
                  <p className="pl-5 text-rose-700 dark:text-rose-300">{doc.rejectionReason}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VERSIONING & HISTORY & ROLLBACK */}
          {activeTab === 'versions' && (
            <div className="space-y-6">
              
              {/* Upload New Version Accordion / Box */}
              {canEdit && (
                <div className="bg-white dark:bg-slate-850 rounded-xl p-5 border border-indigo-200 dark:border-indigo-900/50 shadow-xs space-y-4 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                      <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Качване на нова версия на документа (v{doc.versions.length + 1}.0)
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Автоматично версиониране без загуба на данни</span>
                  </div>

                  <form onSubmit={handleUploadNewVersionSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Изберете файл за новата версия (.pdf, .docx, .xlsx, .pptx, .txt)
                      </label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-950 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Обяснение на промените (Changelog summary) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newVersionSummary}
                        onChange={(e) => setNewVersionSummary(e.target.value)}
                        placeholder="Напр. Добавени са задачи за подготовка за олимпиада..."
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Запази и регистрирай новата версия</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Version History List */}
              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
                <div className="px-5 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Хронологично дърво на версиите
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{doc.versions.length} общо версии</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {doc.versions.slice().reverse().map((ver, idx) => {
                    const isLatest = ver.versionNumber === doc.currentVersion;

                    return (
                      <div key={ver.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono flex items-center gap-1">
                              <GitBranch className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              {ver.versionNumber}
                            </span>
                            {isLatest && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                ТЕКУЩА ВЕРСИЯ
                              </span>
                            )}
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                              ({formatFileSize(ver.fileSize)})
                            </span>
                          </div>

                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {ver.changeSummary || 'Без описание на промените'}
                          </p>

                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3 flex-wrap pt-0.5">
                            <span>Файл: <strong className="font-mono text-slate-700 dark:text-slate-300">{ver.fileName}</strong></span>
                            <span>•</span>
                            <span>Качен от: <strong className="text-slate-700 dark:text-slate-300">{ver.uploadedBy.name}</strong></span>
                            <span>•</span>
                            <span>Дата: {formatDate(ver.uploadedAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => downloadDocument(doc, ver)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                            title="Свали файл от тази конкретна версия"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                            <span>Свали ({ver.versionNumber})</span>
                          </button>

                          {!isLatest && canEdit && (
                            <button
                              onClick={() => rollbackVersion(doc.id, ver.versionNumber)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors"
                              title="Възстанови документа към тази версия без загуба на данни"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                              <span>Възстанови (Rollback)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APPROVAL WORKFLOW */}
          {activeTab === 'approval' && (
            <div className="space-y-6">
              
              {/* Approval Actions Box for Admin/Lead Teacher */}
              {canApprove && doc.status === 'pending' && (
                <div className="bg-amber-50/80 dark:bg-amber-950/30 rounded-xl p-5 border border-amber-200 dark:border-amber-900/50 shadow-xs space-y-4 transition-colors">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span>Изисква се Вашето институционално одобрение</span>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    Документът е внесен за проверка. Можете да го одобрите за публикация или да го върнете на автора със задължителни насоки за корекция.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Официален коментар или забележка:
                      </label>
                      <textarea
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        placeholder="Въведете мотиви, съгласуване или препоръки..."
                        rows={2}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          approveDocument(doc.id, approvalComment || 'Документът е проверен и одобрен.');
                          setApprovalComment('');
                        }}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Одобри за цялото училище</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!approvalComment.trim()) {
                            addToast('warning', 'Въведете забележка', 'Моля посочете причина за връщането на документа.');
                            return;
                          }
                          rejectDocument(doc.id, approvalComment);
                          setApprovalComment('');
                        }}
                        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Върни за корекция (Reject)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit for approval if in Draft or Rejected */}
              {(doc.status === 'draft' || doc.status === 'rejected') && canEdit && (
                <div className="bg-indigo-50/80 dark:bg-indigo-950/30 rounded-xl p-5 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between gap-4 transition-colors">
                  <div>
                    <h4 className="font-bold text-indigo-950 dark:text-indigo-200 text-sm">Изпращане за одобрение</h4>
                    <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-0.5">
                      След изпращане документът ще влезе в списъка за преглед от ръководството.
                    </p>
                  </div>
                  <button
                    onClick={() => submitForApproval(doc.id)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Изпрати за одобрение</span>
                  </button>
                </div>
              )}

              {/* Approval History Timeline */}
              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
                  Хронология на одобренията и рецензиите
                </h4>

                {doc.approvalHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">Все още няма регистрирани стъпки по одобрение.</p>
                ) : (
                  <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                    {doc.approvalHistory.map((item, idx) => (
                      <div key={item.id || idx} className="relative flex items-start gap-4 pl-8">
                        <div className={`absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-850 shadow-xs ${
                          item.action === 'approved'
                            ? 'bg-emerald-500'
                            : item.action === 'rejected'
                            ? 'bg-rose-500'
                            : 'bg-indigo-500'
                        }`} />

                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200/80 dark:border-slate-700 flex-1 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {item.reviewedBy.name} ({item.reviewedBy.positionTitle})
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                              {formatDate(item.reviewedAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.action === 'approved'
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                : item.action === 'rejected'
                                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                                : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300'
                            }`}>
                              {item.action === 'approved' ? 'Одобрен' : item.action === 'rejected' ? 'Върнат за корекция' : 'Изпратен за одобрение'}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Версия: {item.versionReviewed}</span>
                          </div>

                          {item.comment && (
                            <p className="text-slate-700 dark:text-slate-300 pt-1 text-xs italic bg-white dark:bg-slate-750 p-2 rounded border border-slate-100 dark:border-slate-700">
                              „{item.comment}“
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LOGS FOR THIS DOCUMENT */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Пълен одит дневник за „{doc.title}“
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{docLogs.length} събития</span>
              </div>

              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Времеви отпечатък</th>
                      <th className="px-4 py-2.5">Потребител & Роля</th>
                      <th className="px-4 py-2.5">Действие</th>
                      <th className="px-4 py-2.5">Детайли</th>
                      <th className="px-4 py-2.5">IP Адрес</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {docLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{log.user.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase">{log.user.role}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{log.details}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-400 dark:text-slate-500 text-[11px]">
                          {log.ipAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: GEMINI AI ASSISTANT */}
          {activeTab === 'ai' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 dark:from-indigo-950 dark:to-slate-950 text-white rounded-xl p-5 flex items-start justify-between gap-4 border border-indigo-950/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-bold text-sm">Интелигентен образователен асистент (Gemini AI)</h4>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Автоматичен синтез на учебното съдържание, извличане на ключови понятия за ученици и верификация на съответствието с държавните образователни стандарти (ДОС) на МОН.
                  </p>
                </div>

                <button
                  onClick={handleRunAi}
                  disabled={isAiLoading}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0 disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAiLoading ? 'Генериране...' : doc.aiAnalysis ? 'Прегенерирай анализ' : 'Стартирай AI Анализ'}</span>
                </button>
              </div>

              {doc.aiAnalysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Summary Card */}
                  <div className="bg-white dark:bg-slate-850 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs transition-colors">
                    <h5 className="font-bold text-xs text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                      Синтезирано резюме на документа
                    </h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {doc.aiAnalysis.summary}
                    </p>
                  </div>

                  {/* Standards Compliance Card */}
                  <div className="bg-white dark:bg-slate-850 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs transition-colors">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        Съответствие с образователните стандарти
                      </h5>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full font-mono border border-emerald-200 dark:border-emerald-800">
                        {doc.aiAnalysis.complianceScore}% съвпадение
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {doc.aiAnalysis.complianceFeedback}
                    </p>
                  </div>

                  {/* Key Concepts */}
                  <div className="bg-white dark:bg-slate-850 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs md:col-span-2 transition-colors">
                    <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Ключови учебни концепции и акценти
                    </h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {doc.aiAnalysis.keyConcepts.map((c, i) => (
                        <li key={i} className="text-xs bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium">
                          • {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-850 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  Кликнете бутона по-горе, за да генерирате AI резюме и оценка на съответствието за този документ.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: ACCESS POLICY MATRIX (Admin only) */}
          {activeTab === 'access' && currentUser.role === 'admin' && (
            <div className="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Контрол на правата за достъп (RBAC)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Определете кои роли и учебни класове имат разрешение да четат и свалят този документ.
                </p>
              </div>

              {/* Roles Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Разрешени системни роли:
                </label>
                <div className="flex items-center gap-4 text-xs">
                  {(['admin', 'teacher', 'student'] as const).map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={policyRoles.includes(r)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPolicyRoles([...policyRoles, r]);
                          } else {
                            setPolicyRoles(policyRoles.filter((item) => item !== r));
                          }
                        }}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="capitalize font-medium text-slate-800 dark:text-slate-200">
                        {r === 'admin' ? 'Администратор' : r === 'teacher' ? 'Учители' : 'Ученици'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Grade Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Целеви класове / аудитория:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {TARGET_GRADES.map((g) => (
                    <label key={g} className="flex items-center gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={policyGrades.includes(g)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPolicyGrades([...policyGrades, g]);
                          } else {
                            setPolicyGrades(policyGrades.filter((item) => item !== g));
                          }
                        }}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleSavePolicy}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Запази промените по правата за достъп
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-100 dark:bg-slate-850 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <div className="flex items-center gap-3">
            {canDelete && (
              <>
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 px-3 py-1.5 rounded-lg">
                    <span className="font-semibold">Потвърждавате ли изтриването?</span>
                    <button
                      onClick={() => {
                        deleteDocument(doc.id);
                        onClose();
                      }}
                      className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold transition-colors"
                    >
                      Да, изтрий
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded font-semibold transition-colors"
                    >
                      Отказ
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Изтрий документа</span>
                  </button>
                )}
              </>
            )}
            {currentUser.role === 'admin' && doc.status !== 'archived' && !showDeleteConfirm && (
              <button
                onClick={() => archiveDocument(doc.id)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-medium"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Архивирай</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-semibold transition-colors shadow-2xs self-end sm:self-auto"
          >
            Затвори
          </button>
        </div>

      </div>
    </div>
  );
};
