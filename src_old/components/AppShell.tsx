import React from 'react';
import { Zap } from 'lucide-react';

interface AppShellProps {
  right?: React.ReactNode;
  children?: React.ReactNode;
}

export function AppShell({ right, children }: AppShellProps) {
  return (
    <div className="min-h-screen p-6 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 opacity-50 blur-xl" />
                <Zap className="w-6 h-6 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl text-slate-900">AI Jam</h1>
                <p className="text-sm text-blue-600">Платформа собеседований</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {right}
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}


