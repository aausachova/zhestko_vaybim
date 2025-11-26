import React from 'react';
import { Mail, Phone, Calendar, GraduationCap, MapPin, Globe, Code, Github, Linkedin } from 'lucide-react';

export function ProfilePage() {
  const skills = [
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'TypeScript', level: 80 },
    { name: 'Node.js', level: 70 },
    { name: 'CSS/SCSS', level: 85 },
    { name: 'Git', level: 75 },
  ];

  const languages = [
    { name: 'Русский', level: 'Родной' },
    { name: 'Английский', level: 'B2 (Upper-Intermediate)' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Профиль</h1>
        <p className="text-sm text-gray-500">Ваша личная информация и навыки</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="col-span-2 space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-3xl">АУ</span>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl text-gray-900 mb-2">Александра Усачева</h2>
                <p className="text-base text-gray-600 mb-4">Frontend Developer</p>
                
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Редактировать профиль
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Загрузить резюме
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm text-gray-900">alexandra.usacheva@example.com</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Телефон</div>
                  <div className="text-sm text-gray-900">+7 (999) 123-45-67</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Возраст</div>
                  <div className="text-sm text-gray-900">28 лет</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Город</div>
                  <div className="text-sm text-gray-900">Москва, Россия</div>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-gray-600" />
              Образование
            </h3>
            
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="text-base text-gray-900 mb-1">МГУ им. М.В. Ломоносова</div>
                <div className="text-sm text-gray-600 mb-1">Факультет ВМК, Прикладная математика</div>
                <div className="text-xs text-gray-500">2014 - 2019 • Специалист</div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-gray-600" />
              Технические навыки
            </h3>
            
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-600" />
              Языки
            </h3>
            
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{lang.name}</span>
                  <span className="text-sm text-gray-500">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-base text-gray-900 mb-4">Внешние профили</h3>
            
            <div className="space-y-3">
              <a 
                href="#" 
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <Github className="w-5 h-5 text-gray-700" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900">GitHub</div>
                  <div className="text-xs text-gray-500 truncate">github.com/alexey-ivanov</div>
                </div>
              </a>

              <a 
                href="#" 
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <Linkedin className="w-5 h-5 text-gray-700" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900">LinkedIn</div>
                  <div className="text-xs text-gray-500 truncate">linkedin.com/in/alexey-ivanov</div>
                </div>
              </a>
            </div>

            <button className="w-full mt-4 px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors text-sm">
              + Добавить профиль
            </button>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-base text-gray-900 mb-4">Статистика</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Всего собеседований</div>
                <div className="text-2xl text-gray-900">12</div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Средний балл</div>
                <div className="text-2xl text-gray-900">7.8/10</div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Решено задач</div>
                <div className="text-2xl text-gray-900">45</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}