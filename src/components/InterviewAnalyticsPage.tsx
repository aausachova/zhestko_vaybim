import React from 'react';
import { ArrowLeft, Target, TrendingUp, CheckCircle, AlertCircle, Award, Clock, Code, X } from 'lucide-react';
import type { InterviewReportData } from '../types/reports';

interface InterviewAnalyticsPageProps {
  report: InterviewReportData;
  onBack: () => void;
  onGoToTrainer?: () => void;
}

const SKILL_COLOR_CLASS: Record<string, string> = {
  blue: 'bg-blue-600',
  indigo: 'bg-indigo-600',
  orange: 'bg-orange-600',
  pink: 'bg-pink-600',
  purple: 'bg-purple-600',
  green: 'bg-green-600',
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const restMinutes = minutes % 60;
    return `${hours} ч ${restMinutes} мин`;
  }
  if (minutes > 0) {
    return `${minutes} мин ${seconds} с`;
  }
  return `${seconds} с`;
}

export function InterviewAnalyticsPage({ report, onBack, onGoToTrainer }: InterviewAnalyticsPageProps) {
  const { summary } = report;
  const skillScores = summary?.skillScores ?? [];
  const strengths = summary?.strengths ?? [];
  const improvements = summary?.improvements ?? [];
  const recommendations = summary?.recommendations ?? [];
  const tasks = summary?.tasks ?? [];
  const completedLevel = report.levels?.[report.levels.length - 1];
  const durationLabel = formatDuration(report.durationSeconds || 0);
  const finishedLabel = report.finishedAt
    ? new Date(report.finishedAt).toLocaleString('ru-RU')
    : new Date(report.createdAt).toLocaleString('ru-RU');
  const solvedLabel = summary
    ? `${summary.solvedTasks}/${summary.totalTasks || summary.solvedTasks || 1}`
    : `${tasks.filter((task) => task.status === 'solved').length}/${tasks.length || 1}`;

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Назад к отборам
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Отчёт по интервью</h1>
            <p className="text-base text-gray-600">
              {report.username} • {report.language} • {finishedLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-base text-green-900">Общий балл</span>
          </div>
          <div className="text-3xl text-green-900">{summary?.overallScore ?? '—'}</div>
        </div>

        <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-base text-blue-900">Решено задач</span>
          </div>
          <div className="text-3xl text-blue-900">{solvedLabel}</div>
        </div>

        <div className="bg-purple-50 rounded-2xl border-2 border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-base text-purple-900">Текущий уровень</span>
          </div>
          <div className="text-3xl text-purple-900">{completedLevel?.level ?? '—'}</div>
        </div>

        <div className="bg-orange-50 rounded-2xl border-2 border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-base text-orange-900">Длительность</span>
          </div>
          <div className="text-3xl text-orange-900">{durationLabel}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <h2 className="text-2xl text-gray-900 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Карта навыков
        </h2>
        {skillScores.length === 0 ? (
          <p className="text-sm text-gray-500">Навыковые метрики появятся после полного анализа.</p>
        ) : (
          <div className="space-y-5">
            {skillScores.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base text-gray-800">{skill.name}</span>
                  <span className="text-base text-gray-900">{skill.score}/10</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${SKILL_COLOR_CLASS[skill.color] ?? 'bg-blue-600'}`}
                    style={{ width: `${(skill.score / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-8">
          <h2 className="text-2xl text-green-900 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Сильные стороны
          </h2>
          {strengths.length === 0 ? (
            <p className="text-sm text-green-800">Ждём обратную связь от интервьюера.</p>
          ) : (
            <ul className="space-y-4">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3 text-base text-green-800">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  {strength}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-8">
          <h2 className="text-2xl text-amber-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Зоны роста
          </h2>
          {improvements.length === 0 ? (
            <p className="text-sm text-amber-800">Интервьюер не отметил критичных замечаний.</p>
          ) : (
            <ul className="space-y-4">
              {improvements.map((weakness, index) => (
                <li key={index} className="flex items-start gap-3 text-base text-amber-800">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                  {weakness}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <h2 className="text-2xl text-gray-900 mb-6 flex items-center gap-2">
          <Code className="w-6 h-6 text-blue-600" />
          Результаты по задачам
        </h2>
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">Подробный разбор задач появится после завершения анализа.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div
                key={`${task.name}-${index}`}
                className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      task.status === 'solved'
                        ? 'bg-green-100'
                        : task.status === 'partial'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}
                  >
                    {task.status === 'solved' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : task.status === 'partial' ? (
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <X className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-base text-gray-900 mb-2">{task.name}</div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700">{task.level}</span>
                      <span>•</span>
                      <span>{task.durationLabel || '—'}</span>
                    </div>
                    {task.notes && <p className="text-xs text-gray-500 mt-1">{task.notes}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-lg text-gray-900">{task.score}/10</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-200 p-8 mb-6">
          <h2 className="text-2xl text-blue-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Рекомендации
          </h2>
          <ul className="space-y-3 text-sm text-blue-900">
            {recommendations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl text-blue-900 mb-2">Хотите улучшить результат?</h3>
            <p className="text-base text-blue-700">Переходите в тренажёр и отработайте зоны роста.</p>
          </div>
          <button
            onClick={onGoToTrainer}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Перейти в тренажёр
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
