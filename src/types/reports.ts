export type InterviewLevel = 'Junior' | 'Middle' | 'Senior';

export interface LevelReport {
  level: InterviewLevel;
  status: 'pending' | 'passed' | 'failed';
  visibleTests: {
    total: number;
    passed: number;
  };
  hiddenTests: {
    total: number;
    passed: number;
  };
  attempts: number;
  durationSeconds: number;
}

export interface SkillScore {
  name: string;
  score: number; // 0-10
  color: 'blue' | 'indigo' | 'orange' | 'pink' | 'purple' | 'green';
}

export interface CodeQualityMetric {
  readability: number;
  efficiency: number;
  maintainability: number;
}

export interface SecurityCheck {
  label: string;
  status: 'ok' | 'warning';
  message: string;
}

export interface TaskPerformance {
  name: string;
  level: InterviewLevel;
  durationLabel: string;
  status: 'solved' | 'partial' | 'failed';
  score: number;
  notes?: string;
}

export interface ReportInsights {
  headline: string;
  overallScore: number;
  solvedTasks: number;
  totalTasks: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  skillScores: SkillScore[];
  codeQuality: CodeQualityMetric;
  security: SecurityCheck[];
  tasks: TaskPerformance[];
}

export interface InterviewReportData {
  id: number;
  username: string;
  language: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  levels: LevelReport[];
  summary: ReportInsights;
  createdAt: string;
}

export interface CreateInterviewReportPayload {
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  language: string;
  levels: LevelReport[];
  summary: ReportInsights;
  rawChat?: any;
}

