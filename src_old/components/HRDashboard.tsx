import React, { useState } from 'react';
import { NewInterviewModal } from './NewInterviewModal';
import {
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Search,
  Plus,
  Calendar,
  Filter,
  BarChart3,
  Zap,
  Shield,
  Play,
  Eye,
  Download,
  Bell,
  Settings,
  Menu
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Candidate {
  id: string;
  name: string;
  position: string;
  avatar: string;
  status: 'in-progress' | 'completed' | 'scheduled' | 'pending';
  score?: number;
  date: string;
  duration?: string;
  progress?: number;
}

const candidates: Candidate[] = [
  {
    id: '1',
    name: 'Александр Мартинез',
    position: 'Senior Frontend Engineer',
    avatar: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?w=100&h=100&fit=crop',
    status: 'in-progress',
    progress: 67,
    date: 'Сегодня, 14:30',
    duration: '45 мин'
  },
  {
    id: '2',
    name: 'Сара Чен',
    position: 'Full Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?w=100&h=100&fit=crop',
    status: 'completed',
    score: 92,
    date: 'Сегодня, 11:00',
    duration: '1ч 15мин'
  },
  {
    id: '3',
    name: 'Михаил Робертс',
    position: 'Backend Engineer',
    avatar: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?w=100&h=100&fit=crop',
    status: 'scheduled',
    date: 'Завтра, 10:00'
  },
  {
    id: '4',
    name: 'Эмма Томпсон',
    position: 'DevOps Engineer',
    avatar: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?w=100&h=100&fit=crop',
    status: 'completed',
    score: 88,
    date: 'Вчера, 16:00',
    duration: '58 мин'
  },
  {
    id: '5',
    name: 'Джеймс Уилсон',
    position: 'Senior Backend Engineer',
    avatar: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?w=100&h=100&fit=crop',
    status: 'pending',
    date: 'Сегодня, 18:00'
  }
];

interface HRDashboardProps {
  onNavigate: (view: 'hr-dashboard' | 'interview') => void;
}

export function HRDashboard({ onNavigate }: HRDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewInterviewModalOpen, setIsNewInterviewModalOpen] = useState(false);

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'scheduled':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status: Candidate['status']) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'in-progress':
        return 'В процессе';
      case 'scheduled':
        return 'Запланировано';
      case 'pending':
        return 'Ожидает';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen p-6 relative">
      {/* Animated background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
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
            </div>

            <div className="flex items-center gap-3">
              {/* Navigation */}
              <div className="flex items-center gap-2 mr-2">
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white border border-blue-400/20 shadow-lg shadow-blue-500/30 transition-all">
                  Панель HR
                </button>
                <button 
                  onClick={() => onNavigate('interview')}
                  className="px-5 py-2.5 rounded-xl bg-white/80 text-slate-700 hover:bg-white border border-slate-200 transition-all shadow-lg"
                >
                  Интервью
                </button>
              </div>

              {/* Icons */}
              <button className="w-11 h-11 rounded-xl bg-white/80 hover:bg-white backdrop-blur-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-lg hover:shadow-blue-500/20">
                <Bell className="w-5 h-5" />
              </button>
              <button className="w-11 h-11 rounded-xl bg-white/80 hover:bg-white backdrop-blur-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-lg hover:shadow-blue-500/20">
                <Settings className="w-5 h-5" />
              </button>
              <button className="w-11 h-11 rounded-xl bg-white/80 hover:bg-white backdrop-blur-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-lg hover:shadow-blue-500/20">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 to-cyan-300/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-60" />
              <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 p-6 shadow-xl hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/50 to-transparent rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-600 text-sm">Активные интервью</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl text-slate-900 mb-2">24</div>
                  <div className="flex items-center gap-1 text-emerald-600 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>+12% за неделю</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-300/40 to-blue-300/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-60" />
              <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 p-6 shadow-xl hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/50 to-transparent rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-600 text-sm">Средний балл</span>
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl text-slate-900 mb-2">87.5</div>
                  <div className="flex items-center gap-1 text-emerald-600 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>+5.2 пункта</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/40 to-cyan-300/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-60" />
              <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 p-6 shadow-xl hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/50 to-transparent rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-600 text-sm">Сэкономлено времени</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="text-3xl text-slate-900 mb-2">156ч</div>
                  <div className="flex items-center gap-1 text-slate-600 text-sm">
                    <span>40% сокращение</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300/40 to-orange-300/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-60" />
              <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 p-6 shadow-xl hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/50 to-transparent rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-600 text-sm">Завершено</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="text-3xl text-slate-900 mb-2">342</div>
                  <div className="flex items-center gap-1 text-emerald-600 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>+18 за неделю</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
              <Input
                type="text"
                placeholder="Поиск кандидатов, должностей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative pl-12 h-12 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-2xl focus:bg-white backdrop-blur-xl shadow-lg"
              />
            </div>
            <Button className="h-12 px-6 bg-white/80 hover:bg-white backdrop-blur-xl border border-slate-200 text-slate-700 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all">
              <Filter className="w-5 h-5 mr-2" />
              Фильтры
            </Button>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-70" />
              <Button 
                onClick={() => setIsNewInterviewModalOpen(true)}
                className="relative h-12 px-6 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white rounded-2xl shadow-xl border border-blue-400/20"
              >
                <Plus className="w-5 h-5 mr-2" />
                Новое интервью
              </Button>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-3xl blur-2xl opacity-60" />
            <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 overflow-hidden shadow-2xl">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-white/50">
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl text-slate-900">Последние интервью</h2>
                  </div>
                  <div className="w-32 text-center">
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Прогресс</span>
                  </div>
                  <div className="w-24 text-center">
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Балл</span>
                  </div>
                  <div className="w-40">
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Дата</span>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-200">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="px-6 py-5 hover:bg-white/90 transition-all group/item relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/50 to-blue-100/0 opacity-0 group-hover/item:opacity-100 transition-all" />
                    <div className="relative flex items-center gap-6">
                      {/* Column 1: Candidate Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-2xl blur-md" />
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-slate-200 shadow-lg">
                            <ImageWithFallback
                              src={candidate.avatar}
                              alt={candidate.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {candidate.status === 'in-progress' && (
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse shadow-lg shadow-emerald-500/50" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-slate-900 truncate">{candidate.name}</h3>
                            <Badge
                              variant="outline"
                              className={`text-xs border flex-shrink-0 ${getStatusColor(candidate.status)}`}
                            >
                              {getStatusText(candidate.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 truncate">{candidate.position}</p>
                        </div>
                      </div>

                      {/* Column 2: Progress */}
                      <div className="w-32 flex-shrink-0">
                        {candidate.progress ? (
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs text-slate-500">{candidate.progress}%</span>
                              <span className="text-xs text-slate-600">{Math.floor(candidate.progress / 20)}/5</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                                style={{ width: `${candidate.progress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-slate-400 text-sm">—</div>
                        )}
                      </div>

                      {/* Column 3: Score */}
                      <div className="w-24 flex-shrink-0 text-center">
                        {candidate.score ? (
                          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200">
                            <span className="text-lg text-emerald-700">{candidate.score}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </div>

                      {/* Column 4: Date */}
                      <div className="w-40 flex-shrink-0">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="text-sm">{candidate.date}</span>
                        </div>
                        {candidate.duration && (
                          <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-xs">{candidate.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-300/50 to-pink-300/50 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all" />
              <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-purple-200 p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 backdrop-blur-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-slate-900">Античит активен</div>
                    <div className="text-sm text-slate-600">Мониторинг в реальном времени</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/50 to-cyan-300/50 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all" />
              <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-blue-200 p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 backdrop-blur-xl flex items-center justify-center shadow-lg">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-slate-900">Интеграция Scibox</div>
                    <div className="text-sm text-slate-600">Изолированное выполнен��е кода</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/50 to-teal-300/50 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all" />
              <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-emerald-200 p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 backdrop-blur-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-slate-900">Адаптивный скоринг</div>
                    <div className="text-sm text-slate-600">Оценка на базе ИИ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Interview Modal */}
      <NewInterviewModal
        open={isNewInterviewModalOpen}
        onOpenChange={setIsNewInterviewModalOpen}
      />
    </div>
  );
}
