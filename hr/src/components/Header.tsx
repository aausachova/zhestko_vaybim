import React from 'react';
import { Bell } from 'lucide-react';
import logoImage from 'figma:asset/4bcf1d7051c0747feabdc6da508d0a018cccdd94.png';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          {/* Left side - empty */}
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white">КР</span>
            </div>
            <div>
              <div className="text-sm text-gray-900">Кира Румянцева</div>
              <div className="text-xs text-gray-500">HRBP</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}