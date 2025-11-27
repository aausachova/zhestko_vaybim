import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, Volume2, VolumeX, MessageCircle } from 'lucide-react';

interface AICallInterfaceProps {
  onEnd: () => void;
}

export function AICallInterface({ onEnd }: AICallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Здравствуйте! Я AI-рекрутер. Расскажите, пожалуйста, о вашем опыте работы.', time: '14:30' },
  ]);

  return (
    <div className="fixed inset-0 bg-[#F5F7FA] z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-900">Созвон с AI-рекрутером</span>
          <span className="text-gray-500 text-sm">• 03:24</span>
        </div>
        
        <button 
          onClick={onEnd}
          className="px-4 py-2 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          Завершить звонок
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Video Panel */}
        <div className="flex-1 bg-white relative">
          {/* AI Video Feed */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* AI Avatar */}
              <div className="w-64 h-64 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                <div className="w-56 h-56 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-8xl">🤖</span>
                </div>
              </div>
              
              {/* Speaking Animation */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-12 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-10 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>

          {/* User Video (Picture-in-Picture) */}
          <div className="absolute bottom-6 right-6 w-64 h-48 bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
            {isVideoOn ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl">АУ</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <VideoOff className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-3 left-3 text-gray-900 text-sm bg-white/80 backdrop-blur-sm px-2 py-1 rounded">Вы</div>
          </div>

          {/* Current AI Message */}
          <div className="absolute bottom-6 left-6 right-80 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-900 text-sm">
                Расскажите, пожалуйста, о вашем последнем проекте. Какие технологии вы использовали?
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-gray-700" />
              )}
            </button>

            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                !isVideoOn ? 'bg-red-600 hover:bg-red-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {isVideoOn ? (
                <Video className="w-6 h-6 text-gray-700" />
              ) : (
                <VideoOff className="w-6 h-6 text-white" />
              )}
            </button>

            <button 
              onClick={() => setIsSoundOn(!isSoundOn)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                !isSoundOn ? 'bg-red-600 hover:bg-red-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {isSoundOn ? (
                <Volume2 className="w-6 h-6 text-gray-700" />
              ) : (
                <VolumeX className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-96 bg-white flex flex-col border-l border-gray-200">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-gray-900">Транскрипция разговора</h3>
            <p className="text-gray-500 text-xs mt-1">Автоматическая расшифровка</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex flex-col ${
                message.from === 'user' ? 'items-end' : 'items-start'
              }`}>
                <div className={`max-w-[85%] rounded-lg p-3 ${
                  message.from === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1">{message.time}</span>
              </div>
            ))}

            {/* Live transcription indicator */}
            <div className="flex items-start gap-2 opacity-60">
              <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Слушаю...</span>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600 space-y-2">
              <div className="flex items-center justify-between">
                <span>Собрано информации:</span>
                <span className="text-blue-600">45%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all" style={{ width: '45%' }}></div>
              </div>
              <p className="text-gray-500 mt-3">
                AI анализирует ваши ответы и автоматически заполняет профиль
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}