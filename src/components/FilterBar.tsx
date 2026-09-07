import React from 'react';
import { useDms } from '../context/DmsContext';
import { SUBJECTS, TARGET_GRADES, CATEGORIES } from '../data/categories';
import {
  Filter,
  Grid,
  List,
  X,
  Tag,
  GraduationCap,
  BookMarked,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Subject, TargetGrade, ApprovalStatus } from '../types';

interface FilterBarProps {
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ viewMode, setViewMode }) => {
  const {
    activeCategory,
    setActiveCategory,
    selectedSubject,
    setSelectedSubject,
    selectedGrade,
    setSelectedGrade,
    selectedStatus,
    setSelectedStatus,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    visibleDocuments,
    currentUser,
  } = useDms();

  const currentCategoryObj = CATEGORIES.find((c) => c.id === activeCategory);

  // Extract top tags from visible documents
  const allTags = Array.from(
    new Set(visibleDocuments.flatMap((d) => d.tags))
  ).slice(0, 8);

  const hasActiveFilters =
    activeCategory !== 'all' ||
    selectedSubject !== 'all' ||
    selectedGrade !== 'all' ||
    selectedStatus !== 'all' ||
    selectedTag !== null ||
    searchQuery !== '';

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSelectedSubject('all');
    setSelectedGrade('all');
    setSelectedStatus('all');
    setSelectedTag(null);
    setSearchQuery('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-3 transition-colors">
      {/* Top row: Category Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {currentCategoryObj ? currentCategoryObj.label : 'Всички учебни документи'}
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {visibleDocuments.length} намерени
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentCategoryObj
              ? currentCategoryObj.description
              : 'Преглед, търсене, версиониране и сваляне на документи с ролеви права за достъп.'}
          </p>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Мрежов изглед (Карти)"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Карти</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Табличен изглед (Детайли)"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Таблица</span>
          </button>
        </div>
      </div>

      {/* Filter Selectors Bar */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        
        {/* Subject Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1">
          <BookMarked className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as Subject | 'all')}
            className="bg-transparent text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all" className="dark:bg-slate-800 dark:text-slate-200">Всички учебни предмети</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s} className="dark:bg-slate-800 dark:text-slate-200">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1">
          <GraduationCap className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as TargetGrade | 'all')}
            className="bg-transparent text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all" className="dark:bg-slate-800 dark:text-slate-200">Всички класове</option>
            {TARGET_GRADES.map((g) => (
              <option key={g} value={g} className="dark:bg-slate-800 dark:text-slate-200">
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ApprovalStatus | 'all')}
            className="bg-transparent text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all" className="dark:bg-slate-800 dark:text-slate-200">Всички статуси</option>
            <option value="approved" className="dark:bg-slate-800 dark:text-slate-200">✅ Одобрени (Approved)</option>
            <option value="pending" className="dark:bg-slate-800 dark:text-slate-200">⏳ Чакащи одобрение (Pending)</option>
            <option value="draft" className="dark:bg-slate-800 dark:text-slate-200">📝 Чернови (Draft)</option>
            <option value="rejected" className="dark:bg-slate-800 dark:text-slate-200">⚠️ Върнати за корекция (Rejected)</option>
            <option value="archived" className="dark:bg-slate-800 dark:text-slate-200">📦 Архивирани (Archived)</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 px-2.5 py-1 rounded-lg font-medium transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Изчисти филтри
          </button>
        )}
      </div>

      {/* Quick Tag Filter Chips */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 shrink-0">
            <Tag className="w-3 h-3" />
            Тагове:
          </span>
          {allTags.map((tag) => {
            const isTagActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isTagActive ? null : tag)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
                  isTagActive
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
