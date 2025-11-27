import React from 'react';
import { ArrowLeft, CheckCircle, Circle, AlertTriangle, Play, Download, Mail, Share2, ChevronRight } from 'lucide-react';

interface InterviewReportProps {
  onBack: () => void;
}

export function InterviewReport({ onBack }: InterviewReportProps) {
  return (
    <div className="max-w-[1400px] mx-auto p-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Назад к истории</span>
      </button>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - Left Column (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Hero Card with Gradient */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={20} />
                  <span className="text-sm opacity-90">Итоговое заключение</span>
                </div>
                <h2 className="text-white">Отличный результат!</h2>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90 mb-1">Финальный балл</div>
                <div className="text-5xl font-bold">87</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <CheckCircle size={16} />
                  <span className="text-sm">Этапы</span>
                </div>
                <div className="text-2xl font-bold">2/5</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span className="text-sm">Качество кода</span>
                </div>
                <div className="text-2xl font-bold">90<span className="text-lg font-bold">%</span></div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                  <span className="text-sm">Коммуникация</span>
                </div>
                <div className="text-2xl font-bold">85<span className="text-lg font-bold">%</span></div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span className="text-sm">Время</span>
                </div>
                <div className="text-xl font-bold">30 <span className="text-sm">мин</span> 47 <span className="text-sm">сек</span></div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#9333EA"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#9333EA" strokeWidth="2"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1 font-bold">Анализ от AI-интервьюера</h3>
                <p className="text-gray-600">Кандидат показал профессиональность</p>
              </div>
            </div>

            {/* Strong Points */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" fill="#10B981"/>
                </svg>
                <span className="text-gray-900 font-bold">Сильные стороны</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Отличное понимание базовых структур данных и алгоритмов</span>
                </div>
                <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Эффективное использование встроенных методов JavaScript</span>
                </div>
                <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Способность быстро выявлять и исправлять найденные случаи</span>
                </div>
                <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Отличное коммуникационные навыки и обоснование логики кода</span>
                </div>
              </div>
            </div>

            {/* Development Areas */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Circle size={20} className="text-blue-600 fill-blue-600" />
                <span className="text-gray-900 font-bold">Направления для развития</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
                  <Circle size={20} className="text-blue-600 fill-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Дальнейшее изучение сложной временной сложности алгоритмов (Big O-notation)</span>
                </div>
                <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
                  <Circle size={20} className="text-blue-600 fill-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Расширение знаний о системном дизайне и архитектурных паттернах</span>
                </div>
                <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
                  <Circle size={20} className="text-blue-600 fill-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Практика написания unit-тестов для собственного кода</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Task Analysis */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-gray-900 mb-6 font-bold">Детальный разбор задач</h3>

            <div className="space-y-4">
              {/* Task 1 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-gray-900 mb-1 font-bold">Задача 1: Реверс строки</div>
                    <div className="text-sm text-gray-500">Junior уровень</div>
                  </div>
                  <div className="text-green-600 font-bold">100% • 45 баллов</div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Время выполнения</div>
                    <div className="text-gray-900 font-bold">8 мин 34 сек</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Попытки запуска</div>
                    <div className="text-gray-900 font-bold">2</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Тесты</div>
                    <div className="text-green-600 font-bold">3/3 пройдены</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded p-2 text-xs text-gray-600">
                  ✓ Все тесты пройдены с первой попытки
                </div>
              </div>

              {/* Task 2 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-gray-900 mb-1 font-bold">Задача 2: Валидация скобок</div>
                    <div className="text-sm text-gray-500">Middle уровень</div>
                  </div>
                  <div className="text-green-600 font-bold">100% • 42 баллов</div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Время выполнения</div>
                    <div className="text-gray-900 font-bold">15 мин 56 сек</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Попытки запуска</div>
                    <div className="text-gray-900 font-bold">3</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Тесты</div>
                    <div className="text-green-600 font-bold">3/3 пройдены</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-orange-50 rounded p-2 text-xs text-orange-700 flex items-start gap-2">
                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>Обнаружена и исправлена граничная случай (пустой стек)</span>
                  </div>
                  <div className="bg-gray-50 rounded p-2 text-xs text-gray-600">
                    ✓ Выполнено исправление по��ле подсказки AI
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Replay */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Play size={24} />
              </div>
              <div>
                <h3 className="text-white mb-1">Архив фрагментов</h3>
                <p className="text-sm opacity-90">Code Replay</p>
                <p className="text-sm opacity-80 mt-2">
                  Просмотрите видеозапись процедуры тест-дривен разработки задачи в формате видео.
                  Каждый фрагмент синхронизирован с действиями кандидата и имеет детальные аннотации от AI.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2h12v12H2V2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                  <span className="text-sm">Записано событий</span>
                </div>
                <div className="text-3xl font-bold">1,247</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span className="text-sm">Длительность</span>
                </div>
                <div className="text-3xl font-bold">30:47</div>
              </div>
            </div>

            <button className="w-full bg-white text-purple-600 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <Play size={20} />
              Посмотреть Code Replay
            </button>
          </div>
        </div>

        {/* Right Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Security Check */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle size={18} className="text-green-600" />
              </div>
              <h3 className="text-gray-900 font-bold">Проверка безопасности</h3>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-green-600" />
                <span className="text-gray-900 font-bold">Пройдена</span>
              </div>
              <p className="text-sm text-gray-600">
                Все системы защиты нарушены во время прохождения
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Детектирование копирования</span>
                <CheckCircle size={16} className="text-gray-400" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Мониторинг вкладок</span>
                <CheckCircle size={16} className="text-gray-400" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Отслеживание входов</span>
                <CheckCircle size={16} className="text-gray-400" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Следование расписанию</span>
                <CheckCircle size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Code Quality Metrics */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-gray-900 mb-4 font-bold">Метрики качества кода</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Читаемость</span>
                  <span className="text-gray-900 font-bold">92%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Эффективность</span>
                  <span className="text-gray-900 font-bold">88%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Maintainability</span>
                  <span className="text-gray-900 font-bold">85%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-600 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Positive Result */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                <CheckCircle size={18} className="text-white" />
              </div>
              <h3 className="text-gray-900 font-bold">Положительный результат</h3>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              На основе результатов интервью, кандидат демонстрирует <span className="font-semibold">высокий уровень знаний</span>.
            </p>

            <div className="bg-white rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <CheckCircle size={16} />
                <span className="text-sm font-bold">Рекомендации к найму</span>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors mb-2">
              <Download size={18} />
              Скачать отчет
            </button>

            <button className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mb-2">
              <Mail size={18} />
              Отправить на email
            </button>

            <button className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <Share2 size={18} />
              Поделиться с коллегой
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}