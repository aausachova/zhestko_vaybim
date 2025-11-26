import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './components/DashboardPage';
import { HelpPage } from './components/HelpPage';
import { TrainerPage } from './components/TrainerPage';
import { SelectionsPage } from './components/SelectionsPage';
import { AssistantPage } from './components/AssistantPage';
import { ProfilePage } from './components/ProfilePage';
import { HistoryPage } from './components/HistoryPage';
import { Bell, X, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export type UserRole = 'debtor' | 'factor';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('debtor');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Интервью завершено',
      message: 'Отчёт по собеседованию в Яндекс готов к просмотру',
      time: '5 мин назад',
      unread: true,
    },
    {
      id: 2,
      type: 'info',
      title: 'Новое интервью назначено',
      message: 'Собеседование в Тинькофф назначено на 30 ноября в 14:00',
      time: '2 часа назад',
      unread: true,
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Напоминание',
      message: 'До собеседования в Яндекс осталось 2 дня. Рекомендуем пройти тренировку',
      time: '1 день назад',
      unread: false,
    },
  ];

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      <Sidebar 
        userRole={userRole} 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Платформа для честных AI-собеседований</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative hover:opacity-70 transition-opacity"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    ></div>
                    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-base text-gray-900">Уведомления</h3>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                              notification.unread ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                notification.type === 'success' ? 'bg-green-100' :
                                notification.type === 'info' ? 'bg-blue-100' :
                                'bg-amber-100'
                              }`}>
                                {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {notification.type === 'info' && <Calendar className="w-4 h-4 text-blue-600" />}
                                {notification.type === 'reminder' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="text-sm text-gray-900">{notification.title}</h4>
                                  {notification.unread && (
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                                <span className="text-xs text-gray-400">{notification.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-3 text-center border-t border-gray-200">
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Посмотреть все уведомления
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <button 
                onClick={() => setCurrentPage('profile')}
                className="flex items-center gap-3 hover:opacity-70 transition-opacity"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">АУ</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm">Александра Усачева</span>
                  <span className="text-xs text-gray-500">Frontend Developer</span>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'trainer' && <TrainerPage />}
          {currentPage === 'selections' && <SelectionsPage />}
          {currentPage === 'assistant' && <AssistantPage />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'history' && <HistoryPage onNavigate={setCurrentPage} />}
          {currentPage === 'help' && <HelpPage />}
          {currentPage === 'settings' && (
            <div className="max-w-[1400px] mx-auto p-8">
              <h1 className="text-3xl mb-2">Настройки</h1>
              <p className="text-sm text-gray-500">Управление параметрами платформы</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}