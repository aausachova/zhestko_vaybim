import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { InterviewReport } from './components/InterviewReport';

export default function App() {
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {showReport ? (
            <InterviewReport onBack={() => setShowReport(false)} />
          ) : (
            <Dashboard onViewReport={() => setShowReport(true)} />
          )}
        </main>
      </div>
    </div>
  );
}