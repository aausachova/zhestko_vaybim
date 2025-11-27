import React, { useState, useEffect } from 'react';
import { apiLogin, LoginResponse } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AppShell } from './AppShell';

interface AuthFormProps {
  onLogin: (data: LoginResponse) => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [username, setUsername] = useState('user');
  const [password, setPassword] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsername('user');
    setPassword('user');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(username, password);
      onLogin(res);
    } catch (err: any) {
      setError(err?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-3xl blur-2xl opacity-60" />
          <div className="relative w-full rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 p-6 shadow-2xl">
            <h1 className="text-xl text-slate-900 mb-1">Вход в систему</h1>
            <p className="text-sm text-slate-600 mb-6">Используйте <b>user/user</b> или <b>admin/admin</b></p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-slate-700 mb-1 block">Логин</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="user" />
              </div>
              <div>
                <label className="text-sm text-slate-700 mb-1 block">Пароль</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="user" />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Входим...' : 'Войти'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}


