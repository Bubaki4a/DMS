import React from 'react';
import { Shield, Check, X, Lock, Key, Users, BookOpen, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export const PermissionsMatrixView: React.FC = () => {
  const permissionsList = [
    {
      feature: 'Качване на нови документи',
      admin: true,
      teacher: true,
      student: false,
      note: 'Учителите качват планове, тестове и материали. Учениците предават само проекти/домашни при изрично задание.',
    },
    {
      feature: 'Създаване на нова версия (v1.1, v2.0)',
      admin: true,
      teacher: true,
      student: false,
      note: 'Само авторът или администраторът може да качва нови версии без загуба на история.',
    },
    {
      feature: 'Възстановяване към предишна версия (Rollback)',
      admin: true,
      teacher: true,
      student: false,
      note: 'Позволява връщане на документ към архивна версия.',
    },
    {
      feature: 'Одобрение и публикуване (Approve)',
      admin: true,
      teacher: false,
      student: false,
      note: 'Директорът или упълномощен зам.-директор финално одобрява официални планове.',
    },
    {
      feature: 'Връщане със забележки за корекция (Reject)',
      admin: true,
      teacher: true,
      student: false,
      note: 'Задължително въвеждане на мотиви и указания към автора.',
    },
    {
      feature: 'Преглед на административни актове и протоколи',
      admin: true,
      teacher: true,
      student: false,
      note: 'Ограничен достъп само за педагогическия и административен състав.',
    },
    {
      feature: 'Сваляне на одобрени учебни материали',
      admin: true,
      teacher: true,
      student: true,
      note: 'Учениците имат достъп до материали за техния клас (8-12 клас).',
    },
    {
      feature: 'Пълен преглед на системния одит дневник',
      admin: true,
      teacher: false,
      student: false,
      note: 'Администраторите следят всяко сваляне, IP адрес и опит за достъп.',
    },
    {
      feature: 'Архивиране и окончателно изтриване',
      admin: true,
      teacher: false,
      student: false,
      note: 'Защита от неволна загуба на учебни архиви.',
    },
    {
      feature: 'AI анализ и проверка за стандарти на МОН',
      admin: true,
      teacher: true,
      student: true,
      note: 'Генериране на автоматични резюмета и съответствие.',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Матрица на правата за достъп (Role-Based Access Control - RBAC)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Конфигурация на сигурността и нивата на достъп между Администратор (Директор), Учител и Ученик съгласно изискванията на училището.
        </p>
      </div>

      {/* Role Summary Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-4 space-y-1.5 transition-colors">
          <div className="flex items-center justify-between font-bold text-rose-900 dark:text-rose-200">
            <span>Администратор (Директор)</span>
            <Key className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-rose-800 dark:text-rose-300 text-[11px]">
            Пълен контрол: Утвърждаване на планове, заповеди, протоколи, управление на достъпа, пълен одит дневник и изтриване.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-1.5 transition-colors">
          <div className="flex items-center justify-between font-bold text-blue-900 dark:text-blue-200">
            <span>Учител (Педагогически състав)</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-blue-800 dark:text-blue-300 text-[11px]">
            Качване и версиониране на учебни планове, конспекти, тестове; изпращане за одобрение; преглед на колегиални материали.
          </p>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 space-y-1.5 transition-colors">
          <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
            <span>Ученик (Обучаем)</span>
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-emerald-800 dark:text-emerald-300 text-[11px]">
            Четене и сваляне на одобрени учебни материали, конспекти и задания съобразно своя клас и профил.
          </p>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Детайлна матрица на системните привилегии
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">Функция / Операция</th>
                <th className="px-4 py-3 text-center">Администратор</th>
                <th className="px-4 py-3 text-center">Учител</th>
                <th className="px-4 py-3 text-center">Ученик</th>
                <th className="px-4 py-3">Описание на сигурността</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {permissionsList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{item.feature}</td>
                  
                  <td className="px-4 py-3 text-center">
                    {item.admin ? (
                      <span className="inline-flex p-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.teacher ? (
                      <span className="inline-flex p-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.student ? (
                      <span className="inline-flex p-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-[11px]">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
