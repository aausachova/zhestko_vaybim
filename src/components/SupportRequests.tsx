import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';

interface Request {
  id: string;
  date: string;
  description: string;
  status: 'reviewed' | 'clarification' | 'cancelled' | 'in-review';
  statusText: string;
  requestId: string;
  hasReview?: boolean;
}

const requests: Request[] = [
  {
    id: '1',
    date: '10.12.2023, 20:50',
    description: 'Зарегистрировано обращение по интернет-банку',
    status: 'reviewed',
    statusText: 'Рассмотрено',
    requestId: 'SD-010938659',
    hasReview: true
  },
  {
    id: '2',
    date: '10.12.2023, 20:40',
    description: 'Зарегистрирована претензия по интернет-банку',
    status: 'reviewed',
    statusText: 'Рассмотрено',
    requestId: 'CR-010938659',
    hasReview: true
  },
  {
    id: '3',
    date: '11.12.2023, 09:10',
    description: 'Зарегистрирована претензия по интернет-банку',
    status: 'clarification',
    statusText: 'На уточнении',
    requestId: 'CR-010938659'
  },
  {
    id: '4',
    date: '10.12.2023, 08:50',
    description: 'Зарегистрирована претензия по интернет-банку',
    status: 'clarification',
    statusText: 'На уточнении',
    requestId: 'CR-010938659'
  },
  {
    id: '5',
    date: '09.12.2023, 07:01',
    description: 'Зарегистрирована претензия по интернет-банку',
    status: 'cancelled',
    statusText: 'Отменено',
    requestId: 'CR-010938659'
  },
  {
    id: '6',
    date: '07.12.2023, 04:50',
    description: 'Зарегистрирована претензия по интернет-банку',
    status: 'cancelled',
    statusText: 'Отменено',
    requestId: 'CR-010938659'
  },
  {
    id: '7',
    date: '10.12.2023, 12:00',
    description: 'Зарегистрировано обращение по интернет-банку',
    status: 'in-review',
    statusText: 'На рассмотрении',
    requestId: 'SD-010938659'
  }
];

const getStatusColor = (status: Request['status']) => {
  switch (status) {
    case 'reviewed':
      return 'bg-green-500';
    case 'clarification':
      return 'bg-blue-500';
    case 'cancelled':
      return 'bg-red-500';
    case 'in-review':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

export function SupportRequests() {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-6xl">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Письма в банк</span>
        </button>

        {/* Page Title */}
        <h1 className="text-3xl text-gray-900 mb-2">Мои обращения</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          Срок обработки обращения займет до 7 рабочих дней с момента его создания
        </p>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-700">
                  Дата создания
                </th>
                <th className="px-6 py-3 text-left text-sm text-gray-700">
                  Обращение
                </th>
                <th className="px-6 py-3 text-left text-sm text-gray-700">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {request.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        {request.description}
                      </div>
                      {request.hasReview && (
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Оставить отзыв
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(request.status)}`} />
                        <span className="text-sm text-gray-900">{request.statusText}</span>
                      </div>
                      <div className="text-xs text-gray-500">{request.requestId}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
