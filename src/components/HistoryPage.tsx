import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, ArrowRight, Building2, Target, TrendingUp } from 'lucide-react';
import { InterviewAnalyticsPage } from './InterviewAnalyticsPage';

interface HistoryPageProps {
  onNavigate?: (page: string) => void;
}

export function HistoryPage({ onNavigate }: HistoryPageProps) {
  const [activeTab, setActiveTab] = useState<'passed' | 'scheduled'>('passed');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);

  const passedInterviews = [
    {
      id: '2024-11-247',
      title: 'Frontend собеседование',
      company: 'Общее',
      date: '26 ноября 2024',
      duration: '45 мин',
      score: 8.5,
      level: 'Middle',
      status: 'completed',
      feedback: 'Отличное понимание React и TypeScript. Рекомендуется улучшить знания алгоритмов.',
    },
    {
      id: '2024-11-246',
      title: 'Backend собеседование',
      company: 'Яндекс',
      date: '20 ноября 2024',
      duration: '60 мин',
      score: 7.2,
      level: 'Middle',
      status: 'completed',
      feedback: 'Хорошее знание Node.js. Стоит углубить понимание баз данных и оптимизации запросов.',
    },
    {
      id: '2024-11-245',
      title: 'React Developer',
      company: 'VK',
      date: '15 ноября 2024',
      duration: '50 мин',
      score: 9.0,
      level: 'Middle',
      status: 'completed',
      feedback: 'Превосходное владение React и архитектурой frontend-приложений. Сильные навыки оптимизации.',
    },
  ];

  const scheduledInterviews = [
    {
      id: 1,
      company: 'Тинькофф',
      position: 'Senior Frontend Developer',
      date: '30 ноября 2024',
      time: '14:00',
      level: 'Senior',
      description: 'Техническое собеседование на позицию Senior Frontend Developer в команду платформы.',
      organizationalNotes: 'Собеседование пройдет в формате живого кодинга. Подготовьте рабочую среду.',
    },
    {
      id: 2,
      company: 'Сбер',
      position: 'Middle React Developer',
      date: '2 декабря 2024',
      time: '10:00',
      level: 'Middle',
      description: 'Интервью для оценки навыков работы с React и TypeScript.',
      organizationalNotes: 'Длительность собеседования: 60 минут. Необходима камера.',
    },
  ];

  const handleShowAnalytics = (interview: any) => {
    setSelectedInterview(interview);
    setShowAnalytics(true);
  };

  const handleGoToTrainer = () => {
    setShowAnalytics(false);
    onNavigate?.('trainer');
  };

  const handleBackFromAnalytics = () => {
    setShowAnalytics(false);
    setSelectedInterview(null);
  };

  if (showAnalytics && selectedInterview) {
    return (
      <InterviewAnalyticsPage
        interview={selectedInterview}
        onBack={handleBackFromAnalytics}
        onGoToTrainer={handleGoToTrainer}
      />
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">История</h1>
        <p className="text-sm text-gray-500">Пройденные и назначенные собеседования</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('passed')}
            className={`pb-3 border-b-2 text-sm transition-colors ${
              activeTab === 'passed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Пройденные ({passedInterviews.length})
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`pb-3 border-b-2 text-sm transition-colors ${
              activeTab === 'scheduled'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Назначенные ({scheduledInterviews.length})
          </button>
        </nav>
      </div>

      {/* Passed Interviews Tab */}
      {activeTab === 'passed' && (
        <div className="space-y-4">
          {passedInterviews.map((interview) => (
            <div key={interview.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg text-gray-900">{interview.title}</h3>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {interview.level}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs ${
                      interview.score >= 8 
                        ? 'bg-green-100 text-green-700'
                        : interview.score >= 7
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {interview.score}/10
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {interview.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {interview.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {interview.duration}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-xs text-gray-500 mb-1">Отзыв AI-интервьюера</div>
                    <p className="text-sm text-gray-700">{interview.feedback}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleShowAnalytics(interview)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <TrendingUp className="w-4 h-4" />
                  Посмотреть аналитику
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Повторить интервью
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scheduled Interviews Tab */}
      {activeTab === 'scheduled' && (
        <div className="space-y-4">
          {scheduledInterviews.map((interview) => (
            <div key={interview.id} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg text-gray-900">{interview.company}</h3>
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {interview.level}
                    </span>
                  </div>
                  
                  <p className="text-base text-gray-700 mb-3">{interview.position}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {interview.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {interview.time}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 mb-3">
                    <div className="text-xs text-blue-900 mb-2 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      Информация о компании
                    </div>
                    <p className="text-sm text-blue-800">{interview.description}</p>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="text-xs text-amber-900 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Организационные моменты
                    </div>
                    <p className="text-sm text-amber-800">{interview.organizationalNotes}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Подготовиться в тренажере
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Добавить в календарь
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}