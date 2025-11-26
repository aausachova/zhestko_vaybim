import React, { useState } from 'react';
import { Send, Volume2, Settings, Play, MessageCircle, Mic, Video, X, Check, Maximize2 } from 'lucide-react';
import { CodeEditor } from './CodeEditor';

interface InterviewSessionProps {
  level: string;
  onExit: () => void;
}

export function InterviewSession({ level, onExit }: InterviewSessionProps) {
  const [code, setCode] = useState(`function twoSum(nums, target) {\n  // Ваше решение здесь\n  \n}`);
  const [testsPassed, setTestsPassed] = useState<boolean | null>(null);
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: `Привет! Я ваш AI-интервьюер. Начнем с задачи уровня ${level}. Готовы?`,
      time: '14:30',
    },
  ]);
  const [input, setInput] = useState('');

  const tests = [
    { input: '[2, 7, 11, 15], target = 9', expected: '[0, 1]', passed: true },
    { input: '[3, 2, 4], target = 6', expected: '[1, 2]', passed: true },
    { input: '[3, 3], target = 6', expected: '[0, 1]', passed: false },
  ];

  const handleRunCode = () => {
    setTestsPassed(false);
    setTimeout(() => {
      const newMessage = {
        from: 'ai',
        text: 'Почти правильно! Вы успешно решили основные кейсы, но есть проблема с граничным случаем [3, 3]. Можете объяснить вашу логику?',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      from: 'user',
      text: input,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    
    setTimeout(() => {
      const aiResponse = {
        from: 'ai',
        text: 'Отличное объяснение! Давайте перейдем к следующей задаче. Я увеличу сложность до Middle уровня.',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, userMessage, aiResponse]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-900 text-sm">Интервью в процессе</span>
          </div>
          <span className="text-gray-400 text-sm">•</span>
          <span className="text-gray-600 text-sm">Уровень: {level}</span>
          <span className="text-gray-400 text-sm">•</span>
          <span className="text-gray-600 text-sm">Задача 1 из 3</span>
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
        {/* Left Panel - Code Editor */}
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
          {/* Task Description */}
          <div className="bg-blue-50 border-b border-blue-100 p-4 overflow-y-auto" style={{ maxHeight: '30%' }}>
            <h3 className="text-gray-900 text-lg mb-3">Задача: Two Sum</h3>
            <p className="text-gray-700 text-sm mb-4">
              Дан массив целых чисел <code className="bg-white px-2 py-1 rounded border border-blue-200">nums</code> и целое число <code className="bg-white px-2 py-1 rounded border border-blue-200">target</code>. 
              Найдите два числа в массиве, которые в сумме дают <code className="bg-white px-2 py-1 rounded border border-blue-200">target</code>, и верните их индексы.
            </p>
            <div className="text-sm text-gray-600">
              <div className="mb-2"><strong className="text-gray-900">Пример 1:</strong></div>
              <div className="bg-white p-3 rounded border border-blue-200 font-mono text-xs mb-3">
                <div className="text-gray-500">Input: nums = [2,7,11,15], target = 9</div>
                <div className="text-green-600">Output: [0,1]</div>
              </div>
              <div className="text-gray-600">Ограничения: O(n) time complexity</div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-gray-700 text-sm">solution.js</span>
              <button className="text-gray-600 hover:text-gray-900 text-sm">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            
            <CodeEditor
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-white text-gray-900 font-mono text-sm p-4 resize-none focus:outline-none border-b border-gray-200"
              style={{ 
                tabSize: 2,
                fontFamily: "'Fira Code', 'Consolas', monospace",
              }}
            />
            
            <div className="bg-gray-50 border-t border-gray-200 p-4">
              <button 
                onClick={handleRunCode}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Запустить код
              </button>
            </div>
          </div>

          {/* Test Results */}
          {testsPassed !== null && (
            <div className="bg-gray-50 border-t border-gray-200 p-4" style={{ maxHeight: '30%', overflowY: 'auto' }}>
              <h4 className="text-gray-900 text-sm mb-3">Результаты тестов</h4>
              <div className="space-y-2">
                {tests.map((test, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    test.passed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900">Тест {index + 1}</span>
                      {test.passed ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600 font-mono">{test.input}</div>
                    <div className="text-xs text-gray-500 mt-1">Expected: {test.expected}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - AI Chat + Camera */}
        <div className="w-96 bg-white flex flex-col border-r border-gray-200">
          {/* Camera Feed */}
          <div className="relative h-48 bg-gray-900 flex-shrink-0 border-b border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">АУ</span>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 text-white text-sm bg-black/60 px-2 py-1 rounded">
              Александра Усачева
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-600 px-2 py-1 rounded text-white text-xs">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              REC
            </div>
          </div>

          {/* Chat Header */}
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.from === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.from === 'user' ? 'opacity-70' : 'text-gray-500'
                  }`}>{message.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ответьте AI-интервьюеру..."
                className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
              />
              <button 
                onClick={handleSendMessage}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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