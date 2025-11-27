import React, { useState } from 'react';
import { LayoutDashboard, Users, FolderOpen, BarChart3, Settings, HelpCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/d1b9ad995907140f67958f042a7842db9b8e5412.png';

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Дашборд' },
    { id: 'candidates', icon: Users, label: 'Кандидаты' },
    { id: 'selections', icon: FolderOpen, label: 'Отборы', badge: 2 },
    { id: 'statistics', icon: BarChart3, label: 'Статистика' },
  ];

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Настройки' },
    { id: 'help', icon: HelpCircle, label: 'Помощь' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <img src={logoImage} alt="TI Собесы" className="h-8" />
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-gray-200">
        <ul className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Icon size={20} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Help Widget */}
        <div className="mt-4 bg-blue-50 rounded-lg p-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mb-3">
            ?
          </div>
          <div className="mb-1 text-gray-900">Нужна помощь?</div>
          <div className="text-sm text-gray-600 mb-3">Свяжитесь с нашей поддержкой</div>
          <button className="text-sm text-blue-600 hover:underline">Связаться</button>
        </div>
      </div>
    </aside>
  );
}