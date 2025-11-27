import React, { useState } from 'react';
import { Plus, Briefcase, Users, Calendar, Clock, ArrowRight, Target, X } from 'lucide-react';
import { InterviewSession } from './InterviewSession';
import { InterviewPreStartModal } from './InterviewPreStartModal';
import { InterviewLoadingModal } from './InterviewLoadingModal';
import { InterviewCompletedNotification } from './InterviewCompletedNotification';

interface SelectionsPageProps {
  token: string;
}

export function SelectionsPage({ token }: SelectionsPageProps) {
  const [showStartModal, setShowStartModal] = useState(false);
  const [showPreStartModal, setShowPreStartModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showCompletedNotification, setShowCompletedNotification] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPrepareModal, setShowPrepareModal] = useState(false);
  const [showReportView, setShowReportView] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');
  const languages = [
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'TypeScript', label: 'TypeScript' },
    { value: 'Python', label: 'Python' },
    { value: 'Go', label: 'Go' },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);

  const interviews = [
    {
      id: 1,
      type: 'general',
      title: 'Общее техническое интервью',
      description: 'Универсальное собеседование для оценки общих навыков',
      icon: Users,
      color: 'blue',
    },
    {
      id: 2,
      type: 'vacancy',
      title: 'Интервью под вакансию',
      description: 'Специализированное собеседование под конкретную позицию',
      icon: Briefcase,
      color: 'purple',
    },
  ];

  const scheduledInterviews = [
    {
      id: 1,
      company: 'Яндекс',
      position: 'Senior Frontend Developer',
      date: '30 ноября 2024',
      time: '14:00',
      level: 'Senior',
      status: 'scheduled',
    },
    {
      id: 2,
      company: 'VK',
      position: 'Middle React Developer',
      date: '2 декабря 2024',
      time: '10:00',
      level: 'Middle',
      status: 'scheduled',
    },
  ];

  const handleLevelSelected = (level: string) => {
    setSelectedLevel(level);
    setShowStartModal(false);
    setShowPreStartModal(true);
  };

  const handleStartInterview = () => {
    setShowPreStartModal(false);
    setShowLoadingModal(true);
  };

  const handleLoadingComplete = () => {
    setShowLoadingModal(false);
    setInterviewStarted(true);
  };

  const handleExitInterview = () => {
    setInterviewStarted(false);
    setShowCompletedNotification(true);
  };

  const handleViewReport = () => {
    setShowCompletedNotification(false);
    setShowReportView(true);
  };

  const handleShowDetails = (interview: any) => {
    setSelectedInterview(interview);
    setShowDetailsModal(true);
  };

  const handleShowPrepare = (interview: any) => {
    setSelectedInterview(interview);
    setShowPrepareModal(true);
  };

  if (showReportView) {
    // Временно показываем модалку - позже сделаем отдельную страницу
    return (
      <div className="max-w-[1400px] mx-auto p-8">
        <button 
          onClick={() => setShowReportView(false)}
          className="mb-4 text-blue-600 hover:text-blue-700"
        >
          ← Назад к отборам
        </button>
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl text-gray-900 mb-4">Отчёт по собеседованию</h2>
          <p className="text-gray-600">Аналитика будет отображаться здесь</p>
        </div>
      </div>
    );
  }

  if (interviewStarted) {
    return <InterviewSession level={selectedLevel} language={selectedLanguage} token={token} onExit={handleExitInterview} />;
  }

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Отборы</h1>
        <p className="text-sm text-gray-500">Пройдите собеседование с AI-интервьюером</p>
      </div>

      {/* Interview Types */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {interviews.map((interview) => {
          const Icon = interview.icon;
          return (
            <div key={interview.id} className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                interview.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                <Icon className={`w-8 h-8 ${
                  interview.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                }`} />
              </div>
              
              <h3 className="text-xl text-gray-900 mb-2">{interview.title}</h3>
              <p className="text-sm text-gray-500 mb-6">{interview.description}</p>

              <button 
                onClick={() => setShowStartModal(true)}
                className={`w-full px-6 py-3 rounded-lg text-white transition-colors ${
                  interview.color === 'blue' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Начать собеседование
              </button>
            </div>
          );
        })}
      </div>

      {/* Scheduled Interviews */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg text-gray-900">Назначенные собеседования</h2>
            <p className="text-sm text-gray-500">Интервью, запланированные работодателями</p>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            {scheduledInterviews.length} активных
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {scheduledInterviews.map((interview) => (
            <div key={interview.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base text-gray-900">{interview.company}</h3>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                      {interview.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{interview.position}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {interview.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {interview.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleShowPrepare(interview)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Подготовиться
                  </button>
                  <button 
                    onClick={() => handleShowDetails(interview)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                  >
                    Детали
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Interview Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">Выберите уровень собеседования</h2>
              <p className="text-sm text-gray-500">
                AI-интервьюер адаптирует сложность задач под ваш уровень
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Язык собеседования</p>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setSelectedLanguage(lang.value)}
                    className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      selectedLanguage === lang.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-base text-gray-900">{lang.label}</div>
                    <div className="text-xs text-gray-500">IDE и тесты для этого стека</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button 
                onClick={() => handleLevelSelected('Junior')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base text-gray-900 mb-1">Junior</div>
                    <div className="text-sm text-gray-500">Начальный уровень, базовые задачи</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>

              <button 
                onClick={() => handleLevelSelected('Middle')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base text-gray-900 mb-1">Middle</div>
                    <div className="text-sm text-gray-500">Средний уровень, практические задачи</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>

              <button 
                onClick={() => handleLevelSelected('Senior')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base text-gray-900 mb-1">Senior</div>
                    <div className="text-sm text-gray-500">Продвинутый уровень, сложные задачи</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            </div>

            <button 
              onClick={() => setShowStartModal(false)}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Loading Modal */}
      {showLoadingModal && (
        <InterviewLoadingModal onComplete={handleLoadingComplete} />
      )}

      {/* Pre-Start Modal */}
      {showPreStartModal && (
        <InterviewPreStartModal
          level={selectedLevel}
          onStart={handleStartInterview}
          onCancel={() => setShowPreStartModal(false)}
        />
      )}

      {/* Completed Notification */}
      {showCompletedNotification && (
        <InterviewCompletedNotification
          onViewReport={handleViewReport}
          onClose={() => setShowCompletedNotification(false)}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedInterview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl text-gray-900 mb-2">{selectedInterview.company}</h2>
                <p className="text-base text-gray-700">{selectedInterview.position}</p>
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
                  {selectedInterview.date} в {selectedInterview.time}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm text-purple-900 mb-2">Уровень сложности</h3>
                <p className="text-sm text-purple-800">{selectedInterview.level}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm text-gray-900 mb-2">Организационные моменты</h3>
                <p className="text-sm text-gray-700">
                  Длительность: 60-90 минут<br />
                  Формат: видеоконференция с AI-интервьюером<br />
                  Требуется: камера, микрофон, стабильное интернет-соединение
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setShowDetailsModal(false);
                  handleShowPrepare(selectedInterview);
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

      {/* Prepare Modal */}
      {showPrepareModal && selectedInterview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">Подготовка к собеседованию</h2>
              <p className="text-sm text-gray-500">
                {selectedInterview.company} • {selectedInterview.position}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-all text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base text-blue-900 mb-1">Перейти в AI тренажер</div>
                    <div className="text-sm text-blue-700">Отработать похожие задачи</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </div>
              </button>

              <button className="w-full p-4 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-all text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base text-purple-900 mb-1">Использовать помощник</div>
                    <div className="text-sm text-purple-700">Подготовка с AI-рекрутером</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                </div>
              </button>

              <button className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-all text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base text-green-900 mb-1">Пробное интервью</div>
                    <div className="text-sm text-green-700">Попробовать формат {selectedInterview.level}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-600" />
                </div>
              </button>
            </div>

            <button 
              onClick={() => setShowPrepareModal(false)}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}