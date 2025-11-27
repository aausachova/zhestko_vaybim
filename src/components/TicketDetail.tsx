import React, { useState } from 'react';
import { ChevronLeft, Paperclip, Send, Phone, Mail } from 'lucide-react';

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: 'processing' | 'completed';
  author: string;
  date: string;
  category: string;
}

interface TicketDetailProps {
  ticket: Ticket;
  onBack: () => void;
}

interface Comment {
  id: number;
  author: string;
  authorRole: 'client' | 'support';
  text: string;
  date: string;
  time: string;
}

const mockComments: Comment[] = [
  {
    id: 1,
    author: 'Максим',
    authorRole: 'client',
    text: 'Пока непонятно',
    date: '8 прошлый четверг',
    time: '16:07',
  },
  {
    id: 2,
    author: 'Максим Сергеевич',
    authorRole: 'support',
    text: 'Всё работает?',
    date: '8 прошлый четверг',
    time: '16:07',
  },
  {
    id: 3,
    author: 'Максим',
    authorRole: 'client',
    text: 'Спасибо',
    date: '28.10.2025',
    time: '',
  },
  {
    id: 4,
    author: 'Максим',
    authorRole: 'client',
    text: 'Всё решили',
    date: '',
    time: '',
  },
];

export function TicketDetail({ ticket, onBack }: TicketDetailProps) {
  const [newComment, setNewComment] = useState('');

  const handleSendComment = () => {
    if (newComment.trim()) {
      console.log('Sending comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="fixed top-[73px] left-64 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Вернуться к списку обращений
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-8 pt-[140px]">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-500">Обращение #{ticket.id}</span>
                    <span className={`px-2.5 py-1 text-xs rounded-full ${
                      ticket.status === 'processing' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {ticket.status === 'processing' ? 'Обрабатывается' : 'Завершено'}
                    </span>
                  </div>
                  <h1 className="text-2xl text-gray-900 mb-2">{ticket.subject}</h1>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{ticket.category}</span>
                    <span>•</span>
                    <span>{ticket.date}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {ticket.description}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg">Комментарии</h2>
              </div>

              {/* Comments List */}
              <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                {mockComments.map((comment) => (
                  <div 
                    key={comment.id}
                    className={`flex gap-3 ${
                      comment.authorRole === 'client' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                      comment.authorRole === 'support' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {comment.author.charAt(0)}
                    </div>

                    {/* Comment Content */}
                    <div className={`flex-1 max-w-[70%] ${
                      comment.authorRole === 'client' ? 'items-end' : 'items-start'
                    } flex flex-col`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-900">{comment.author}</span>
                        {(comment.date || comment.time) && (
                          <span className="text-xs text-gray-500">
                            {comment.date} {comment.time && `в ${comment.time}`}
                          </span>
                        )}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-sm ${
                        comment.authorRole === 'support'
                          ? 'bg-gray-100 text-gray-900 rounded-tl-none'
                          : 'bg-blue-600 text-white rounded-tr-none'
                      }`}>
                        {comment.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Comment Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-3">
                  <button className="p-2.5 hover:bg-gray-200 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Написать сообщение..."
                      rows={1}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendComment();
                        }
                      }}
                    />
                  </div>

                  <button 
                    onClick={handleSendComment}
                    disabled={!newComment.trim()}
                    className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-1">
            {/* Support Responsible */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm text-gray-700 mb-4">Ответственный</h3>
              
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white">МС</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 mb-1">Максим Сергеевич</div>
                  <div className="text-xs text-gray-500">Служба поддержки</div>
                </div>
              </div>

              <div className="space-y-2">
                <a 
                  href="tel:+74951234567" 
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +7 (495) 123-45-67
                </a>
                <a 
                  href="mailto:support@vtb.ru" 
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  support@vtb.ru
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}