import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Briefcase,
  Zap,
  Copy,
  CheckCircle,
  ArrowRight,
  Settings,
  Code,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface NewInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'form' | 'template' | 'success';

export function NewInterviewModal({ open, onOpenChange }: NewInterviewModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    position: '',
    level: '',
    date: undefined as Date | undefined,
    time: '',
    notes: '',
  });
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const templates = [
    {
      id: 'frontend',
      name: 'Frontend Engineer',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      stages: ['Представление', 'React/TypeScript', 'Алгоритмы', 'Системный дизайн', 'Q&A'],
      duration: '60 мин',
    },
    {
      id: 'backend',
      name: 'Backend Engineer',
      icon: Settings,
      color: 'from-purple-500 to-pink-500',
      stages: ['Представление', 'API Design', 'База данных', 'Архитектура', 'Q&A'],
      duration: '60 мин',
    },
    {
      id: 'fullstack',
      name: 'Full Stack Engineer',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-500',
      stages: ['Представление', 'Frontend', 'Backend', 'DevOps', 'Q&A'],
      duration: '75 мин',
    },
  ];

  const handleSubmit = () => {
    setStep('template');
  };

  const handleTemplateSelect = () => {
    // Generate mock link
    const mockLink = `https://aijam.io/interview/${Math.random().toString(36).substring(7)}`;
    setGeneratedLink(mockLink);
    setStep('success');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep('form');
    setFormData({
      candidateName: '',
      candidateEmail: '',
      position: '',
      level: '',
      date: undefined,
      time: '',
      notes: '',
    });
    setSelectedTemplate('');
    setGeneratedLink('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-white border-slate-200">
        {step === 'form' && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl text-slate-900">Новое интервью</DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Создайте персонализированную сессию для кандидата
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Candidate Info Section */}
              <div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                  <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Данные кандидата
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700">
                        Имя кандидата *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Иван Иванов"
                        value={formData.candidateName}
                        onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                        className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ivan@example.com"
                        value={formData.candidateEmail}
                        onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                        className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-slate-700">
                        Позиция *
                      </Label>
                      <Input
                        id="position"
                        placeholder="Senior Frontend Engineer"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-slate-700">
                        Уровень *
                      </Label>
                      <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                        <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                          <SelectValue placeholder="Выберите уровень" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="lead">Lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                  <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-purple-600" />
                    Расписание
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700">Дата интервью *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left bg-white border-slate-200 hover:bg-slate-50"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? format(formData.date, 'PPP', { locale: ru }) : 'Выберите дату'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(date) => setFormData({ ...formData, date })}
                            initialFocus
                            locale={ru}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-slate-700">
                        Время *
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="bg-white border-slate-200 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                  <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                    Дополнительно
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-slate-700">
                      Заметки для AI-интервьюера
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Особые требования, акценты в интервью, дополнительные вопросы..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="min-h-[100px] bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-6 bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
              >
                Отмена
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.candidateName || !formData.candidateEmail || !formData.position || !formData.level}
                className="px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white"
              >
                Продолжить
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        {step === 'template' && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl text-slate-900">Выбор шаблона</DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Выберите подходящий шаблон для {formData.position}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {templates.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedTemplate === template.id;
                
                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className="cursor-pointer transition-all"
                  >
                    <div className={`rounded-2xl bg-white border-2 ${
                      isSelected ? 'border-blue-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
                    } p-6 transition-all`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-slate-900">{template.name}</h3>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                              {template.duration}
                            </Badge>
                            {isSelected && (
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Выбрано
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {template.stages.map((stage, index) => (
                              <div key={index} className="flex items-center gap-1.5 text-xs text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {stage}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setStep('form')}
                className="px-6 bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
              >
                Назад
              </Button>
              <Button
                onClick={handleTemplateSelect}
                disabled={!selectedTemplate}
                className="px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
              >
                Создать интервью
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <div className="flex flex-col items-center text-center gap-4 mb-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl text-slate-900 mb-2">Интервью создано!</DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Отправьте ссылку кандидату {formData.candidateName}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Interview Details */}
              <div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                  <h3 className="text-slate-900 mb-4">Детали интервью</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Кандидат:</span>
                      <span className="text-slate-900">{formData.candidateName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Email:</span>
                      <span className="text-slate-900">{formData.candidateEmail}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Позиция:</span>
                      <span className="text-slate-900">{formData.position}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Дата:</span>
                      <span className="text-slate-900">
                        {formData.date && format(formData.date, 'dd MMMM yyyy', { locale: ru })} в {formData.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Link */}
              <div>
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6">
                  <Label className="text-slate-900 mb-3 block">Ссылка для кандидата</Label>
                  
                  <div className="flex gap-2">
                    <Input
                      value={generatedLink}
                      readOnly
                      className="bg-white border-emerald-200 text-slate-700 font-mono text-sm"
                    />
                    <Button
                      onClick={handleCopyLink}
                      className={`px-6 transition-all ${
                        copied
                          ? 'bg-emerald-600 hover:bg-emerald-600'
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      } text-white`}
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Скопировано
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Копировать
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-slate-600 mt-3">
                    Ссылка автоматически отправлена на {formData.candidateEmail}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Отправить напоминание
                </Button>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Добавить в календарь
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-6 bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
              >
                Создать ещё
              </Button>
              <Button
                onClick={handleClose}
                className="px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white"
              >
                Готово
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
