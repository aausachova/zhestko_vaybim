import React, { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { StatCard } from './StatCard';
import { CandidateTable } from './CandidateTable';
import { Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import type { InterviewReportData } from '../../../src/types/reports';

interface DashboardProps {
  reports: InterviewReportData[];
  loading: boolean;
  error: string | null;
  onViewReport?: (reportId: number) => void;
  onRetry?: () => void;
}

export function Dashboard({ reports, loading, error, onViewReport, onRetry }: DashboardProps) {
  const stats = useMemo(() => {
    const total = reports.length;
    const completed = total;
    const avgScore =
      reports.reduce((acc, report) => acc + (report.summary?.overallScore ?? 0), 0) / (total || 1);
    const inProgress = 0;
    const avgDuration =
      reports.reduce((acc, report) => acc + (report.durationSeconds ?? 0), 0) / (total || 1);
    return [
      {
        icon: Users,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50',
        value: total.toString(),
        label: 'всего кандидатов',
      },
      {
        icon: CheckCircle,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-50',
        value: completed.toString(),
        label: 'завершено',
      },
      {
        icon: Clock,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-50',
        value: inProgress.toString(),
        label: 'в обработке',
      },
      {
        icon: TrendingUp,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-50',
        value: Number.isFinite(avgScore) ? Math.round(avgScore).toString() : '0',
        suffix: '%',
        label: 'средний балл',
      },
    ];
  }, [reports]);

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Процесс найма сотрудников</h1>
          <p className="text-gray-600">Отчёты от AI-интервьюера обновляются в реальном времени</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Создать интервью
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <CandidateTable reports={reports} loading={loading} error={error} onRetry={onRetry} onViewReport={onViewReport} />
    </div>
  );
}