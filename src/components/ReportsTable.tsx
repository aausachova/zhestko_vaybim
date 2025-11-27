import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileText } from 'lucide-react';
import type { UserRole } from '../CandidateApp';

interface ReportsTableProps {
  userRole: UserRole;
  showEmpty: boolean;
}

interface Report {
  id: number;
  date: string;
  name: string;
  period: string;
  status: 'completed' | 'processing' | 'error';
}

const mockReports: Report[] = [
  {
    id: 1,
    date: '21.12.2024 в 8:32',
    name: 'Использование поступивших ДС',
    period: '01.10.2024 — 31.10.2024',
    status: 'completed',
  },
  {
    id: 2,
    date: '20.12.2024 в 12:04',
    name: 'Отчёт о погашении поставок',
    period: '01.08.2023 — 31.08.2023',
    status: 'processing',
  },
  {
    id: 3,
    date: '18.12.2024 в 18:01',
    name: 'Использование поступивших ДС',
    period: '01.10.2024 — 31.10.2024',
    status: 'processing',
  },
  {
    id: 4,
    date: '06.12.2024 в 12:40',
    name: 'Второй платёж в разрезе дебитора',
    period: '01.10.2024 — 31.10.2024',
    status: 'error',
  },
  {
    id: 5,
    date: '06.12.2024 в 8:32',
    name: 'Отчёт о погашении поставок',
    period: '01.10.2024 — 31.10.2024',
    status: 'completed',
  },
];

export function ReportsTable({ userRole, showEmpty }: ReportsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Для демонстрации можно переключать между пустым и заполненным состоянием
  const reports = showEmpty ? [] : mockReports;

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
            В обработке
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
            Сформирован
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
            Ошибка
            <span className="flex items-center justify-center w-4 h-4 bg-red-700 text-white rounded-full text-xs">!</span>
          </span>
        );
    }
  };

  const totalPages = Math.ceil(reports.length / itemsPerPage);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative">
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>По дате запроса</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>По типу отчёта</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>По статусу</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {reports.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Отчёты не найдены</h3>
            <p className="text-sm text-gray-500 text-center max-w-md mb-6">
              Создайте свой первый отчёт, нажав на кнопку «Новый отчёт» в правом верхнем углу
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Загрузить тестовые данные
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Дата запроса</th>
                <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Тип отчёта</th>
                <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Период отчёта</th>
                <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {reports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((report, index) => (
                <tr key={report.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index === reports.length - 1 ? 'border-b-0' : ''
                }`}>
                  <td className="px-6 py-4 text-sm text-gray-700">{report.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{report.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{report.period}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {report.status === 'error' ? (
                      <button className="text-sm text-blue-600 hover:text-blue-700">Повторить</button>
                    ) : (
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        Скачать
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {reports.length > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Показывать по:</span>
            <div className="relative">
              <select 
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-1.5 pr-8 border border-gray-300 rounded-lg appearance-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <span className="px-4 text-sm text-gray-700 min-w-[120px] text-center">
              {currentPage} из {totalPages}
            </span>
            
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}