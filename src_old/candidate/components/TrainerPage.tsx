import React, { useState } from 'react';
import { Code, BookOpen, Target, TrendingUp, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';

export function TrainerPage() {
  const [activeTab, setActiveTab] = useState<'passed' | 'directions' | 'personalized'>('passed');

  const passedInterviews = [
    {
      id: '2024-11-247',
      title: 'Frontend собеседование',
      date: '26 ноября 2024',
      tasksTotal: 5,
      tasksSolved: 4,
      tasksWithErrors: 1,
      score: 8.5,
    },
    {
      id: '2024-11-246',
      title: 'React и TypeScript',
      date: '20 ноября 2024',
      tasksTotal: 5,
      tasksSolved: 3,
      tasksWithErrors: 2,
      score: 6.8,
    },
  ];

  const directions = [
    {
      name: 'Frontend Development',
      topics: ['React', 'JavaScript', 'CSS', 'TypeScript'],
      tasksCount: 120,
      completed: 45,
      icon: Code,
      color: 'blue',
    },
    {
      name: 'Backend Development',
      topics: ['Node.js', 'Databases', 'API', 'Security'],
      tasksCount: 95,
      completed: 12,
      icon: BookOpen,
      color: 'purple',
    },
    {
      name: 'Алгоритмы и структуры данных',
      topics: ['Сортировки', 'Деревья', 'Графы', 'Динамическое программирование'],
      tasksCount: 150,
      completed: 28,
      icon: Target,
      color: 'green',
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">AI тренажер</h1>
        <p className="text-sm text-gray-500">Практика и отработка навыков</p>
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
            Пройденные интервью
          </button>
          <button
            onClick={() => setActiveTab('directions')}
            className={`pb-3 border-b-2 text-sm transition-colors ${
              activeTab === 'directions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Задачники по направлениям
          </button>
          <button
            onClick={() => setActiveTab('personalized')}
            className={`pb-3 border-b-2 text-sm transition-colors ${
              activeTab === 'personalized'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Персонализированный задачник
          </button>
        </nav>
      </div>

      {/* Passed Interviews Tab */}
      {activeTab === 'passed' && (
        <div className="space-y-4">
          {passedInterviews.map((interview) => (
            <div key={interview.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg text-gray-900 mb-1">{interview.title}</h3>
                  <p className="text-sm text-gray-500">{interview.date} • ID: {interview.id}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {interview.score}/10
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Решено: {interview.tasksSolved}/{interview.tasksTotal}
                  </span>
                </div>
                {interview.tasksWithErrors > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-gray-700">
                      С неточностями: {interview.tasksWithErrors}
                    </span>
                  </div>
                )}
                {interview.tasksTotal - interview.tasksSolved - interview.tasksWithErrors > 0 && (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-gray-700">
                      Нерешенные: {interview.tasksTotal - interview.tasksSolved - interview.tasksWithErrors}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Посмотреть задачи
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Повторить интервью
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Directions Tab */}
      {activeTab === 'directions' && (
        <div className="grid grid-cols-2 gap-6">
          {directions.map((direction) => {
            const Icon = direction.icon;
            const progress = (direction.completed / direction.tasksCount) * 100;
            
            return (
              <div key={direction.name} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      direction.color === 'blue' ? 'bg-blue-100' :
                      direction.color === 'purple' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        direction.color === 'blue' ? 'text-blue-600' :
                        direction.color === 'purple' ? 'text-purple-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900">{direction.name}</h3>
                      <p className="text-sm text-gray-500">{direction.tasksCount} задач</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Прогресс</span>
                    <span className="text-sm text-gray-900">{direction.completed}/{direction.tasksCount}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        direction.color === 'blue' ? 'bg-blue-600' :
                        direction.color === 'purple' ? 'bg-purple-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {direction.topics.map((topic) => (
                    <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Начать практику
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Personalized Tab */}
      {activeTab === 'personalized' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-lg text-gray-900 mb-2">Персонализированный подход</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            На основе ваших пройденных интервью AI создаст индивидуальную программу для улучшения навыков
          </p>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Сгенерировать программу
          </button>
        </div>
      )}
    </div>
  );
}
