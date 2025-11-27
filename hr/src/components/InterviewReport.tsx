import React from 'react';
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Download,
  Mail,
  Share2,
  Target,
  Award,
  Clock,
  Shield,
} from 'lucide-react';
import type { InterviewReportData } from '../../../src/types/reports';

interface InterviewReportProps {
  report: InterviewReportData | null;
  loading?: boolean;
  error?: string | null;
  onBack: () => void;
  onRefresh?: () => void;
}

const SKILL_COLORS: Record<string, string> = {
  blue: 'bg-blue-600',
  indigo: 'bg-indigo-600',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-600',
  green: 'bg-green-600',
};

function formatDuration(seconds?: number | null) {
  if (!seconds && seconds !== 0) return '—';
  const mins = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (mins === 0) return `${rest} с`;
  return `${mins} мин ${rest} с`;
}

function formatDateTime(value?: string | null) {
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

export function InterviewReport({ report, loading, error, onBack, onRefresh }: InterviewReportProps) {
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={20} />
          <span>Назад к списку</span>
        </button>
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
          Отчёт загружается...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto p-8 space-y-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
          <span>Назад к списку</span>
        </button>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-semibold mb-2">Не удалось загрузить отчёт</p>
            <p className="text-sm">{error}</p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Повторить попытку
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-[1400px] mx-auto p-8 space-y-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
          <span>Назад к списку</span>
        </button>
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
          Выберите интервью, чтобы посмотреть подробный отчёт
        </div>
      </div>
    );
  }

  const summary = report.summary;
  const latestLevel = report.levels?.[report.levels.length - 1];
  const skillScores = summary?.skillScores ?? [];
  const strengths = summary?.strengths ?? [];
  const improvements = summary?.improvements ?? [];
  const recommendations = summary?.recommendations ?? [];
  const tasks = summary?.tasks ?? [];
  const securityChecks = summary?.security ?? [];
  const codeQuality = summary?.codeQuality;
  const solvedLabel = summary
    ? `${summary.solvedTasks}/${summary.totalTasks || summary.solvedTasks || 1}`
    : '—';

  return (
    <div className="max-w-[1400px] mx-auto p-8 space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft size={20} />
        <span>Назад к списку</span>
      </button>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <p className="text-sm opacity-80 mb-1">Кандидат</p>
                <h2 className="text-3xl font-semibold">{report.username}</h2>
                <p className="text-sm opacity-80 mt-2">
                  Язык: {report.language} • Завершено {formatDateTime(report.finishedAt ?? report.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80 mb-1">Финальный балл</p>
                <p className="text-5xl font-bold">{summary?.overallScore ?? '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <Award size={16} />
                  <span className="text-sm">Решено</span>
                </div>
                <div className="text-2xl font-bold">{solvedLabel}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <Target size={16} />
                  <span className="text-sm">Уровень</span>
                </div>
                <div className="text-2xl font-bold">{latestLevel?.level ?? '—'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <Clock size={16} />
                  <span className="text-sm">Длительность</span>
                </div>
                <div className="text-xl font-bold">{formatDuration(report.durationSeconds)}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <Shield size={16} />
                  <span className="text-sm">Античит</span>
                </div>
                <div className="text-xl font-bold">{securityChecks.length ? 'Проверено' : '—'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Карта навыков</h3>
            </div>
            {skillScores.length === 0 ? (
              <p className="text-sm text-gray-500">Навыковые метрики появятся после полного анализа</p>
            ) : (
              <div className="space-y-4">
                {skillScores.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-900">{skill.score}/10</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${SKILL_COLORS[skill.color] ?? 'bg-blue-600'}`}
                        style={{ width: `${(skill.score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-700" />
                <h3 className="text-lg font-semibold text-green-900">Сильные стороны</h3>
              </div>
              {strengths.length === 0 ? (
                <p className="text-sm text-green-800">Интервьюер не выделил особых сильных сторон.</p>
              ) : (
                <ul className="space-y-3 text-sm text-green-900">
                  {strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-1"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-semibold text-amber-900">Зоны роста</h3>
              </div>
              {improvements.length === 0 ? (
                <p className="text-sm text-amber-800">Комментариев по улучшениям нет.</p>
              ) : (
                <ul className="space-y-3 text-sm text-amber-900">
                  {improvements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mt-1"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Результаты по задачам</h3>
            </div>
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-500">Данные по задачам появятся после анализа.</p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task, idx) => (
                  <div key={`${task.name}-${idx}`} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-gray-900 font-semibold">{task.name}</p>
                        <p className="text-sm text-gray-500">
                          Уровень: {task.level} • Время: {task.durationLabel || '—'}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          task.status === 'solved'
                            ? 'bg-green-100 text-green-700'
                            : task.status === 'partial'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {task.status === 'solved'
                          ? 'Решено'
                          : task.status === 'partial'
                          ? 'Частично'
                          : 'Не решено'}
                      </span>
                    </div>
                    {task.notes && <p className="text-sm text-gray-600 mt-3">{task.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {recommendations.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Рекомендации</h3>
              </div>
              <ul className="space-y-3 text-sm text-blue-900">
                {recommendations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Античит-метрики</h3>
            </div>
            {securityChecks.length === 0 ? (
              <p className="text-sm text-gray-500">События не зафиксированы</p>
            ) : (
              <ul className="space-y-3">
                {securityChecks.map((check, idx) => (
                  <li
                    key={`${check.label}-${idx}`}
                    className="flex items-start gap-3 text-sm px-3 py-2 rounded-lg border"
                    style={{
                      borderColor: check.status === 'ok' ? '#bbf7d0' : '#fed7aa',
                      backgroundColor: check.status === 'ok' ? '#f0fdf4' : '#fff7ed',
                    }}
                  >
                    <CheckCircle
                      className={`w-4 h-4 mt-1 ${check.status === 'ok' ? 'text-green-600' : 'text-amber-600'}`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{check.label}</p>
                      <p className="text-xs text-gray-600">{check.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Метрики качества кода</h3>
            {codeQuality ? (
              <div className="space-y-4">
                {Object.entries(codeQuality).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">
                        {key === 'readability'
                          ? 'Читаемость'
                          : key === 'efficiency'
                          ? 'Эффективность'
                          : 'Поддерживаемость'}
                      </span>
                      <span className="text-sm text-gray-900 font-semibold">{value}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Метрики появятся после оценки качества кода.</p>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                <CheckCircle size={18} className="text-white" />
              </div>
              <h3 className="text-gray-900 font-bold">Результат интервью</h3>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              AI-интервьюер завершил оценку. Посмотрите отчёт, экспортируйте результат или поделитесь с командой.
            </p>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                <Download size={18} />
                Скачать отчёт (PDF)
              </button>
              <button className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <Mail size={18} />
                Отправить по email
              </button>
              <button className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <Share2 size={18} />
                Поделиться с коллегой
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

