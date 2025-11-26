import React, { useState } from 'react';
import { X, CheckCircle, Wifi, Volume2, Code, Shield, Users, FileText, ArrowRight } from 'lucide-react';

interface InterviewPreStartModalProps {
  level: string;
  onStart: () => void;
  onCancel: () => void;
}

export function InterviewPreStartModal({ level, onStart, onCancel }: InterviewPreStartModalProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-900 mb-1">Подготовка к интервью</h2>
            <p className="text-sm text-gray-500">Уровень: {level}</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Important Info */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base text-blue-900 mb-1">Каждое интервью рассматривается человеком</h3>
                <p className="text-sm text-blue-700">
                  AI помогает провести техническую часть, но финальное решение принимает реальный рекрутер
                </p>
              </div>
            </div>
          </div>

          {/* Preparation Checklist */}
          <div>
            <h3 className="text-lg text-gray-900 mb-4">Подготовка к интервью</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Wifi className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-900 mb-1">Стабильный интернет</div>
                  <p className="text-xs text-gray-600">Убедитесь, что ваше подключение стабильно</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Volume2 className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-900 mb-1">Тихое место</div>
                  <p className="text-xs text-gray-600">Найдите спокойное место для концентрации</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Code className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-900 mb-1">Браузерная IDE</div>
                  <p className="text-xs text-gray-600">Вы будете писать код прямо в браузере</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-900 mb-1">Система честности</div>
                  <p className="text-xs text-gray-600">Мы используем контроль честности</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Process */}
          <div>
            <h3 className="text-lg text-gray-900 mb-4">Что будет во время интервью?</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                Вы получите 3 задачи возрастающей сложности
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                AI будет задавать уточняющие вопросы и давать подсказки
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                После завершения вы получите детальный отчёт с рекомендациями
              </li>
            </ul>
          </div>

          {/* How it Works */}
          <div>
            <h3 className="text-lg text-gray-900 mb-4">Как проходит интервью</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-blue-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm">
                  1
                </div>
                <div className="text-sm text-blue-900 mb-1">Подготовка</div>
                <p className="text-xs text-blue-700">Выбор языка и чтение условий</p>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

              <div className="flex-1 bg-purple-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm">
                  2
                </div>
                <div className="text-sm text-purple-900 mb-1">Решение задач</div>
                <p className="text-xs text-purple-700">Код + диалог с AI</p>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

              <div className="flex-1 bg-green-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm">
                  3
                </div>
                <div className="text-sm text-green-900 mb-1">Обратная связь</div>
                <p className="text-xs text-green-700">Детальный отчёт</p>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className="text-sm text-amber-900">
                  Я подтверждаю, что готов к собеседованию и буду проходить его честно, без использования 
                  сторонних подсказок. Я понимаю, что система контроля честности будет отслеживать 
                  подозрительную активность.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onStart}
            disabled={!agreed}
            className={`w-full px-6 py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 ${
              agreed
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Начать интервью
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            Нажимая кнопку, вы соглашаетесь с условиями использования
          </p>
        </div>
      </div>
    </div>
  );
}
