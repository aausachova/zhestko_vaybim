import React, { useState } from 'react';
import { FileText, Link2, Upload, Phone, CheckCircle, Github, Linkedin, Globe } from 'lucide-react';
import { AICallInterface } from './AICallInterface';

export function AssistantPage() {
  const [step, setStep] = useState(1);
  const [callStarted, setCallStarted] = useState(false);

  if (callStarted) {
    return <AICallInterface onEnd={() => setCallStarted(false)} />;
  }

  return (
    <div className="max-w-[900px] mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Помощник AI-рекрутера</h1>
        <p className="text-sm text-gray-500">
          Соберите информацию о себе для персонализированного собеседования
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${
                s === step 
                  ? 'bg-blue-600 text-white'
                  : s < step
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {s < step ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 4 && (
                <div className={`flex-1 h-1 mx-2 transition-all ${
                  s < step ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span className="flex-1 text-center">Анкета</span>
          <span className="flex-1 text-center">Профили</span>
          <span className="flex-1 text-center">Резюме</span>
          <span className="flex-1 text-center">Созвон</span>
        </div>
      </div>

      {/* Step 1: Questionnaire */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl text-gray-900 mb-2">Входное анкетирование</h2>
            <p className="text-sm text-gray-500">
              Расскажите о себе, чтобы AI мог лучше оценить ваши навыки
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Желаемая позиция
              </label>
              <input
                type="text"
                placeholder="Например: Frontend Developer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Опыт работы (лет)
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Выберите опыт</option>
                <option>Без опыта</option>
                <option>1-2 года</option>
                <option>3-5 лет</option>
                <option>5+ лет</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Основные технологии
              </label>
              <input
                type="text"
                placeholder="React, TypeScript, Node.js..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                О себе
              </label>
              <textarea
                rows={4}
                placeholder="Расскажите о своих сильных сторонах и проектах..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Продолжить
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Social Links */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl text-gray-900 mb-2">Парсинг профилей</h2>
            <p className="text-sm text-gray-500">
              Добавьте ссылки на ваши профили для автоматического анализа
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </label>
              <input
                type="url"
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                HeadHunter
              </label>
              <input
                type="url"
                placeholder="https://hh.ru/resume/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Портфолио
              </label>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-800">
              AI проанализирует ваши репозитории, проекты и активность для более точной оценки навыков
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={() => setStep(1)}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Назад
            </button>
            <button 
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Продолжить
            </button>
          </div>
        </div>
      )}

      {/* Step 3: CV Upload */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl text-gray-900 mb-2">Загрузка резюме</h2>
            <p className="text-sm text-gray-500">
              Загрузите ваше резюме для детального анализа
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-base text-gray-900 mb-2">
              Перетащите файл или нажмите для выбора
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Поддер��иваются форматы: PDF, DOC, DOCX (макс. 5 МБ)
            </p>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Выбрать файл
            </button>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-amber-800">
              Ваше резюме будет проанализировано AI для извлечения информации об опыте, проектах и навыках
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={() => setStep(2)}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Назад
            </button>
            <button 
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Продолжить
            </button>
          </div>
        </div>
      )}

      {/* Step 4: AI Call */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="mb-6 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-xl text-gray-900 mb-2">Созвон с AI-рекрутером</h2>
            <p className="text-sm text-gray-500">
              Проведите короткую беседу с AI для уточнения деталей
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-blue-900 mb-1">Длительность: 10-15 минут</div>
                  <p className="text-sm text-blue-700">
                    AI задаст уточняющие вопросы о вашем опыте и целях
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-blue-900 mb-1">Голосовое взаимодействие</div>
                  <p className="text-sm text-blue-700">
                    Естественная беседа с AI для комфортного сбора информации
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-blue-900 mb-1">Автоматическая обработка</div>
                  <p className="text-sm text-blue-700">
                    Все данные сохранятся и будут использованы для персонализации
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setCallStarted(true)}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base mb-3"
          >
            Начать созвон с AI
          </button>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-200">
            <button 
              onClick={() => setStep(3)}
              className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Назад
            </button>
            <button className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Пропустить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}