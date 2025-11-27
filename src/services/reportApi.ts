import { CreateInterviewReportPayload, InterviewReportData } from '../types/reports';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function saveInterviewReport(token: string, payload: CreateInterviewReportPayload) {
  const res = await fetch('/api/interviews/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res) as Promise<{ report: InterviewReportData }>;
}

export async function fetchInterviewReports(token: string) {
  const res = await fetch('/api/interviews', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res) as Promise<InterviewReportData[]>;
}

export async function fetchInterviewReport(token: string, id: number) {
  const res = await fetch(`/api/interviews/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res) as Promise<InterviewReportData>;
}

