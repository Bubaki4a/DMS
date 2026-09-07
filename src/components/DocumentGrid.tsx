import React from 'react';
import { useDms } from '../context/DmsContext';
import { EducationalDocument } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatFileSize, formatShortDate } from '../utils/fileHelpers';
import { canUserEditDocument, canUserApproveDocument } from '../utils/permissions';
import {
  FileText,
  Download,
  Eye,
  GitBranch,
  CheckCircle2,
  Clock,
  AlertCircle,
  Archive,
  Layers,
  Sparkles,
  FileCode,
  FileSpreadsheet,
  FileBox,
  CornerUpLeft,
} from 'lucide-react';

interface DocumentGridProps {
  onOpenDoc: (doc: EducationalDocument) => void;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({ onOpenDoc }) => {
  const { visibleDocuments, currentUser, downloadDocument, recordDocumentView, approveDocument } = useDms();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Одобрен
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Чака одобрение
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Чернова
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            За корекция
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            <Archive className="w-3 h-3" />
            Архивиран
          </span>
        );
      default:
        return null;
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"><FileText className="w-5 h-5" /></div>;
      case 'docx':
        return <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"><FileCode className="w-5 h-5" /></div>;
      case 'xlsx':
        return <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"><FileSpreadsheet className="w-5 h-5" /></div>;
      default:
        return <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"><FileBox className="w-5 h-5" /></div>;
    }
  };

  if (visibleDocuments.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 m-6">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Няма намерени документи</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
          Няма документи, които да отговарят на избраните филтри или на правата за достъп на текущия потребител ({currentUser.role}).
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {visibleDocuments.map((doc) => {
        const lastVersion = doc.versions[doc.versions.length - 1];
        const categoryObj = CATEGORIES.find((c) => c.id === doc.category);
        const canApprove = canUserApproveDocument(currentUser, doc) && doc.status === 'pending';

        return (
          <div
            key={doc.id}
            id={`doc-card-${doc.id}`}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Card Header & Badges */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {doc.subject}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                    {doc.targetGrade}
                  </span>
                </div>
                <div>{getStatusBadge(doc.status)}</div>
              </div>

              {/* Title & Excerpt */}
              <div className="flex items-start gap-3 mb-3">
                {getFileIcon(lastVersion.fileType)}
                <div className="flex-1 min-w-0">
                  <h3
                    onClick={() => {
                      recordDocumentView(doc.id);
                      onOpenDoc(doc);
                    }}
                    className="font-bold text-slate-900 dark:text-slate-100 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
                    title={doc.title}
                  >
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {doc.tags && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {doc.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 self-center">
                      +{doc.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Version & File Metadata Info */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{doc.currentVersion}</span>
                  <span className="text-slate-400 dark:text-slate-500">({doc.versions.length} {doc.versions.length === 1 ? 'версия' : 'версии'})</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  {formatFileSize(lastVersion.fileSize)}
                </span>
              </div>
            </div>

            {/* Card Footer: Author & Action Buttons */}
            <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={doc.author.avatar}
                  alt={doc.author.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {doc.author.name}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    {formatShortDate(doc.updatedAt)}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {canApprove && (
                  <button
                    onClick={() => approveDocument(doc.id)}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
                    title="Бързо одобрение на документа"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    recordDocumentView(doc.id);
                    onOpenDoc(doc);
                  }}
                  className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  title="Преглед и детайли"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => downloadDocument(doc)}
                  className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                  title="Сваляне на файла"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
