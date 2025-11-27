import React from 'react';
import { Bell, LogOut } from 'lucide-react';

interface HeaderProps {
  username?: string;
  roleTitle?: string;
  onSignOut?: () => void;
}

export function Header({ username = 'Кира Румянцева', roleTitle = 'HRBP', onSignOut }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2" />

        <div className="flex items-center gap-4">
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          )}

          <button className="relative rounded-lg p-2 transition-colors hover:bg-gray-50">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <span className="text-white text-sm">{username.slice(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <div className="text-sm text-gray-900">{username}</div>
              <div className="text-xs text-gray-500">{roleTitle}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}