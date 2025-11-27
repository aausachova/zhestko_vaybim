import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  value: string;
  suffix?: string;
  label: string;
}

export function StatCard({ icon: Icon, iconColor, iconBg, value, suffix, label }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon size={24} className={iconColor} />
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <h1 className="text-gray-900">{value}</h1>
        {suffix && <h1 className="text-gray-900">{suffix}</h1>}
      </div>
      <div className="text-gray-600 mt-1">{label}</div>
    </div>
  );
}