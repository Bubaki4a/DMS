import React from 'react';
import { useDms } from '../context/DmsContext';
import { EducationalDocument } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatFileSize, formatShortDate } from '../utils/fileHelpers';
import { canUserApproveDocument } from '../utils/permissions';
import {
  FileText,
  Download,
  Eye,
  GitBranch,
  CheckCircle2,
  Clock,
  AlertCircle,
  Archive,
  ArrowUpDown,
} from 'lucide-react';

interface DocumentTableProps {
  onOpenDoc: (doc: EducationalDocument) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({ onOpenDoc }) => {
  const { visibleDocuments, currentUser, downloadDocument, recordDocumentView, approveDocument } = useDms();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Одобрен
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Чака одобрение
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Чернова
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            За корекция
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            Архивиран
          </span>
        );
      default:
        return null;
    }
  };

  if (visibleDocuments.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 m-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Няма намерени документи</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
          Няма документи, отговарящи на зададените критерии.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Документ & Предмет</th>
                <th className="px-4 py-3">Категория</th>
                <th className="px-4 py-3">Клас</th>
                <th className="px-4 py-3">Версия</th>
                <th className="px-4 py-3">Автор</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Размер</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {visibleDocuments.map((doc) => {
                const lastVersion = doc.versions[doc.versions.length - 1];
                const catObj = CATEGORIES.find((c) => c.id === doc.category);
                const canApprove = canUserApproveDocument(currentUser, doc) && doc.status === 'pending';

                return (
                  <tr
                    key={doc.id}
                    id={`doc-row-${doc.id}`}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    {/* Document Title & Subject */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <div
                        onClick={() => {
                          recordDocumentView(doc.id);
                          onOpenDoc(doc);
                        }}
                        className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-1 text-sm"
                        title={doc.title}
                      >
                        {doc.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold">{doc.subject}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{lastVersion.fileName}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {catObj?.label || doc.category}
                    </td>

                    {/* Grade */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                        {doc.targetGrade}
                      </span>
                    </td>

                    {/* Version */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-mono text-slate-900 dark:text-slate-100 font-bold">
                        <GitBranch className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                        {doc.currentVersion}
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={doc.author.avatar}
                          alt={doc.author.name}
                          className="w-5 h-5 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                        />
                        <span className="text-slate-800 dark:text-slate-200 text-[11px] font-semibold">
                          {doc.author.name}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>

                    {/* File Size */}
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-500 dark:text-slate-400">
                      {formatFileSize(lastVersion.fileSize)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canApprove && (
                          <button
                            onClick={() => approveDocument(doc.id)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium"
                            title="Одобри документа"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            recordDocumentView(doc.id);
                            onOpenDoc(doc);
                          }}
                          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          title="Преглед на детайли и версии"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadDocument(doc)}
                          className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-md transition-colors"
                          title="Свали файл"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
