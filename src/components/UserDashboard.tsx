import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AppShell } from './AppShell';

interface UserDashboardProps {
  onSignOut: () => void;
}

export function UserDashboard({ onSignOut }: UserDashboardProps) {
  const [showForm, setShowForm] = useState(false);
  const [language, setLanguage] = useState('javascript');

  return (
    <AppShell
      right={
        <Button variant="outline" onClick={onSignOut}>Выйти</Button>
      }
    >
      <div className="max-w-3xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-3xl blur-2xl opacity-60" />
          <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 p-6 shadow-2xl">
            <h2 className="text-lg text-slate-900 mb-2">Новая сессия</h2>
            <p className="text-sm text-slate-600 mb-4">Запустите новое интервью, выбрав язык программирования.</p>
            <Button className="mb-4" onClick={() => setShowForm(true)}>Запустить новое интервью</Button>
            {showForm && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-700 mb-1 block">Язык</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите язык" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => alert(`Интервью запущено (${language})`)}>Запустить</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Отмена</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}


