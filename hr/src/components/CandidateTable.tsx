import React from 'react';
import { Eye, Download, Clock, AlertTriangle } from 'lucide-react';
import type { InterviewReportData } from '../../../src/types/reports';

interface CandidateTableProps {
  reports: InterviewReportData[];
  loading: boolean;
  error: string | null;
  onViewReport?: (reportId: number) => void;
  onRetry?: () => void;
}

function formatDate(value?: string) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

function formatDuration(seconds?: number | null) {
  if (!seconds && seconds !== 0) return '—';
  const mins = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (mins === 0) return `${remainder} с`;
  return `${mins} мин ${remainder} с`;
}

export function CandidateTable({ reports, loading, error, onViewReport, onRetry }: CandidateTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-gray-900">Кандидаты</h2>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
            {onRetry && (
              <button className="text-amber-900 underline" onClick={onRetry}>
                Повторить
              </button>
            )}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-6 py-4 text-gray-600">Кандидат</th>
              <th className="text-left px-6 py-4 text-gray-600">Прогресс</th>
              <th className="text-left px-6 py-4 text-gray-600">Балл</th>
              <th className="text-left px-6 py-4 text-gray-600">Дата</th>
              <th className="text-left px-6 py-4 text-gray-600">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  Загрузка отчётов...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  Пока нет завершённых интервью
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">
                          {report.username
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-gray-900">{report.username}</div>
                        <div className="text-sm text-gray-500">{report.language}</div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded text-green-600 bg-green-50">
                        Завершено
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-900">100%</span>
                        <span className="text-sm text-gray-500">{report.summary?.headline ?? 'Аналитика'}</span>
                      </div>
                      <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {report.summary?.overallScore ? (
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-lg inline-block">
                        {report.summary.overallScore}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M2 6h12" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M5 2v2M11 2v2" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <span className="text-sm">{formatDate(report.createdAt ?? report.finishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Clock size={16} />
                      <span className="text-sm">{formatDuration(report.durationSeconds)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewReport?.(report.id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                        Просмотреть
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}