import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Code,
  Play,
  Check,
  X,
  ChevronRight,
  Clock,
  Activity,
  Sparkles,
  Terminal,
  Send,
  Volume2,
  VolumeX,
  Zap,
  Camera,
  CameraOff,
  AlertCircle,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface InterviewSessionProps {
  onNavigate: (view: 'hr-dashboard' | 'interview') => void;
}

export function InterviewSession({ onNavigate }: InterviewSessionProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'code'>('chat');
  const [code, setCode] = useState(`function fibonacci(n) {\n  // Ваше решение здесь\n  \n}`);
  const [chatMessage, setChatMessage] = useState('');

  const messages = [
    {
      id: '1',
      sender: 'ai',
      text: "Здравствуйте! Я Jam, ваш AI-интервьюер. Давайте начнём с краткого представления. Расскажите о вашем опыте во frontend-разработке?",
      time: '14:30'
    },
    {
      id: '2',
      sender: 'candidate',
      text: "Привет! У меня 5 лет опыта работы с React, TypeScript и современными веб-технологиями. Я разработал несколько крупномасштабных приложений и увлечён созданием отличного пользовательского опыта.",
      time: '14:31'
    },
    {
      id: '3',
      sender: 'ai',
      text: "Отлично! Теперь перейдём к задаче по программированию. Я хочу, чтобы вы реализовали функцию для вычисления n-го числа Фибоначчи. Напишите решение в редакторе кода.",
      time: '14:32'
    }
  ];

  const interviewStages = [
    { name: 'Представление', status: 'completed' },
    { name: 'Технические вопросы', status: 'completed' },
    { name: 'Задача по программированию', status: 'active' },
    { name: 'Системный дизайн', status: 'pending' },
    { name: 'Вопросы и ответы', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 relative">
      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-slate-900">AI Jam</h1>
                <p className="text-xs text-blue-600">Платформа собеседований</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Navigation */}
              <div className="flex items-center gap-2 mr-2">
                <button
                  onClick={() => onNavigate('hr-dashboard')}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all"
                >
                  Панель HR
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all">
                  Интервью
                </button>
              </div>

              {/* Time & Status */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-slate-900">45:32</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-300">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Запись</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg text-slate-900 mb-1">Сессия технического интервью</h2>
              <p className="text-sm text-slate-600">Позиция: Senior Frontend Engineer</p>
            </div>
            
            {/* Quick Status */}
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-700">AI активен</span>
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="flex items-center gap-2">
                <Circle className="w-3 h-3 text-blue-600 fill-blue-600" />
                <span className="text-sm text-slate-700">Этап 3 из 5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[340px_1fr] gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* AI Interviewer Card */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden">
              {/* AI Visual */}
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 relative flex flex-col items-center justify-center p-6">
                {/* Glass sphere */}
                <div className="mb-6">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white to-slate-100 border border-slate-200 flex items-center justify-center shadow-lg">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/40" />
                    <div className="absolute top-4 left-4 w-8 h-8 bg-white/80 rounded-full blur-lg" />
                    <Sparkles className="w-14 h-14 text-cyan-600 relative z-10" />
                  </div>
                </div>

                {/* AI name */}
                <div className="text-center mb-4">
                  <h3 className="text-slate-900 mb-1">Jam</h3>
                  <p className="text-cyan-700 text-sm">Голос активен</p>
                </div>

                {/* Audio Visualizer */}
                <div className="flex items-center gap-1">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full"
                      style={{
                        height: `${Math.random() * 24 + 8}px`,
                        opacity: 0.7
                      }}
                    />
                  ))}
                </div>

                <Badge className="absolute top-4 left-4 bg-emerald-100 text-emerald-700 border-emerald-300">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                  Активен
                </Badge>
              </div>

              {/* Controls */}
              <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                <div className="text-xs text-slate-600 mb-2">Управление сессией</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all ${
                      isMicOn
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                    }`}
                  >
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    <span className="text-xs">{isMicOn ? 'Микрофон' : 'Откл.'}</span>
                  </button>
                  
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all ${
                      isVideoOn
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                    }`}
                  >
                    {isVideoOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                    <span className="text-xs">{isVideoOn ? 'Камера' : 'Откл.'}</span>
                  </button>
                </div>
                
                <button
                  onClick={() => setIsSoundOn(!isSoundOn)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-all"
                >
                  {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span className="text-sm">{isSoundOn ? 'Звук AI вкл.' : 'Звук AI откл.'}</span>
                </button>
              </div>
            </div>

            {/* Interview Progress */}
            <div className="rounded-3xl bg-white border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900">Прогресс</h3>
                <span className="text-sm text-slate-600">3/5</span>
              </div>
              
              <div className="space-y-3">
                {interviewStages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      stage.status === 'completed'
                        ? 'bg-emerald-100'
                        : stage.status === 'active'
                        ? 'bg-blue-100 border-2 border-blue-400'
                        : 'bg-slate-100'
                    }`}>
                      {stage.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : stage.status === 'active' ? (
                        <Activity className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      stage.status === 'active'
                        ? 'text-slate-900'
                        : stage.status === 'completed'
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}>
                      {stage.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Task Card */}
            <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-slate-900">Текущая задача</h3>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-300">Активно</Badge>
                  </div>
                  <p className="text-sm text-slate-700">Последовательность Фибоначчи</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-slate-700">
                  <ChevronRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Временная сложность: O(n)</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <ChevronRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Пространственная: O(1)</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <ChevronRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Обработка граничных случаев</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white/60 border border-purple-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600">Используйте редактор кода для написания решения</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Chat/Code Editor */}
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="flex-1 flex flex-col">
              <div className="rounded-3xl bg-white border border-slate-200 flex-1 flex flex-col overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-white">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                      activeTab === 'chat'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Чат с AI</span>
                    {activeTab === 'chat' && <Badge className="bg-white/20 text-white border-white/20 ml-1">3</Badge>}
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                      activeTab === 'code'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Редактор кода</span>
                  </button>

                  <div className="flex-1" />

                  {activeTab === 'code' && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200">JavaScript</Badge>
                      <Button className="h-10 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl">
                        <Play className="w-4 h-4 mr-2" />
                        Запустить код
                      </Button>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                {activeTab === 'chat' ? (
                  <div className="flex-1 flex flex-col bg-slate-50">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl p-4 ${
                              message.sender === 'candidate'
                                ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white'
                                : 'bg-white text-slate-900 border border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {message.sender === 'ai' && (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                  <Sparkles className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <span className={`text-xs ${message.sender === 'candidate' ? 'text-white/80' : 'text-slate-600'}`}>
                                {message.sender === 'ai' ? 'Jam AI' : 'Вы'}
                              </span>
                              <span className={`text-xs ${message.sender === 'candidate' ? 'text-white/60' : 'text-slate-400'}`}>
                                {message.time}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-200 bg-white">
                      <div className="flex gap-3">
                        <Textarea
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Введите ваше сообщение..."
                          className="flex-1 min-h-[80px] resize-none rounded-2xl bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                        />
                        <div className="flex flex-col gap-2">
                          <Button className="h-full px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Нажмите Enter для отправки или используйте голосовой ввод</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col bg-slate-900">
                    {/* Code Editor */}
                    <div className="flex-1 p-6 overflow-auto">
                      <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-full min-h-[400px] font-mono text-sm bg-slate-950 text-slate-100 border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl resize-none"
                        spellCheck={false}
                      />
                    </div>

                    {/* Output Panel */}
                    <div className="border-t border-slate-700 bg-slate-800 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-slate-300">Вывод консоли</span>
                      </div>
                      <div className="rounded-xl bg-slate-950 border border-slate-700 p-4 min-h-[100px] font-mono text-sm text-slate-400">
                        <div className="text-slate-500">// Код ещё не запущен</div>
                        <div className="text-slate-600">// Нажмите "Запустить код" для выполнения</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
