import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Send,
  Volume2,
  Settings,
  Play,
  MessageCircle,
  Mic,
  Video,
  X,
  Check,
  Maximize2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { sendInterviewTurn, requestAutocompleteSnippet } from '../../services/aiInterview';
import { buildInterviewSystemPrompt } from '../../prompts/interview';
import type { OpenRouterMessage } from '../../services/openRouterClient';

interface InterviewSessionProps {
  level: string;
  onExit: () => void;
}

interface ChatMessage {
  from: 'ai' | 'user';
  text: string;
  time: string;
}

const initialTests = [
  { input: '[2, 7, 11, 15], target = 9', expected: '[0, 1]', passed: true },
  { input: '[3, 2, 4], target = 6', expected: '[1, 2]', passed: true },
  { input: '[3, 3], target = 6', expected: '[0, 1]', passed: false },
];

export function InterviewSession({ level, onExit }: InterviewSessionProps) {
  const [code, setCode] = useState(`function twoSum(nums, target) {\n  // Ваше решение здесь\n  \n}`);
  const [testsPassed, setTestsPassed] = useState<boolean | null>(null);
  const initialGreeting = `Привет! Я Jam, твой AI-интервьюер. Перед тем как перейти к коду уровня ${level}, расскажи, как ты обычно подходишь к задачам на массивы?`;
  const initialTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: 'ai',
      text: initialGreeting,
      time: initialTime,
    },
  ]);
  const [history, setHistory] = useState<OpenRouterMessage[]>([
    { role: 'system', content: buildInterviewSystemPrompt(level) },
    { role: 'assistant', content: initialGreeting },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60 * 60);
  const [taskUnlocked, setTaskUnlocked] = useState(false);
  const [autoSuggestion, setAutoSuggestion] = useState('');
  const [autoStatus, setAutoStatus] = useState<'idle' | 'pending' | 'ready' | 'error'>('idle');
  const [autoError, setAutoError] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setVideoError('Нет доступа к камере в этом окружении');
      return;
    }
    let mediaStream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        mediaStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setVideoReady(true);
      })
      .catch((err) => {
        console.warn('Camera permission denied', err);
        setVideoError('Не удалось получить доступ к веб-камере');
      });
    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!taskUnlocked || !code.trim()) {
      setAutoSuggestion('');
      setAutoStatus('idle');
      setAutoError(null);
      return;
    }
    setAutoStatus('idle');
    setAutoError(null);
    const timeout = setTimeout(async () => {
      try {
        setAutoStatus('pending');
        const completion = await requestAutocompleteSnippet(code, 'JavaScript');
        if (!completion?.trim()) {
          setAutoSuggestion('');
          setAutoStatus('idle');
          return;
        }
        setAutoSuggestion(completion.trim());
        setAutoStatus('ready');
      } catch (err) {
        setAutoError((err as Error).message);
        setAutoStatus('error');
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [code, taskUnlocked]);

  const timerLabel = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (secondsLeft % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const handleRunCode = () => {
    setTestsPassed(false);
    setTimeout(() => {
      setTestsPassed(true);
      setMessages((prev) => [
        ...prev,
        {
          from: 'ai',
          text: 'Почти правильно! Проверь, пожалуйста, кейс с дублирующимися значениями — там выскакивает ошибка.',
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isSending) return;
    const trimmed = input.trim();
    const timestamp = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = { from: 'user', text: trimmed, time: timestamp };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    const nextHistory = [...history, { role: 'user', content: trimmed }];
    setHistory(nextHistory);

    try {
      const aiReply = await sendInterviewTurn({ level, history: nextHistory });
      const aiMessage: ChatMessage = {
        from: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setHistory((prev) => [...prev, { role: 'assistant', content: aiReply }]);
      if (!taskUnlocked) {
        setTaskUnlocked(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка AI-интервьюера';
      setMessages((prev) => [
        ...prev,
        {
          from: 'ai',
          text: `Сбой при общении с интервьюером: ${errorMessage}`,
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (!autoSuggestion) return;
    setCode((prev) => `${prev}\n${autoSuggestion}`);
    setAutoSuggestion('');
    setAutoStatus('idle');
  };

  const handleDismissSuggestion = () => {
    setAutoSuggestion('');
    setAutoStatus('idle');
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-900 text-sm">Интервью в процессе</span>
          </div>
          <span className="text-gray-400 text-sm">•</span>
          <span className="text-gray-600 text-sm">Уровень: {level}</span>
          <span className="text-gray-400 text-sm">•</span>
          <span className="flex items-center gap-1 text-gray-600 text-sm">
            <Clock className="w-4 h-4" />
            {timerLabel}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onExit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Завершить интервью
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
          {taskUnlocked ? (
            <div className="bg-blue-50 border-b border-blue-100 p-4 overflow-y-auto" style={{ maxHeight: '30%' }}>
              <h3 className="text-gray-900 text-lg mb-3">Задача: Two Sum</h3>
              <p className="text-gray-700 text-sm mb-4">
                Дан массив целых чисел <code className="bg-white px-2 py-1 rounded border border-blue-200">nums</code> и число
                <code className="bg-white px-2 py-1 rounded border border-blue-200"> target</code>. Найдите два числа, которые в сумме дают target.
              </p>
              <div className="text-sm text-gray-600">
                <div className="mb-2"><strong className="text-gray-900">Пример</strong></div>
                <div className="bg-white p-3 rounded border border-blue-200 font-mono text-xs mb-3">
                  <div className="text-gray-500">Input: nums = [2,7,11,15], target = 9</div>
                  <div className="text-green-600">Output: [0,1]</div>
                </div>
                <div className="text-gray-600">Ограничение: алгоритм O(n) по времени</div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100 p-6 flex flex-col gap-3">
              <h3 className="text-gray-900 text-lg">Обсудите задачу с AI</h3>
              <p className="text-sm text-gray-600">
                Перед тем как увидеть условие, расскажите интервьюеру о своём подходе. Jam задаст дополнительные вопросы и только после этого откроет задачу.
              </p>
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Поделитесь мыслями — это помогает системе подобрать подходящий уровень.
              </p>
            </div>
          )}

          <div className="flex-1 flex flex-col bg-white">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-gray-700 text-sm">solution.js</span>
              <button className="text-gray-600 hover:text-gray-900 text-sm">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <CodeEditor
              value={code}
              onChange={(value) => setCode(value)}
              className="flex-1 bg-white text-gray-900 font-mono text-sm p-4 resize-none focus:outline-none border-b border-gray-200"
              style={{ tabSize: 2, fontFamily: "'Fira Code', 'Consolas', monospace" }}
            />

            <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center gap-3">
              <button
                onClick={handleRunCode}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Запустить код
              </button>
              {autoStatus === 'pending' && <span className="text-xs text-gray-500">AI подбирает автодополнение…</span>}
              {autoStatus === 'error' && autoError && (
                <span className="text-xs text-red-600">Автодополнение недоступно: {autoError}</span>
              )}
            </div>

            {autoSuggestion && (
              <div className="border-t border-gray-200 bg-white p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Предложение AI</p>
                  <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-auto max-h-40 whitespace-pre-wrap">
{autoSuggestion}
                  </pre>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleAcceptSuggestion}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Вставить
                  </button>
                  <button
                    onClick={handleDismissSuggestion}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Скрыть
                  </button>
                </div>
              </div>
            )}
          </div>

          {testsPassed !== null && (
            <div className="bg-gray-50 border-t border-gray-200 p-4" style={{ maxHeight: '30%', overflowY: 'auto' }}>
              <h4 className="text-gray-900 text-sm mb-3">Результаты тестов</h4>
              <div className="space-y-2">
                {initialTests.map((test, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      test.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900">Тест {index + 1}</span>
                      {test.passed ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="text-xs text-gray-600 font-mono">{test.input}</div>
                    <div className="text-xs text-gray-500 mt-1">Expected: {test.expected}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-96 bg-white flex flex-col border-r border-gray-200">
          <div className="relative h-48 bg-gray-900 flex-shrink-0 border-b border-gray-200">
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity ${videoReady ? 'opacity-100' : 'opacity-0'}`}
              autoPlay
              playsInline
              muted
            />
            {!videoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">АУ</span>
                </div>
              </div>
            )}
            <div className="absolute bottom-3 left-3 text-white text-sm bg-black/60 px-2 py-1 rounded">
              {videoError ?? 'Камера активна'}
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-600 px-2 py-1 rounded text-white text-xs">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              REC
            </div>
          </div>

          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-gray-900 text-sm">AI-Интервьюер</div>
                <div className="text-gray-500 text-xs">Онлайн</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={`${message.time}-${index}`} className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.from === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <span
                    className={`text-xs mt-1 block ${message.from === 'user' ? 'opacity-70' : 'text-gray-500'}`}
                  >
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="text-xs text-gray-500 text-center">AI формулирует ответ…</div>
            )}
          </div>

          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Mic className="w-4 h-4" />
              </button>
              <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Video className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ответьте AI-интервьюеру..."
                className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                disabled={isSending}
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isSending}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
