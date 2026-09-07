import React from 'react';
import { useDms } from '../context/DmsContext';
import {
  FileText,
  Clock,
  Shield,
  Activity,
  BarChart3,
  Upload,
  Search,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    users,
    switchUserById,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setIsUploadModalOpen,
    pendingApprovalsCount,
    resetToDefaultData,
    theme,
    toggleTheme,
  } = useDms();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">Администратор</span>;
      case 'teacher':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Учител</span>;
      case 'student':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Ученик</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner with Institution Branding & User Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-inner text-white font-bold text-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">EduDoc DMS</span>
                <span className="text-[11px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">v2.5 Django</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                СПГ „Електроника и Информатика“ — Документооборот
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Търсене по заглавие, автор, предмет, таг..."
                className="w-full bg-slate-800/90 text-slate-100 text-sm pl-9 pr-4 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* User Role Switcher & Upload Action */}
          <div className="flex items-center gap-3">
            
            {/* Upload Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors shadow-sm"
              title="Качване на нов документ"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Качи документ</span>
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg p-1.5 pl-2.5">
              <div className="flex items-center gap-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-600"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[140px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    {currentUser.positionTitle}
                  </div>
                </div>
              </div>

              {/* Native Select for fast test switching */}
              <div className="border-l border-slate-700 pl-2">
                <select
                  value={currentUser.id}
                  onChange={(e) => switchUserById(e.target.value)}
                  className="bg-slate-900 text-slate-200 text-xs rounded border border-slate-700 py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
                  title="Смени роля / профил за тестване"
                >
                  <optgroup label="Администрация">
                    <option value="user_admin_1">👑 Директор: Иван Петров (Admin)</option>
                  </optgroup>
                  <optgroup label="Педагогически състав">
                    <option value="user_teacher_1">👩‍🏫 Учител: Мария Георгиева (Математика)</option>
                    <option value="user_teacher_2">👨‍🏫 Учител: Пламен Димитров (БЕЛ)</option>
                  </optgroup>
                  <optgroup label="Ученици">
                    <option value="user_student_1">🎓 Ученик: Александър Димитров (11А клас)</option>
                    <option value="user_student_2">🎓 Ученичка: Елена Стоянова (12Б клас)</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 text-slate-300 hover:text-amber-400 dark:hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700 bg-slate-800/60"
              title={theme === 'dark' ? 'Превключи на светла тема (Light Mode)' : 'Превключи на тъмна тема (Dark Mode)'}
              aria-label="Превключване на тема"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-300 hidden xl:inline font-medium">Светла</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-300" />
                  <span className="text-xs text-slate-300 hidden xl:inline font-medium">Тъмна</span>
                </>
              )}
            </button>

            {/* Reset data helper */}
            <button
              onClick={resetToDefaultData}
              title="Възстанови първоначалните примерни данни"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-800 pt-1 pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'documents'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Регистър на документите</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'approvals'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Център за одобрения</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Одит и логове</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Отчети и анализи</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'permissions'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Права и сигурност</span>
          </button>
        </div>
      </div>
    </header>
  );
};
