import React from 'react';
import { Eye, Download, Clock } from 'lucide-react';

interface Candidate {
  name: string;
  position: string;
  status: 'completed' | 'in-progress' | 'waiting';
  statusLabel: string;
  progress: number;
  score: string;
  rating: string;
  date: string;
  duration: string;
}

interface CandidateTableProps {
  onViewReport?: (candidate: Candidate) => void;
}

export function CandidateTable({ onViewReport }: CandidateTableProps) {
  const candidates: Candidate[] = [
    {
      name: 'Усачева Александра',
      position: 'Frontend Developer',
      status: 'completed',
      statusLabel: 'Завершено',
      progress: 100,
      score: '87',
      rating: '5/5',
      date: '15 ноября',
      duration: '45 мин',
    },
    {
      name: 'Мария Шевченко',
      position: 'Full Stack Engineer',
      status: 'in-progress',
      statusLabel: 'В процессе',
      progress: 60,
      score: '',
      rating: '3/5',
      date: '20 ноября',
      duration: '30 мин',
    },
    {
      name: 'Дмитрий Петренко',
      position: 'Backend Developer',
      status: 'completed',
      statusLabel: 'Завершено',
      progress: 100,
      score: '92',
      rating: '5/5',
      date: '18 ноября',
      duration: '50 мин',
    },
    {
      name: 'Анна Сидоренко',
      position: 'Frontend Developer',
      status: 'waiting',
      statusLabel: 'Ожидает',
      progress: 0,
      score: '',
      rating: '0/5',
      date: '25 ноября',
      duration: '',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'waiting':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-600';
      case 'in-progress':
        return 'bg-purple-600';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-gray-900">Кандидаты</h2>
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
            {candidates.map((candidate, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                {/* Candidate Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600">{candidate.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <div className="text-gray-900">{candidate.name}</div>
                      <div className="text-sm text-gray-500">{candidate.position}</div>
                    </div>
                    {candidate.status !== 'waiting' && (
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(candidate.status)}`}>
                        {candidate.statusLabel}
                      </span>
                    )}
                  </div>
                </td>

                {/* Progress */}
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-900">{candidate.progress}%</span>
                      <span className="text-sm text-gray-500">{candidate.rating}</span>
                    </div>
                    <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(candidate.status)} transition-all`}
                        style={{ width: `${candidate.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </td>

                {/* Score */}
                <td className="px-6 py-4">
                  {candidate.score ? (
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-lg inline-block">
                      {candidate.score}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <path d="M2 6h12" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5 2v2M11 2v2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <span className="text-sm">{candidate.date}</span>
                  </div>
                  {candidate.duration && (
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Clock size={16} />
                      <span className="text-sm">{candidate.duration}</span>
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onViewReport?.(candidate)}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}