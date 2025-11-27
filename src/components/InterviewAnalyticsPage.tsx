import React from 'react';
import { ArrowLeft, Target, TrendingUp, CheckCircle, AlertCircle, Award, Clock, Code, X } from 'lucide-react';

interface InterviewAnalyticsPageProps {
  interview: any;
  onBack: () => void;
  onGoToTrainer?: () => void;
}

export function InterviewAnalyticsPage({ interview, onBack, onGoToTrainer }: InterviewAnalyticsPageProps) {
  const skills = [
    { name: 'React', score: 9.0, color: 'blue' },
    { name: 'TypeScript', score: 8.5, color: 'indigo' },
    { name: 'Алгоритмы', score: 6.5, color: 'orange' },
    { name: 'CSS', score: 8.0, color: 'pink' },
    { name: 'Архитектура', score: 7.5, color: 'purple' },
  ];

  const strengths = [
    'Отличное понимание React hooks и жизненного цикла компонентов',
    'Сильные навыки работы с TypeScript и типизацией',
    'Хорошее понимание принципов чистого кода',
  ];

  const weaknesses = [
    'Требуется улучшение знаний алгоритмов и структур данных',
    'Недостаточный опыт с оптимизацией производительности',
    'Слабые знания паттернов проектирования',
  ];

  const tasks = [
    { name: 'Two Sum', difficulty: 'Easy', status: 'solved', time: '8 мин', score: 10 },
    { name: 'Valid Parentheses', difficulty: 'Easy', status: 'solved', time: '12 мин', score: 9 },
    { name: 'Binary Tree Level Order', difficulty: 'Medium', status: 'partial', time: '25 мин', score: 7 },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Назад к истории
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Детальная аналитика</h1>
            <p className="text-base text-gray-600">{interview.title} • {interview.date}</p>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-base text-green-900">Общий балл</span>
          </div>
          <div className="text-3xl text-green-900">{interview.score}/10</div>
        </div>

        <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-base text-blue-900">Решено задач</span>
          </div>
          <div className="text-3xl text-blue-900">2/3</div>
        </div>

        <div className="bg-purple-50 rounded-2xl border-2 border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-base text-purple-900">Уровень</span>
          </div>
          <div className="text-3xl text-purple-900">{interview.level}</div>
        </div>

        <div className="bg-orange-50 rounded-2xl border-2 border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-base text-orange-900">Время</span>
          </div>
          <div className="text-3xl text-orange-900">{interview.duration}</div>
        </div>
      </div>

      {/* Skills Map */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <h2 className="text-2xl text-gray-900 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Карта навыков
        </h2>
        <div className="space-y-5">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-gray-800">{skill.name}</span>
                <span className="text-base text-gray-900">{skill.score}/10</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    skill.color === 'blue' ? 'bg-blue-600' :
                    skill.color === 'indigo' ? 'bg-indigo-600' :
                    skill.color === 'orange' ? 'bg-orange-600' :
                    skill.color === 'pink' ? 'bg-pink-600' :
                    'bg-purple-600'
                  }`}
                  style={{ width: `${(skill.score / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-8">
          <h2 className="text-2xl text-green-900 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Сильные стороны
          </h2>
          <ul className="space-y-4">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3 text-base text-green-800">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-8">
          <h2 className="text-2xl text-amber-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Области для улучшения
          </h2>
          <ul className="space-y-4">
            {weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-3 text-base text-amber-800">
                <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tasks Results */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <h2 className="text-2xl text-gray-900 mb-6 flex items-center gap-2">
          <Code className="w-6 h-6 text-blue-600" />
          Результаты по задачам
        </h2>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  task.status === 'solved' ? 'bg-green-100' :
                  task.status === 'partial' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
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
                    <span className={`px-2.5 py-1 rounded ${
                      task.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      task.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {task.difficulty}
                    </span>
                    <span>•</span>
                    <span>{task.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-gray-900">{task.score}/10</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl text-blue-900 mb-2">Хотите улучшить результат?</h3>
            <p className="text-base text-blue-700">Переходите в тренажер для отработки слабых мест</p>
          </div>
          <button 
            onClick={onGoToTrainer}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Перейти в тренажер
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
