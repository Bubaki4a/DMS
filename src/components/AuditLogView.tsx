import React, { useState } from 'react';
import { useDms } from '../context/DmsContext';
import { AuditActionType } from '../types';
import { formatDate } from '../utils/fileHelpers';
import {
  Activity,
  Download,
  Search,
  Filter,
  ShieldCheck,
  Eye,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  UserCheck,
  FileSpreadsheet,
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs, addToast } = useDms();

  const [selectedAction, setSelectedAction] = useState<AuditActionType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'SUCCESS' | 'WARNING' | 'DENIED'>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedAction !== 'ALL' && log.action !== selectedAction) return false;
    if (selectedStatus !== 'ALL' && log.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inUser = log.user.name.toLowerCase().includes(q);
      const inDoc = (log.documentTitle || '').toLowerCase().includes(q);
      const inDetails = log.details.toLowerCase().includes(q);
      const inIp = log.ipAddress.toLowerCase().includes(q);
      if (!inUser && !inDoc && !inDetails && !inIp) return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Document Title', 'Details', 'IP Address', 'Status'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.user.name}"`,
      l.user.role,
      l.action,
      `"${l.documentTitle || ''}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.ipAddress,
      l.status,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EduDoc_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('success', 'Одит логът е експортиран', 'Файлът е генериран и свален в CSV формат.');
  };

  const getActionBadge = (action: AuditActionType) => {
    switch (action) {
      case 'VIEW':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono"><Eye className="w-3 h-3 text-slate-500" /> VIEW</span>;
      case 'DOWNLOAD':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono"><Download className="w-3 h-3 text-blue-600" /> DOWNLOAD</span>;
      case 'UPLOAD':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono"><Upload className="w-3 h-3 text-indigo-600" /> UPLOAD</span>;
      case 'NEW_VERSION':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 font-mono">NEW_VERSION</span>;
      case 'ROLLBACK':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 font-mono"><RotateCcw className="w-3 h-3 text-amber-600" /> ROLLBACK</span>;
      case 'APPROVE':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> APPROVE</span>;
      case 'REJECT':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono"><AlertCircle className="w-3 h-3 text-rose-600" /> REJECT</span>;
      case 'EDIT':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 font-mono"><FileEdit className="w-3 h-3" /> EDIT</span>;
      case 'PERMISSION_UPDATE':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono">PERMISSIONS</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">{action}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Институционален одит дневник и логове за сигурност
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Непрекъснат запис на всяко отваряне, сваляне, качване, одобрение и версионна промяна на учебната документация.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Експорт в CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
        
        {/* Search */}
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Търсене по потребител, документ, IP или описание..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* Action Select */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Действие:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value as any)}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">Всички действия</option>
            <option value="VIEW">VIEW (Преглед)</option>
            <option value="DOWNLOAD">DOWNLOAD (Сваляне)</option>
            <option value="UPLOAD">UPLOAD (Качване)</option>
            <option value="NEW_VERSION">NEW_VERSION (Нова версия)</option>
            <option value="ROLLBACK">ROLLBACK (Възстановяване)</option>
            <option value="APPROVE">APPROVE (Одобрение)</option>
            <option value="REJECT">REJECT (Връщане)</option>
            <option value="PERMISSION_UPDATE">PERMISSION_UPDATE (Права)</option>
          </select>
        </div>

        {/* Status Select */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Статус:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">Всички статуси</option>
            <option value="SUCCESS">SUCCESS (Успешно)</option>
            <option value="WARNING">WARNING (Предупреждение)</option>
            <option value="DENIED">DENIED (Отказан достъп)</option>
          </select>
        </div>

        <span className="text-slate-400 dark:text-slate-500 font-mono">
          {filteredLogs.length} от {auditLogs.length} записа
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Времеви отпечатък</th>
                <th className="px-4 py-3">Потребител</th>
                <th className="px-4 py-3">Роля</th>
                <th className="px-4 py-3">Действие</th>
                <th className="px-4 py-3">Документ</th>
                <th className="px-4 py-3">Детайли</th>
                <th className="px-4 py-3">IP Адрес</th>
                <th className="px-4 py-3 text-right">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img
                        src={log.user.avatar}
                        alt={log.user.name}
                        className="w-5 h-5 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                      />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{log.user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate text-slate-800 dark:text-slate-200 font-semibold" title={log.documentTitle}>
                    {log.documentTitle || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-sm truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-400 dark:text-slate-500">
                    {log.ipAddress}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-[11px]">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      log.status === 'SUCCESS'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : log.status === 'WARNING'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
