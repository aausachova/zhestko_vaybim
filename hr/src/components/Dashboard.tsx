import React from 'react';
import { Plus } from 'lucide-react';
import { StatCard } from './StatCard';
import { CandidateTable } from './CandidateTable';
import { Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onViewReport?: (candidate: any) => void;
}

export function Dashboard({ onViewReport }: DashboardProps) {
  const stats = [
    {
      icon: Users,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
      value: '27',
      label: 'всего кандидатов',
    },
    {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50',
      value: '18',
      label: 'завершено',
    },
    {
      icon: Clock,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-50',
      value: '3',
      label: 'в обработке',
    },
    {
      icon: TrendingUp,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-50',
      value: '83',
      suffix: '%',
      label: 'средний балл',
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Процесс найма сотрудников</h1>
          <p className="text-gray-600">Найдите ответы на вопросы или свяжитесь с нами</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Создать интервью
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Candidates Table */}
      <CandidateTable onViewReport={onViewReport} />
    </div>
  );
}