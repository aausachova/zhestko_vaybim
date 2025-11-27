import React, { useEffect, useState } from 'react';
import { HRDashboard } from './admin/HRDashboard';
import { InterviewSession as AdminInterviewSession } from './admin/InterviewSession';
import { AuthForm } from './components/AuthForm';
import { CandidateApp } from './CandidateApp';
import type { LoginResponse } from './services/api';

type View = 'hr-dashboard' | 'interview';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('hr-dashboard');
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
      return currentView === 'hr-dashboard' ? (
        <HRDashboard onNavigate={setCurrentView} />
      ) : (
        <AdminInterviewSession onNavigate={setCurrentView} />
      );
    }

    return <CandidateApp username={auth.username} token={auth.token} onSignOut={handleSignOut} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {auth && !showAuth && auth.role === 'admin' && (
        <div className="p-3 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <span className="text-slate-700 text-sm">Здравствуйте, {auth.username} ({auth.role})</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl bg-white/80 text-slate-700 hover:bg-white border border-slate-200 shadow"
            >
              Выйти
            </button>
          </div>
        </div>
      )}
      {renderContent()}
    </div>
  );
}
