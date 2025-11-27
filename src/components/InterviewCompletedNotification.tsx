import React from 'react';
import { CheckCircle, FileText, ArrowRight } from 'lucide-react';

interface InterviewCompletedNotificationProps {
  onViewReport: () => void;
  onClose: () => void;
  canViewReport?: boolean;
}

export function InterviewCompletedNotification({
  onViewReport,
  onClose,
  canViewReport = true,
}: InterviewCompletedNotificationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl text-gray-900 mb-2">Интервью завершено!</h2>
          <p className="text-base text-gray-600">
            Спасибо за прохождение собеседования. AI завершил анализ вашей сессии.
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base text-blue-900 mb-1">Отчёт готов</h3>
              <p className="text-sm text-blue-700">
                Детальная аналитика вашего выступления уже доступна. Просмотрите результаты, 
                чтобы узнать свои сильные стороны и области для улучшения.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong className="text-amber-900">Важно:</strong> Финальное решение по вашей кандидатуре 
            будет принято человеком-рекрутером после анализа отчёта. Вы получите уведомление в течение 2-3 рабочих дней.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Закрыть
          </button>
          <button
            onClick={onViewReport}
            disabled={!canViewReport}
            className={`flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              canViewReport ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canViewReport ? 'Просмотреть отчёт' : 'Отчёт формируется…'}
            {canViewReport && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
