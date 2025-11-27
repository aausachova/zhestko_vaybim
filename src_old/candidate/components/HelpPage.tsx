import React, { useState } from 'react';
import { Plus, MessageCircle, Clock, CheckCircle, ChevronRight, Phone, Mail } from 'lucide-react';
import { TicketDetail } from './TicketDetail';
import { NewTicketPage } from './NewTicketPage';

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: 'processing' | 'completed';
  author: string;
  date: string;
  category: string;
  unread?: boolean;
}

const mockTickets: Ticket[] = [
  {
    id: 9139,
    subject: 'Не могу войти в систему',
    description: 'Получаю ошибку при входе',
    status: 'processing',
    author: 'Александра',
    date: '21.11.2024',
    category: 'Техническая поддержка',
    unread: true,
  },
  {
    id: 8080,
    subject: 'Вопрос по интерфейсу отчётов',
    description: 'Как экспортировать отчёт в Excel?',
    status: 'processing',
    author: 'Максим',
    date: '20.11.2024',
    category: 'Задать вопрос',
  },
  {
    id: 6306,
    subject: 'Проблема с загрузкой документов',
    description: 'Документы не загружаются',
    status: 'completed',
    author: 'Сергей',
    date: '18.11.2024',
    category: 'Техническая поддержка',
  },
];

export function HelpPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [currentView, setCurrentView] = useState<'list' | 'new' | 'detail'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filteredTickets = mockTickets.filter(ticket => 
    activeTab === 'active' ? ticket.status === 'processing' : ticket.status === 'completed'
  );

  if (currentView === 'new') {
    return <NewTicketPage onBack={() => setCurrentView('list')} />;
  }

  if (selectedTicket && currentView === 'detail') {
    return <TicketDetail ticket={selectedTicket} onBack={() => { setSelectedTicket(null); setCurrentView('list'); }} />;
  }

  return (
    <div className="flex-1 overflow-auto bg-[#F5F7FA]">
      <div className="max-w-[1400px] mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Помощь и поддержка</h1>
            <p className="text-sm text-gray-500">Найдите ответы на вопросы или свяжитесь с нами</p>
          </div>
          <button 
            onClick={() => setCurrentView('new')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Создать обращение
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-6">
            <button 
              onClick={() => setActiveTab('active')}
              className={`pb-3 border-b-2 text-sm transition-colors ${
                activeTab === 'active'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Активные ({mockTickets.filter(t => t.status === 'processing').length})
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`pb-3 border-b-2 text-sm transition-colors ${
                activeTab === 'completed'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Завершённые ({mockTickets.filter(t => t.status === 'completed').length})
            </button>
          </nav>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">
                {activeTab === 'active' ? 'Нет активных обращений' : 'Нет завершённых обращений'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {activeTab === 'active' 
                  ? 'Создайте новое обращение, если у вас возникли вопросы'
                  : 'Здесь будут отображаться завершённые обращения'
                }
              </p>
              {activeTab === 'active' && (
                <button 
                  onClick={() => setCurrentView('new')}
                  className="px-6 py-2.5 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors"
                >
                  Создать обращение
                </button>
              )}
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => { setSelectedTicket(ticket); setCurrentView('detail'); }}
                className="w-full bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-500">Обращение #{ticket.id}</span>
                      {ticket.unread && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Новое сообщение
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        ticket.status === 'processing' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {ticket.status === 'processing' ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Обрабатывается
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Завершено
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <h3 className="text-base text-gray-900 mb-1">{ticket.subject}</h3>
                    <p className="text-sm text-gray-500 mb-3">{ticket.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{ticket.category}</span>
                      <span>•</span>
                      <span>{ticket.author}</span>
                      <span>•</span>
                      <span>{ticket.date}</span>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-4" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}