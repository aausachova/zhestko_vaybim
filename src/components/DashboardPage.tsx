import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, TrendingUp, Target, Award, CheckCircle, Play, Zap, X } from 'lucide-react';

export function DashboardPage() {
  const [showPrepareModal, setShowPrepareModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const nextInterview = {
    company: 'Яндекс',
    position: 'Senior Frontend Developer',
    date: '30 ноября 2024',
    time: '14:00',
    daysLeft: 4,
  };

  const stats = {
    totalInterviews: 12,
    averageScore: 7.8,
    successfulInterviews: 4,
    skillLevel: 7.5,
    skillTitle: 'Middle Developer',
  };

  const recommendations = [
    {
      title: 'Отработать слабые места',
      description: 'AI заметил сложности с алгоритмами на графах',
      action: 'Перейти в тренажер',
      icon: Target,
      color: 'amber',
    },
    {
      title: 'Повторить последнее интервью',
      description: 'Улучшите результат 6.8 до 8+ баллов',
      action: 'Начать практику',
      icon: TrendingUp,
      color: 'blue',
    },
  ];

  const recentActivity = [
    {
      type: 'interview',
      title: 'Frontend собеседование',
      date: '26 ноября',
      score: 8.5,
      status: 'completed',
    },
    {
      type: 'practice',
      title: 'React задачник',
      date: '25 ноября',
      tasks: 5,
      status: 'completed',
    },
    {
      type: 'interview',
      title: 'Backend собеседование',
      date: '20 ноября',
      score: 6.8,
      status: 'completed',
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Добро пожаловать, Александра! 👋</h1>
        <p className="text-sm text-gray-500">Ваш прогресс и рекомендации для роста</p>
      </div>

      {/* Next Interview Alert */}
      {nextInterview && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm opacity-90">Ближайшее собеседование</span>
              </div>
              <h3 className="text-xl mb-1">{nextInterview.company} • {nextInterview.position}</h3>
              <p className="text-sm opacity-90">
                {nextInterview.date} в {nextInterview.time} • Осталось {nextInterview.daysLeft} дня
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowPrepareModal(true)}
                className="px-5 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Подготовиться
              </button>
              <button 
                onClick={() => setShowDetailsModal(true)}
                className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors flex items-center gap-2"
              >
                Детали
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base text-blue-100">Всего интервью</span>
            <CheckCircle className="w-6 h-6 text-blue-300" />
          </div>
          <h1 className="text-5xl text-white mb-1">{stats.totalInterviews}</h1>
          <p className="text-sm text-blue-200">+2 за этот месяц</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base text-gray-600">Средний балл</span>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-5xl text-gray-900 mb-1">{stats.averageScore}</h1>
          <p className="text-sm text-green-600">+0.3 за месяц</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base text-gray-600">Успешных</span>
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-5xl text-gray-900 mb-1">{stats.successfulInterviews}</h1>
          <p className="text-sm text-gray-600">из {stats.totalInterviews} интервью</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base text-gray-600">Уровень навыков</span>
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-5xl text-gray-900 mb-1">{stats.skillLevel}</h1>
          <p className="text-sm text-purple-600">{stats.skillTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Recommendations */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg">Рекомендации AI</h2>
            </div>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <div key={index} className={`p-4 rounded-xl border-2 ${
                  rec.color === 'amber' ? 'border-amber-100 bg-amber-50' : 'border-blue-100 bg-blue-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        rec.color === 'amber' ? 'bg-amber-100' : 'bg-blue-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          rec.color === 'amber' ? 'text-amber-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-base mb-1 ${
                          rec.color === 'amber' ? 'text-amber-900' : 'text-blue-900'
                        }`}>
                          {rec.title}
                        </h3>
                        <p className={`text-sm ${
                          rec.color === 'amber' ? 'text-amber-700' : 'text-blue-700'
                        }`}>
                          {rec.description}
                        </p>
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-lg text-sm transition-colors flex-shrink-0 ml-4 ${
                      rec.color === 'amber' 
                        ? 'bg-amber-600 text-white hover:bg-amber-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                      {rec.action}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-1 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg mb-4">Последняя активность</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'interview' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'interview' ? (
                      <Play className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Target className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 mb-0.5">{activity.title}</div>
                    <div className="text-xs text-gray-500">{activity.date}</div>
                    {activity.score && (
                      <div className="text-xs text-green-600 mt-1">Балл: {activity.score}/10</div>
                    )}
                    {activity.tasks && (
                      <div className="text-xs text-blue-600 mt-1">{activity.tasks} задач</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prepare Modal */}
      {showPrepareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl text-gray-900 mb-2">Подготовка к собеседованию</h2>
                <p className="text-sm text-gray-500">
                  {nextInterview.company} • {nextInterview.position}
                </p>
              </div>
              <button 
                onClick={() => setShowPrepareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-all text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base text-blue-900 mb-1">Перейти в тренажер</div>
                    <div className="text-sm text-blue-700">Отработать похожие задачи</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </div>
              </button>

              <button className="w-full p-4 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-all text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base text-purple-900 mb-1">Использовать помощник</div>
                    <div className="text-sm text-purple-700">Получить советы от AI</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                </div>
              </button>

              <button className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-all text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base text-green-900 mb-1">Пробное интервью</div>
                    <div className="text-sm text-green-700">Попробовать формат Senior</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-600" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl text-gray-900 mb-2">{nextInterview.company}</h2>
                <p className="text-base text-gray-700">{nextInterview.position}</p>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm text-blue-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Дата и время
                </h3>
                <p className="text-sm text-blue-800">
                  {nextInterview.date} в {nextInterview.time}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm text-purple-900 mb-2">Уровень сложности</h3>
                <p className="text-sm text-purple-800">Senior</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm text-gray-900 mb-2">Организационные моменты</h3>
                <p className="text-sm text-gray-700">
                  Длительность: 60-90 минут<br />
                  Формат: видеоконференция с AI-интервьюером<br />
                  Требуется: камера, микрофон, стабильное интернет-соединение
                </p>
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="text-sm text-amber-900 mb-2">Что ожидается</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• 3 задачи на алгоритмы и структуры данных</li>
                  <li>• Разбор архитектуры Frontend приложения</li>
                  <li>• Вопросы по React и TypeScript</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowPrepareModal(true);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Подготовиться
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Добавить в календарь
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}