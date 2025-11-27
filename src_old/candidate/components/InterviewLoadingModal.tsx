import React, { useEffect, useState } from 'react';
import { Users, Info } from 'lucide-react';

interface InterviewLoadingModalProps {
  onComplete: () => void;
}

export function InterviewLoadingModal({ onComplete }: InterviewLoadingModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="max-w-2xl w-full px-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Users className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl text-gray-900 mb-3">Наливаем цифровой кофе...</h2>
          <p className="text-lg text-gray-600 mb-8">Ваше собеседование скоро начнется.</p>

          <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6 mb-8">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <p className="text-base text-blue-900 text-left">
                Для этого интервью вам необходимо постоянно находиться в кадре.
              </p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-3">Приготовьтесь...</p>
        </div>
      </div>
    </div>
  );
}
