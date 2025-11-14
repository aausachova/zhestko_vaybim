import React, { useState } from 'react';
import { HRDashboard } from './components/HRDashboard';
import { InterviewSession } from './components/InterviewSession';

type View = 'hr-dashboard' | 'interview';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('hr-dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {currentView === 'hr-dashboard' ? (
        <HRDashboard onNavigate={setCurrentView} />
      ) : (
        <InterviewSession onNavigate={setCurrentView} />
      )}
    </div>
  );
}
