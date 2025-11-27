import React from 'react';
import { LayoutDashboard, FileText, Users, BarChart3, UserCircle, Settings, ChevronRight, HelpCircle } from 'lucide-react';
import { UserRole } from '../App';
import t1Logo from '../assets/8fa47984bc2875c492bdadc06fb6f292057a7112.png';

interface SidebarProps {
  userRole: UserRole;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Sidebar({ userRole, currentPage = 'reports', onNavigate }: SidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Дашборд', active: currentPage === 'dashboard', badge: null, page: 'dashboard' },
    { icon: BarChart3, label: 'Тренажер', active: currentPage === 'trainer', badge: null, page: 'trainer' },
    { icon: Users, label: 'Отборы', active: currentPage === 'selections', badge: '3', badgeColor: 'purple', page: 'selections' },
    { icon: UserCircle, label: 'Мои навыки', active: currentPage === 'assistant', badge: null, page: 'assistant' },
    { icon: UserCircle, label: 'Профиль', active: currentPage === 'profile', badge: null, page: 'profile' },
    { icon: FileText, label: 'История', active: currentPage === 'history', badge: null, page: 'history' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-center">
        <img src={t1Logo} alt="T1 Собеседования" className="h-10 w-auto object-contain" />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => onNavigate?.(item.page)}
                className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                  item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    item.active ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>
                
                {item.badge && (
                  <span className={`ml-2 px-2 py-0.5 text-white text-xs rounded-full flex-shrink-0 ${
                    item.badgeColor === 'purple' ? 'bg-purple-500' : 'bg-red-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
                
                {!item.badge && (
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                    item.active ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button 
          onClick={() => onNavigate?.('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
            currentPage === 'settings' 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Settings className={`w-5 h-5 ${
            currentPage === 'settings' ? 'text-blue-600' : 'text-gray-500'
          }`} />
          <span>Настройки</span>
        </button>

        <button 
          onClick={() => onNavigate?.('help')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
            currentPage === 'help' 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <HelpCircle className={`w-5 h-5 ${
            currentPage === 'help' ? 'text-blue-600' : 'text-gray-500'
          }`} />
          <span>Помощь</span>
        </button>
        
        <div className="mt-3 px-3 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">?</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900 mb-1">Нужна помощь?</div>
              <p className="text-xs text-gray-600 mb-3">Свяжитесь с нашей поддержкой</p>
              <button 
                onClick={() => onNavigate?.('help')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Связаться
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}