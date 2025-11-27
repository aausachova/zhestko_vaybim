import React, { useCallback, useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { InterviewReport } from './components/InterviewReport';
import type { InterviewReportData } from '../../src/types/reports';

export interface HrAppProps {
  username?: string;
  roleTitle?: string;
  token?: string;
  onSignOut?: () => void;
}

export default function App({
  username = 'Кира Румянцева',
  roleTitle = 'HRBP',
  token,
  onSignOut,
}: HrAppProps = {}) {
  const [showReport, setShowReport] = useState(false);
  const [reports, setReports] = useState<InterviewReportData[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<InterviewReportData | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (!token) return;
    setReportsLoading(true);
    setReportsError(null);
    try {
      const res = await fetch('/api/interviews', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Не удалось загрузить отчёты (${res.status})`);
      }
      const data = (await res.json()) as InterviewReportData[];
      setReports(data);
    } catch (err) {
      console.error('[HR] failed to fetch reports', err);
      setReportsError(err instanceof Error ? err.message : 'Не удалось загрузить отчёты');
    } finally {
      setReportsLoading(false);
    }
  }, [token]);

  const fetchReportById = useCallback(
    async (reportId: number) => {
      if (!token) return;
      setReportLoading(true);
      setReportError(null);
      try {
        const res = await fetch(`/api/interviews/${reportId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Не удалось загрузить отчёт (${res.status})`);
        }
        const data = (await res.json()) as InterviewReportData;
        setSelectedReport(data);
      } catch (err) {
        console.error('[HR] failed to fetch report', err);
        setReportError(err instanceof Error ? err.message : 'Не удалось загрузить отчёт');
      } finally {
        setReportLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleViewReport = useCallback(
    (reportId: number) => {
      const cached = reports.find((item) => item.id === reportId);
      if (cached) {
        setSelectedReport(cached);
      }
      setShowReport(true);
      fetchReportById(reportId);
    },
    [fetchReportById, reports],
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username={username} roleTitle={roleTitle} onSignOut={onSignOut} />
        <main className="flex-1 overflow-y-auto">
          {showReport ? (
            <InterviewReport
              report={selectedReport}
              loading={reportLoading}
              error={reportError}
              onBack={() => setShowReport(false)}
              onRefresh={() => selectedReport && fetchReportById(selectedReport.id)}
            />
          ) : (
            <Dashboard
              reports={reports}
              loading={reportsLoading}
              error={reportsError}
              onViewReport={handleViewReport}
              onRetry={fetchReports}
            />
          )}
        </main>
      </div>
    </div>
  );
}