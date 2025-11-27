import React from 'react';

interface Account {
  id: string;
  name: string;
  accountNumber: string;
  incoming: string;
  incomingCurrency: string;
  receipts: string;
  receiptsCurrency: string;
  available: string;
  availableCurrency: string;
  highlighted?: boolean;
}

const accounts: Account[] = [
  {
    id: '1',
    name: 'НАЗВАНИЕ И НОМЕР',
    accountNumber: '',
    incoming: '12 100 000,00',
    incomingCurrency: 'RUB',
    receipts: '475 600,00',
    receiptsCurrency: 'RUB',
    available: '12 375 600,00',
    availableCurrency: 'RUB'
  },
  {
    id: '2',
    name: 'Расчётный в рублях',
    accountNumber: '40702 810 9 7500 0987521',
    incoming: '18 800,00',
    incomingCurrency: 'USD',
    receipts: '1 400,00',
    receiptsCurrency: 'USD',
    available: '20 000,00',
    availableCurrency: 'USD',
    highlighted: true
  },
  {
    id: '3',
    name: 'Расчётный в долларах',
    accountNumber: '40702 840 8 3200 0987521',
    incoming: '12 300,00',
    incomingCurrency: 'EUR',
    receipts: '47 800,00',
    receiptsCurrency: 'EUR',
    available: '20 000,00',
    availableCurrency: 'EUR'
  },
  {
    id: '4',
    name: 'Расчётный в евро',
    accountNumber: '40702 840 8 3200 0987521',
    incoming: '',
    incomingCurrency: '',
    receipts: '',
    receiptsCurrency: '',
    available: '',
    availableCurrency: ''
  }
];

export function Dashboard() {
  return (
    <main className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl">
        {/* Top Action Tabs */}
        <div className="flex gap-4 mb-8">
          <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-200 flex items-center gap-2">
            <span>Подписать</span>
            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">98</span>
          </button>
          <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-200 flex items-center gap-2">
            <span>Оплатить</span>
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">10</span>
          </button>
          <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-200 flex items-center gap-2">
            <span>Отправить</span>
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">47</span>
          </button>
          <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-200 flex items-center gap-2">
            <span>Доработать</span>
            <span className="bg-gray-300 text-gray-700 text-xs px-1.5 py-0.5 rounded">9</span>
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Rubles */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">в рублях</div>
            <div className="text-3xl mb-2">34 575 600,00 <span className="text-gray-400">RUB</span></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">●</span>
              </div>
              <span className="text-sm text-gray-600">••5123</span>
            </div>
          </div>

          {/* Dollars */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">в долларах</div>
            <div className="text-3xl mb-2">20 000,00 <span className="text-gray-400">USD</span></div>
          </div>

          {/* Yuan */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">в юанях</div>
            <div className="text-3xl mb-2">12 900,00 <span className="text-gray-400">CNY</span></div>
          </div>
        </div>

        {/* Accounts Section */}
        <div>
          <h2 className="text-xl mb-4">Счета на главной</h2>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-700 w-[35%]"></th>
                  <th className="px-6 py-3 text-right text-sm text-gray-700">входящий</th>
                  <th className="px-6 py-3 text-right text-sm text-gray-700">поступления</th>
                  <th className="px-6 py-3 text-right text-sm text-gray-700">доступный</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {accounts.map((account) => (
                  <tr key={account.id} className={`hover:bg-gray-50 ${account.highlighted ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">{account.name}</div>
                        {account.accountNumber && (
                          <div className="text-xs text-gray-500">{account.accountNumber}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {account.incoming && (
                        <div className="space-y-0.5">
                          <div className="text-sm text-gray-900">{account.incoming}</div>
                          <div className="text-xs text-gray-500">{account.incomingCurrency}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {account.receipts && (
                        <div className="space-y-0.5">
                          <div className="text-sm text-gray-900">{account.receipts}</div>
                          <div className="text-xs text-gray-500">{account.receiptsCurrency}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {account.available && (
                        <div className="space-y-0.5">
                          <div className="text-sm text-gray-900">{account.available}</div>
                          <div className="text-xs text-gray-500">{account.availableCurrency}</div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="px-6 py-4 border-t border-gray-200">
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Все счета
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
