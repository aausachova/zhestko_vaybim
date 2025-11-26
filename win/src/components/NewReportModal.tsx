import React, { useState } from 'react';
import { X, Calendar, ChevronDown, Search, HelpCircle, FileText } from 'lucide-react';
import { UserRole } from '../App';

interface NewReportModalProps {
  userRole: UserRole;
  onClose: () => void;
}

type DebtorReportType = 'debts' | 'limits';
type FactorReportType = 'cash_usage' | 'repayment' | 'second_payment' | 'debts' | 'limits';

type DebtStatus = 
  | 'Обратно уступлена'
  | 'Погашена'
  | 'Просрочена по контракту'
  | 'Просрочена по периоду ожидания'
  | 'Профинансирована'
  | 'Создана';

export function NewReportModal({ userRole, onClose }: NewReportModalProps) {
  const [selectedReportType, setSelectedReportType] = useState<DebtorReportType | FactorReportType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<DebtStatus[]>([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedClients, setSelectedClients] = useState<Array<{inn: string, name: string}>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Mock client data
  const mockClients = [
    { inn: '7707083893', name: 'ПАО "Сбербанк России"' },
    { inn: '7736207543', name: 'ООО "Яндекс"' },
    { inn: '7702070139', name: 'АО "Альфа-Банк"' },
    { inn: '7725497022', name: 'ООО "Газпром нефть"' },
    { inn: '7743001840', name: 'ПАО "МТС"' },
    { inn: '7707049388', name: 'ООО "Лукойл"' },
  ];

  const filteredClients = searchQuery.trim()
    ? mockClients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.inn.includes(searchQuery)
      )
    : [];

  const addClient = (client: {inn: string, name: string}) => {
    if (!selectedClients.find(c => c.inn === client.inn)) {
      setSelectedClients([...selectedClients, client]);
    }
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const removeClient = (inn: string) => {
    setSelectedClients(selectedClients.filter(c => c.inn !== inn));
  };

  const debtorReports = [
    { id: 'debts', label: 'Задолженности' },
    { id: 'limits', label: 'Лимиты' },
  ];

  const factorReports = [
    { id: 'cash_usage', label: 'Использование поступивших ДС' },
    { id: 'repayment', label: 'Отчёт о погашении поставок' },
    { id: 'second_payment', label: 'Второй платёж в разрезе дебитора' },
    { id: 'debts', label: 'Задолженности' },
    { id: 'limits', label: 'Лимиты' },
  ];

  const availableReports = userRole === 'debtor' ? debtorReports : factorReports;

  const debtStatuses: DebtStatus[] = [
    'Обратно уступлена',
    'Погашена',
    'Просрочена по контракту',
    'Просрочена по периоду ожидания',
    'Профинансирована',
    'Создана',
  ];

  const toggleStatus = (status: DebtStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const showSearchFilter = selectedReportType === 'debts' || selectedReportType === 'limits';
  const showStatusFilter = selectedReportType === 'debts';
  const showDateFilter = selectedReportType === 'debts';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div 
        className="relative bg-white w-full max-w-md h-full overflow-hidden flex flex-col shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg">Новый отчёт</h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Report Type Selection */}
          <div className="mb-6">
            <label className="block text-sm mb-2 text-gray-700">
              Выберите тип отчёта
            </label>
            
            <div className="relative">
              <select
                value={selectedReportType || ''}
                onChange={(e) => setSelectedReportType(e.target.value as any)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="" disabled>Выберите тип отчёта</option>
                {availableReports.map((report) => (
                  <option key={report.id} value={report.id}>
                    {report.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Parameters Section */}
          {selectedReportType ? (
            <div>
              <h3 className="text-sm mb-4 text-gray-700">Параметры выгрузки</h3>
              
              {/* Date Range Filter for debts */}
              {showDateFilter && (
                <>\n                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">
                      Дата поставки, от
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        placeholder="01.10.2024"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">
                      Дата поставки, до
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        placeholder="31.10.2024"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">
                      Дата финансирования, от
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="12345 ЕР от 12.12.2025"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}
              
              {/* Search Filter */}
              {showSearchFilter && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">
                    Поиск клиента по наименованию или ИНН
                  </label>
                  
                  {/* Selected Clients */}
                  {selectedClients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedClients.map(client => (
                        <div 
                          key={client.inn}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm"
                        >
                          <span>{client.name}</span>
                          <button
                            type="button"
                            onClick={() => removeClient(client.inn)}
                            className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchResults(e.target.value.trim().length > 0);
                      }}
                      onFocus={() => {
                        if (searchQuery.trim().length > 0) {
                          setShowSearchResults(true);
                        }
                      }}
                      onBlur={() => {
                        // Delay to allow click on results
                        setTimeout(() => setShowSearchResults(false), 200);
                      }}
                      placeholder="Введите наименование или ИНН"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    {/* Search Results Dropdown */}
                    {showSearchResults && filteredClients.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                        {filteredClients.map(client => (
                          <button
                            key={client.inn}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => addClient(client)}
                          >
                            <div className="text-sm text-gray-900">{client.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">ИНН: {client.inn}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* No Results */}
                    {showSearchResults && searchQuery.trim() && filteredClients.length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
                        <p className="text-sm text-gray-500 text-center">Клиенты не найдены</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Filter */}
              {showStatusFilter && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">
                    Статус денежного требования
                  </label>
                  <div className="relative">
                    <button 
                      type="button"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left text-sm flex items-center justify-between hover:bg-gray-50"
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    >
                      <span className="text-gray-500">
                        {selectedStatuses.length > 0 
                          ? `Выбрано: ${selectedStatuses.length}` 
                          : 'Выберите статусы'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {/* Dropdown with checkboxes */}
                    {showStatusDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                        {debtStatuses.map((status) => (
                          <label 
                            key={status}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedStatuses.includes(status)}
                              onChange={() => toggleStatus(status)}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm">{status}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Date Range for other reports */}
              {!showDateFilter && selectedReportType !== 'limits' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">
                      Дата поставки, от
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        placeholder="01.10.2024"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">
                      Дата поставки, до
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        placeholder="31.10.2024"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-base text-gray-900 mb-2">Выберите тип отчёта</h3>
              <p className="text-sm text-gray-500 text-center max-w-xs leading-relaxed">
                Укажите его тип, чтобы выбрать параметры и сформировать отчёт
              </p>
            </div>
          )}

          {/* Tooltip/Help Section */}
          {selectedReportType && userRole === 'factor' && (
            <div className="mt-6 p-4 bg-gray-900 text-white rounded-lg relative">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="mb-2">В зависимсти от выбранного типа отчёта меняю��ся названия:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs opacity-90">
                    <li>Использование поступивших ДС<br/>Дата параметр от — Дата параметр до</li>
                    <li>Отчёт о погашении поставок<br/>Дата погашения от — Дата погашения до</li>
                    <li>Второй платёж в разрее дебитора<br/>Дата второго платежа от — Дата второго платежа до</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-200">
          <button 
            disabled={!selectedReportType}
            className="w-full py-3 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Сформировать отчёт
          </button>
        </div>
      </div>
    </div>
  );
}