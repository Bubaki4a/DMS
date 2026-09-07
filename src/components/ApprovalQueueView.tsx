import React, { useState } from 'react';
import { useDms } from '../context/DmsContext';
import { EducationalDocument } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatDate, formatFileSize } from '../utils/fileHelpers';
import { canUserApproveDocument } from '../utils/permissions';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  MessageSquare,
  Check,
  X,
  Filter,
  Send,
  UserCheck,
} from 'lucide-react';

interface ApprovalQueueViewProps {
  onOpenDoc: (doc: EducationalDocument) => void;
}

export const ApprovalQueueView: React.FC<ApprovalQueueViewProps> = ({ onOpenDoc }) => {
  const { documents, currentUser, approveDocument, rejectDocument, addToast } = useDms();

  const [activeFilter, setActiveFilter] = useState<'pending' | 'all' | 'rejected' | 'approved'>('pending');
  const [selectedDocToReject, setSelectedDocToReject] = useState<EducationalDocument | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Filter documents based on queue status
  const queueDocs = documents.filter((d) => {
    if (activeFilter === 'pending') return d.status === 'pending';
    if (activeFilter === 'approved') return d.status === 'approved';
    if (activeFilter === 'rejected') return d.status === 'rejected';
    return true;
  });

  const pendingCount = documents.filter((d) => d.status === 'pending').length;
  const approvedCount = documents.filter((d) => d.status === 'approved').length;
  const rejectedCount = documents.filter((d) => d.status === 'rejected').length;

  const handleConfirmReject = () => {
    if (!selectedDocToReject) return;
    if (!rejectReason.trim()) {
      addToast('warning', 'Посочете причина', 'Моля въведете конкретни забележки и указания за корекция.');
      return;
    }
    rejectDocument(selectedDocToReject.id, rejectReason);
    setSelectedDocToReject(null);
    setRejectReason('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Metrics Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Център за одобрения и контрол на документооборота
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Преглед, съгласуване и утвърждаване на учебни планове, конспекти, изпитни тестове и ученически проекти.
          </p>
        </div>

        {/* Quick Role Notice */}
        <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-2 px-3 text-xs text-slate-700 dark:text-slate-300">
          Текуща роля: <strong className="text-indigo-700 dark:text-indigo-400">{currentUser.name} ({currentUser.positionTitle})</strong>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveFilter('pending')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeFilter === 'pending'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-2 ring-amber-400/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Чакащи одобрение</span>
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono">{pendingCount}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Изискват административен или експертен преглед</p>
        </div>

        <div
          onClick={() => setActiveFilter('approved')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeFilter === 'approved'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-400/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Одобрени документи</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono">{approvedCount}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Въведени в официална употреба в училището</p>
        </div>

        <div
          onClick={() => setActiveFilter('rejected')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeFilter === 'rejected'
              ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 ring-2 ring-rose-400/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">Върнати за корекция</span>
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono">{rejectedCount}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Очакват редакция и повторно подаване от автора</p>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Списък със заявки ({queueDocs.length})
          </h2>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Филтрирай по статус:</span>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as any)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="pending">⏳ Чакащи за преглед</option>
              <option value="approved">✅ Одобрени</option>
              <option value="rejected">⚠️ Върнати за корекция</option>
              <option value="all">Всички статуси</option>
            </select>
          </div>
        </div>

        {queueDocs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
            Няма намерени документи в тази опашка.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {queueDocs.map((doc) => {
              const lastVersion = doc.versions[doc.versions.length - 1];
              const categoryObj = CATEGORIES.find((c) => c.id === doc.category);
              const canReview = canUserApproveDocument(currentUser, doc);

              return (
                <div
                  key={doc.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {doc.subject}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {categoryObj?.label || doc.category}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        {doc.targetGrade}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200">
                        {doc.currentVersion}
                      </span>
                    </div>

                    <h3
                      onClick={() => onOpenDoc(doc)}
                      className="font-bold text-slate-900 dark:text-slate-100 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-1"
                    >
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {doc.description}
                    </p>

                    <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-2 pt-0.5">
                      <img
                        src={doc.author.avatar}
                        alt={doc.author.name}
                        className="w-4 h-4 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                      />
                      <span>
                        Подател: <strong className="text-slate-700 dark:text-slate-300">{doc.author.name}</strong> ({doc.author.positionTitle})
                      </span>
                      <span>•</span>
                      <span>Входиран на: {formatDate(doc.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => onOpenDoc(doc)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      <span>Преглед</span>
                    </button>

                    {canReview && doc.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveDocument(doc.id, 'Утвърден след проверка на учебното съдържание.')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Одобри</span>
                        </button>

                        <button
                          onClick={() => setSelectedDocToReject(doc)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Върни за корекция</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Modal with Feedback */}
      {selectedDocToReject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Връщане на документ за корекция
              </h3>
              <button
                onClick={() => setSelectedDocToReject(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Посочете задължителни насоки и препоръки към автора{' '}
              <strong className="text-slate-900 dark:text-slate-100">{selectedDocToReject.author.name}</strong> за документа „{selectedDocToReject.title}“.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Мотиви и забележки за коригиране *
              </label>
              <textarea
                rows={4}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Напр. Моля коригирайте хорариума за раздел 2 и добавете часове за лабораторни упражнения..."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDocToReject(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg transition-colors"
              >
                Отказ
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
              >
                Потвърди и изпрати забележката
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
