import React, { useState } from 'react';
import { useDms } from '../context/DmsContext';
import { DocumentCategoryId, Subject, TargetGrade } from '../types';
import { CATEGORIES, SUBJECTS, TARGET_GRADES } from '../data/categories';
import { formatFileSize, getFileExtension } from '../utils/fileHelpers';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Tag,
  Shield,
  Send,
  Save,
  Plus,
} from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ isOpen, onClose }) => {
  const { createDocument, currentUser, addToast } = useDms();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategoryId>('curriculum');
  const [subject, setSubject] = useState<Subject>(
    (currentUser.subjectSpecialty as Subject) || 'Математика'
  );
  const [targetGrade, setTargetGrade] = useState<TargetGrade>(
    (currentUser.grade as TargetGrade) || '11 клас'
  );
  const [tags, setTags] = useState<string[]>(['2025-2026', 'учебен-материал']);
  const [tagInput, setTagInput] = useState('');
  
  const [fileData, setFileData] = useState<{
    name: string;
    size: number;
    content: string;
    fileType: string;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const allowedExtensions = ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'txt', 'png', 'jpg'];

  const handleProcessFile = (file: File) => {
    const ext = getFileExtension(file.name);
    if (!allowedExtensions.includes(ext)) {
      addToast(
        'error',
        'Невалиден формат',
        `Разрешени са само файлове: ${allowedExtensions.map((e) => `.${e}`).join(', ')}`
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      addToast('error', 'Превишен размер', 'Максималният разрешен размер на файл е 25 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileData({
        name: file.name,
        size: file.size,
        fileType: ext === 'doc' ? 'docx' : ext === 'xls' ? 'xlsx' : ext,
        content:
          (e.target?.result as string) ||
          `# ${title || file.name}\nАвтор: ${currentUser.name}\nДата: ${new Date().toLocaleDateString('bg-BG')}\nСъдържание на файла...`,
      });

      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().replace(/^#/, '').toLowerCase().replace(/\s+/g, '-');
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (submitImmediately: boolean) => {
    if (!title.trim()) {
      addToast('warning', 'Въведете заглавие', 'Заглавието на документа е задължително.');
      return;
    }

    // Default mock file if none dropped
    const finalFile = fileData || {
      name: `${title.replace(/\s+/g, '_')}.pdf`,
      size: 420000,
      content: `# ${title}
Категория: ${category}
Предмет: ${subject}
Целеви клас: ${targetGrade}
Автор: ${currentUser.name} (${currentUser.positionTitle})
Учебно съдържание и методически указания за учебната 2025/2026 г.`,
      fileType: 'pdf',
    };

    setIsSubmitting(true);
    try {
      await createDocument({
        title,
        description: description || `Учебен документ за ${targetGrade} по ${subject}.`,
        category,
        subject,
        targetGrade,
        tags,
        file: finalFile,
        submitImmediately,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150 transition-colors">
        
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Качване на нов документ</h2>
              <p className="text-xs text-slate-400">
                Добавяне на учебен материал или административен акт в системата
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-900 dark:text-slate-100">
          
          {/* Drag and Drop Zone */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Файл на документа (.pdf, .docx, .xlsx, .pptx, .txt — до 25 MB) *
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                  : fileData
                  ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              {fileData ? (
                <div className="flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{fileData.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {formatFileSize(fileData.size)} • {fileData.fileType.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFileData(null)}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium px-2 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
                  >
                    Смени файла
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
                  <div>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 cursor-pointer">
                      Изберете файл от компютъра
                    </span>{' '}
                    или го пуснете тук (Drag & Drop)
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    Поддържани: PDF, DOCX, XLSX, PPTX, TXT (макс. 25 MB)
                  </p>
                  <input
                    type="file"
                    onChange={(e) => e.target.files?.[0] && handleProcessFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label
                    htmlFor="file-upload-input"
                    className="inline-block mt-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                  >
                    Преглед на файлове
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Заглавие на документа *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Напр. Тематичен план по Математика за 11 клас (ПП)..."
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
            />
          </div>

          {/* Category & Subject Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Категория на документа *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategoryId)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Учебен предмет *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Grade */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Целева аудитория / Клас *
            </label>
            <select
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value as TargetGrade)}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
            >
              {TARGET_GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Кратко описание и методически указания
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишете целите на материала, хорариума и препоръките към учениците..."
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Тагове за лесно търсене
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Въведете таг и натиснете Enter (напр. матура, ДЗИ)..."
                className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Добави
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono flex items-center gap-1"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-850 p-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 transition-colors">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            Отказ
          </button>

          <div className="flex items-center gap-2">
            {currentUser.role !== 'admin' && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Запази като чернова</span>
              </button>
            )}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              {currentUser.role === 'admin' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Публикувай (Одобрен)</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Качи и изпрати за одобрение</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
