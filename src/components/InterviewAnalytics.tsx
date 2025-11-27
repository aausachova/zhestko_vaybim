import React from 'react';
import { X, Target, TrendingUp, CheckCircle, AlertCircle, Award, Clock, Code } from 'lucide-react';

interface InterviewAnalyticsProps {
  interview: any;
  onClose: () => void;
  onGoToTrainer?: () => void;
}

export function InterviewAnalytics({ interview, onClose, onGoToTrainer }: InterviewAnalyticsProps) {
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
    { name: 'LRU Cache', difficulty: 'Hard', status: 'failed', time: '18 мин', score: 4 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-900 mb-1">Детальная аналитика</h2>
            <p className="text-sm text-gray-500">{interview.title} • {interview.date}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-900">Общий балл</span>
              </div>
              <div className="text-2xl text-green-900">{interview.score}/10</div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-900">Решено задач</span>
              </div>
              <div className="text-2xl text-blue-900">2/4</div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-purple-900">Уровень</span>
              </div>
              <div className="text-2xl text-purple-900">{interview.level}</div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-orange-900">Время</span>
              </div>
              <div className="text-2xl text-orange-900">{interview.duration}</div>
            </div>
          </div>

          {/* Skills Map */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Карта навыков
            </h3>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">{skill.name}</span>
                    <span className="text-sm text-gray-900">{skill.score}/10</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
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

          <div className="grid grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <h3 className="text-lg text-green-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Сильные стороны
              </h3>
              <ul className="space-y-3">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h3 className="text-lg text-amber-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Области для улучшения
              </h3>
              <ul className="space-y-3">
                {weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tasks Results */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Результаты по задачам
            </h3>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      task.status === 'solved' ? 'bg-green-100' :
                      task.status === 'partial' ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      {task.status === 'solved' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : task.status === 'partial' ? (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 mb-1">{task.name}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded ${
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
                      <div className="text-sm text-gray-900">{task.score}/10</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base text-blue-900 mb-1">Хотите улучшить результат?</h3>
                <p className="text-sm text-blue-700">Переходите в тренажер для отработки слабых мест</p>
              </div>
              <button 
                onClick={onGoToTrainer}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Перейти в тренажер
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}