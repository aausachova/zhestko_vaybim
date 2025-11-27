import React, { useState } from 'react';
import { X, ChevronDown, Paperclip, HelpCircle, Phone, Mail, AlertCircle } from 'lucide-react';

interface NewTicketModalProps {
  onClose: () => void;
}

export function NewTicketModal({ onClose }: NewTicketModalProps) {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    { value: 'question', label: 'Задать вопрос' },
    { value: 'technical', label: 'Техническая поддержка' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div 
        className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl">Новое обращение</h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Info Banner */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm text-blue-900 mb-1">Техническая поддержка</h3>
                <p className="text-sm text-blue-700">
                  Здесь вы можете задать вопросы по работе платформы. По всем вопросам финансирования, договоров и операций обращайтесь к вашему персональному менеджеру.
                </p>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm text-gray-700">
                Тема обращения
              </label>
              <div className="group relative">
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity w-64 z-10">
                  Выберите подходящую категорию: "Задать вопрос" для общих вопросов или "Техническая поддержка" для технических проблем
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="" disabled>Выберите тему обращения</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Заголовок
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Кратко опишите проблему"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Описание проблемы
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробно опишите вашу проблему или вопрос"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* File Attachment */}
          <div className="mb-6">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Paperclip className="w-4 h-4" />
              Прикрепить файл
            </button>
            <p className="text-xs text-gray-500 mt-2">Максимальный размер файла: 10 МБ</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button 
            onClick={onClose}
            disabled={!category || !subject || !description}
            className="px-6 py-2.5 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}