import React from 'react';
import { useDms } from '../context/DmsContext';
import { CATEGORIES } from '../data/categories';
import {
  BookOpen,
  FileText,
  CheckSquare,
  FolderGit2,
  ShieldAlert,
  ClipboardList,
  FileCheck,
  Trophy,
  Files,
  HardDrive,
  Database,
  Layers,
  UserCheck,
} from 'lucide-react';
import { DocumentCategoryId } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  CheckSquare: <CheckSquare className="w-4 h-4" />,
  FolderGit2: <FolderGit2 className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  ClipboardList: <ClipboardList className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
  Trophy: <Trophy className="w-4 h-4" />,
};

export const CategorySidebar: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    documents,
    visibleDocuments,
    currentUser,
    setActiveTab,
  } = useDms();

  // Calculate total size of all documents
  const totalBytes = documents.reduce((acc, doc) => {
    const docSize = doc.versions.reduce((sum, v) => sum + v.fileSize, 0);
    return acc + docSize;
  }, 0);
  const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);

  // Counts by category for all accessible documents
  const getCategoryCount = (catId: DocumentCategoryId | 'all') => {
    if (catId === 'all') return visibleDocuments.length;
    return visibleDocuments.filter((d) => d.category === catId).length;
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-6 transition-colors">
      
      {/* Category List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Категории документи
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {visibleDocuments.length} достъпни
          </span>
        </div>

        <nav className="space-y-1">
          {/* All Documents option */}
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveTab('documents');
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <Files className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">Всички документи</span>
            </div>
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                activeCategory === 'all'
                  ? 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {getCategoryCount('all')}
            </span>
          </button>

          {/* Specific Categories */}
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveTab('documents');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={cat.description}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`shrink-0 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {iconMap[cat.iconName] || <FileText className="w-4 h-4" />}
                  </span>
                  <span className="truncate">{cat.label}</span>
                </div>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                    isSelected
                      ? 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Institutional Info & Django Storage Status */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        
        {/* User Context Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Активна роля</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 uppercase">
              {currentUser.role}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">{currentUser.name}</p>
          {currentUser.grade && (
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Класен профил: {currentUser.grade}</p>
          )}
          {currentUser.subjectSpecialty && (
            <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium truncate">Предмет: {currentUser.subjectSpecialty}</p>
          )}
        </div>

        {/* Django Storages & PostgreSQL Metrics */}
        <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 rounded-lg p-3 text-xs space-y-2 border border-slate-800 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              PostgreSQL + Storages
            </span>
            <span className="font-mono text-emerald-400">Свързан</span>
          </div>
          
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span>Заето дисково пространство:</span>
              <span className="font-mono text-white">{totalMb} MB / 500 MB</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, Math.max(5, (parseFloat(totalMb) / 500) * 100))}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span>Общо версии в базата:</span>
            <span className="font-mono text-slate-200 font-semibold">
              {documents.reduce((acc, d) => acc + d.versions.length, 0)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
