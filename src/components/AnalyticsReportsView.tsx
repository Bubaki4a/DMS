import React from 'react';
import { useDms } from '../context/DmsContext';
import { CATEGORIES, SUBJECTS } from '../data/categories';
import { formatFileSize } from '../utils/fileHelpers';
import {
  BarChart3,
  Download,
  TrendingUp,
  Files,
  Users,
  Eye,
  CheckCircle2,
  HardDrive,
  Award,
  BookOpen,
} from 'lucide-react';

export const AnalyticsReportsView: React.FC = () => {
  const { documents, auditLogs, users } = useDms();

  // Metrics
  const totalDocs = documents.length;
  const totalVersions = documents.reduce((acc, d) => acc + d.versions.length, 0);
  const totalDownloads = documents.reduce((acc, d) => acc + d.downloadCount, 0);
  const totalViews = documents.reduce((acc, d) => acc + d.viewCount, 0);
  const totalBytes = documents.reduce((acc, d) => acc + d.versions.reduce((sum, v) => sum + v.fileSize, 0), 0);

  // Top downloaded documents
  const topDocs = [...documents].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 5);

  // Subject distribution
  const subjectCounts: Record<string, number> = {};
  SUBJECTS.forEach((s) => (subjectCounts[s] = 0));
  documents.forEach((d) => {
    if (subjectCounts[d.subject] !== undefined) {
      subjectCounts[d.subject]++;
    }
  });

  // Top active users from audit logs
  const userActivity: Record<string, { name: string; avatar: string; role: string; count: number }> = {};
  auditLogs.forEach((l) => {
    if (!userActivity[l.user.id]) {
      userActivity[l.user.id] = {
        name: l.user.name,
        avatar: l.user.avatar,
        role: l.user.role,
        count: 0,
      };
    }
    userActivity[l.user.id].count++;
  });

  const topUsers = Object.values(userActivity).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          Институционални отчети и анализи на документооборота
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Статистика за ползваемостта на учебните материали, активността на преподавателите и съхранението на данни.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Всички документи</span>
            <Files className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono">{totalDocs}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{totalVersions} регистрирани версии</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Общо сваляния</span>
            <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono">{totalDownloads}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{totalViews} прегледа в реално време</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Одит събития</span>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono">{auditLogs.length}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">100% проследимост без загуба</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Дисково хранилище</span>
            <HardDrive className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono">{formatFileSize(totalBytes)}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">PostgreSQL + Django Storages</p>
        </div>
      </div>

      {/* Main Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Downloaded Documents */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              Най-популярни и сваляни учебни материали
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">Топ 5</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topDocs.map((doc, idx) => (
              <div key={doc.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                    idx === 0 ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : idx === 1 ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate" title={doc.title}>{doc.title}</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{doc.subject} • {doc.targetGrade}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-xs">{doc.downloadCount} сваляния</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">{doc.viewCount} прегледа</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Разпределение по учебни предмети
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">{totalDocs} документа</span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(subjectCounts)
              .filter(([_, count]) => count > 0)
              .sort(([_, a], [__, b]) => b - a)
              .map(([subjectName, count]) => {
                const pct = totalDocs > 0 ? Math.round((count / totalDocs) * 100) : 0;
                return (
                  <div key={subjectName} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>{subjectName}</span>
                      <span className="font-mono text-slate-900 dark:text-slate-100">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Top Active Users Leaderboard */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 lg:col-span-2 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Най-активни потребители в документооборота
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">Според регистрирани одит събития</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {topUsers.map((u, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-600" />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{u.name}</h4>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{u.role}</div>
                  <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">{u.count} действия</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
