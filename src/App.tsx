import React, { Suspense, lazy, useEffect, useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { CandidateApp } from './CandidateApp';
import type { LoginResponse } from './services/api';

const HrPortal = lazy(() => import('./hr/HrPortal'));

export default function App() {
  const [auth, setAuth] = useState<LoginResponse | null>(null);
  const [showAuth, setShowAuth] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => console.log('[frontend] /api/health response:', data))
      .catch((error) => console.error('[frontend] /api/health error:', error));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as LoginResponse;
      setAuth(parsed);
      setShowAuth(false);
    } catch {
      localStorage.removeItem('auth');
    }
  }, []);

  const handleLogin = (data: LoginResponse) => {
    setAuth(data);
    setShowAuth(false);
    localStorage.setItem('auth', JSON.stringify(data));
  };

  const handleSignOut = () => {
    localStorage.removeItem('auth');
    setAuth(null);
    setShowAuth(true);
  };

  const renderContent = () => {
    if (!auth || showAuth) {
      return <AuthForm onLogin={handleLogin} />;
    }

    if (auth.role === 'admin') {
      return (
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center text-slate-500">
              Загружаем HR интерфейс...
            </div>
          }
        >
          <HrPortal username={auth.username} token={auth.token} onSignOut={handleSignOut} />
        </Suspense>
      );
    }

    return <CandidateApp username={auth.username} token={auth.token} onSignOut={handleSignOut} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {renderContent()}
    </div>
  );
}
