import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Send,
  Volume2,
  Settings,
  MessageCircle,
  Mic,
  Video,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { sendInterviewTurn, requestAutocompleteSnippet, streamInterviewTurn } from '../services/aiInterview';
import { buildInterviewSystemPrompt } from '../prompts/interview';
import type { OpenRouterMessage } from '../services/openRouterClient';
import {
  parseTaskBlocks,
  ParsedTaskSpec,
  ParsedExampleCase,
  ParsedTestCase,
} from '../services/taskParser';
import {
  startCodeRunner,
  stopCodeRunner,
  runUserCode,
  runUserTests,
  TestRunResult,
  TestCasePayload,
} from '../services/codeRunner';
import { CodeWorkbench } from './CodeWorkbench';

interface InterviewSessionProps {
  level: string;
  language?: string;
  token: string;
  onExit: () => void;
}

interface ChatMessage {
  from: 'ai' | 'user';
  text: string;
  time: string;
}

type TaskTab = 'condition' | 'examples' | 'tests';
type TestStatus = 'idle' | 'running' | 'passed' | 'failed';

const DEFAULT_ACK = 'Хорошо, тогда я сейчас сгенерирую тебе первую задачу.';
const PANEL_GUIDANCE =
  'Посмотри на панель слева — там появится задача. Внимательно прочитай условия, проговори свой подход и только потом переходи к коду. Если понадобится подсказка — просто скажи, и я подключусь.';
const MIN_TASK_PANE_HEIGHT = 220;
const MIN_IDE_PANE_HEIGHT = 220;

function composeTaskContext(spec: ParsedTaskSpec): string {
  if (!spec) return '';
  const sections: string[] = [];
  if (spec.condition?.trim()) {
    sections.push(`Условие:\n${spec.condition.trim()}`);
  }
  if (spec.examples?.length) {
    const formatted = spec.examples
      .map((example, index) => {
        const lines = [
          `Пример ${index + 1}:`,
          example.input ? `Ввод:\n${example.input}` : undefined,
          example.output ? `Вывод:\n${example.output}` : undefined,
          example.explanation ? `Пояснение:\n${example.explanation}` : undefined,
        ].filter(Boolean);
        return lines.join('\n');
      })
      .join('\n\n');
    sections.push(`Примеры:\n${formatted}`);
  } else if (spec.example?.trim()) {
    sections.push(`Пример:\n${spec.example.trim()}`);
  }
  if (spec.testCases?.length) {
    const formatted = spec.testCases
      .map((test, index) => {
        const lines = [
          `Тест ${index + 1}:`,
          test.input ? `Ввод:\n${test.input}` : undefined,
          test.output ? `Ожидаемый вывод:\n${test.output}` : undefined,
        ].filter(Boolean);
        return lines.join('\n');
      })
      .join('\n\n');
    sections.push(`Тесты:\n${formatted}`);
  } else if (spec.tests?.length) {
    sections.push(`Тесты:\n${spec.tests.join('\n')}`);
  }
  return sections.join('\n\n').trim();
}

export function InterviewSession({ level, language = 'JavaScript', token, onExit }: InterviewSessionProps) {
  const initialGreeting = [
    `Привет! Мы начинаем секцию по языку ${language}.`,
    'Интервью длится 1 час: я буду задавать вопросы в чате, а ты объясняешь ход мыслей и пишешь код в редакторе слева.',
    'Тебе всё понятно? Можем приступать?',
  ].join(' ');
  const initialTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const [code, setCode] = useState('');
  const [taskSpec, setTaskSpec] = useState<ParsedTaskSpec>({});
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: 'ai',
      text: initialGreeting,
      time: initialTime,
    },
  ]);
  const [history, setHistory] = useState<OpenRouterMessage[]>([
    { role: 'system', content: buildInterviewSystemPrompt(level, language) },
    { role: 'assistant', content: initialGreeting },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60 * 60);
  const [taskUnlocked, setTaskUnlocked] = useState(false);
  const [autoSuggestion, setAutoSuggestion] = useState('');
  const [autoStatus, setAutoStatus] = useState<'idle' | 'pending' | 'ready' | 'error'>('idle');
  const [autoError, setAutoError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [isTaskGenerating, setIsTaskGenerating] = useState(false);
  const [activeTaskTab, setActiveTaskTab] = useState<TaskTab>('condition');
  const [testStatuses, setTestStatuses] = useState<Record<string, TestStatus>>({});
  const [taskPaneHeight, setTaskPaneHeight] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [guidanceInjected, setGuidanceInjected] = useState(false);
  const [codeRunStatus, setCodeRunStatus] = useState<'idle' | 'running'>('idle');
  const [runnerReady, setRunnerReady] = useState(false);
  const [runnerError, setRunnerError] = useState<string | null>(null);
  const [runtimeOutput, setRuntimeOutput] = useState<{
    type: 'code' | 'tests';
    status: string;
    stdout: string;
    stderr: string;
    tests?: TestRunResult[];
  } | null>(null);
  const [testsRunStatus, setTestsRunStatus] = useState<'idle' | 'running'>('idle');
  const [caretAtEnd, setCaretAtEnd] = useState(true);
  const [activeWarning, setActiveWarning] = useState<{ id: number; message: string } | null>(null);
  const [warningProgress, setWarningProgress] = useState(100);
  const [interviewTerminated, setInterviewTerminated] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [runnerLogs, setRunnerLogs] = useState<{ id: number; time: string; message: string }[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const streamStateRef = useRef<{ raw: string; insideTag: boolean }>({ raw: '', insideTag: false });
  const taskContext = useMemo(() => composeTaskContext(taskSpec), [taskSpec]);

  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningProgressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const testsSignatureRef = useRef<string | null>(null);
  const resizeStateRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const runnerLogRef = useRef<HTMLDivElement>(null);

  const appendRunnerLog = useCallback((message: string) => {
    setRunnerLogs((prev) => {
      const entry = {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message,
      };
      const next = [...prev, entry];
      return next.length > 50 ? next.slice(next.length - 50) : next;
    });
  }, []);

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
    if (!token || !language) return;
    let cancelled = false;
    setRunnerReady(false);
    setRunnerError(null);
    console.log('[IDE] preparing sandbox', { language });
    appendRunnerLog(`Подготовка среды выполнения (${language})`);
    startCodeRunner(language, token)
      .then(() => {
        if (!cancelled) {
          setRunnerReady(true);
          console.log('[IDE] sandbox ready', { language });
          appendRunnerLog(`Среда выполнения готова (${language})`);
        }
      })
      .catch((err: any) => {
        console.error('[IDE] sandbox start failed', err);
        if (!cancelled) {
          setRunnerError(err instanceof Error ? err.message : 'Не удалось запустить среду выполнения');
          appendRunnerLog(`Ошибка запуска среды: ${err instanceof Error ? err.message : String(err)}`);
        }
      });
    return () => {
      cancelled = true;
      stopCodeRunner(token)
        .then(() => appendRunnerLog('Среда выполнения остановлена'))
        .catch((err: any) => {
          console.warn('[IDE] sandbox stop failed', err);
          appendRunnerLog(`Ошибка остановки среды: ${err instanceof Error ? err.message : String(err)}`);
        });
    };
  }, [appendRunnerLog, language, token]);

  useEffect(() => {
    if (!runnerLogRef.current) return;
    runnerLogRef.current.scrollTop = runnerLogRef.current.scrollHeight;
  }, [runnerLogs]);

  useEffect(() => {
    const container = leftPaneRef.current;
    if (!container) return;
    if (taskPaneHeight === null) {
      const maxHeight = Math.max(MIN_TASK_PANE_HEIGHT, container.clientHeight - MIN_IDE_PANE_HEIGHT);
      const initial = clampValue(container.clientHeight * 0.5, MIN_TASK_PANE_HEIGHT, maxHeight);
      setTaskPaneHeight(initial);
    }
  }, [taskPaneHeight]);

  useEffect(() => {
    const handleResize = () => {
      const container = leftPaneRef.current;
      if (!container) return;
      const maxHeight = Math.max(MIN_TASK_PANE_HEIGHT, container.clientHeight - MIN_IDE_PANE_HEIGHT);
      setTaskPaneHeight((prev) => {
        if (prev === null) {
          return clampValue(container.clientHeight * 0.5, MIN_TASK_PANE_HEIGHT, maxHeight);
        }
        return clampValue(prev, MIN_TASK_PANE_HEIGHT, maxHeight);
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const triggerWarning = useCallback((message: string) => {
    setWarnings((prev) => [...prev, `${new Date().toLocaleTimeString('ru-RU')} — ${message}`]);
    setActiveWarning({ id: Date.now(), message });
    setWarningProgress(100);
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (warningProgressTimeoutRef.current) {
      clearTimeout(warningProgressTimeoutRef.current);
    }
    warningProgressTimeoutRef.current = setTimeout(() => setWarningProgress(0), 30);
    warningTimeoutRef.current = setTimeout(() => setActiveWarning(null), 5000);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        triggerWarning('Обнаружено переключение на другую вкладку/окно');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [triggerWarning]);

  useEffect(() => {
    if (interviewTerminated || warnings.length < 3) {
      return;
    }
    setInterviewTerminated(true);
    setTimeout(() => {
      alert('Интервью завершено: зафиксировано слишком много предупреждений античита.');
      onExit();
    }, 150);
  }, [warnings, interviewTerminated, onExit]);

  useEffect(() => {
    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (warningProgressTimeoutRef.current) {
        clearTimeout(warningProgressTimeoutRef.current);
      }
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
        const completion = await requestAutocompleteSnippet(code, language, { context: taskContext });
        const sanitized = sanitizeCompletion(completion);
        if (!sanitized) {
          setAutoSuggestion('');
          setAutoStatus('idle');
          return;
        }
        setAutoSuggestion(sanitized);
        setAutoStatus('ready');
      } catch (err) {
        setAutoError((err as Error).message);
        setAutoStatus('error');
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [code, taskUnlocked, language, taskContext]);

  const mergeTaskSpec = useCallback((partial: ParsedTaskSpec) => {
    if (!partial || Object.keys(partial).length === 0) return;
    setTaskSpec((prev) => ({
      ...prev,
      ...partial,
      tests: partial.tests ?? prev.tests,
      testCases: partial.testCases ?? prev.testCases,
      example: partial.example ?? prev.example,
      examples: partial.examples ?? prev.examples,
      hint: partial.hint ?? prev.hint,
      canShowHint: partial.canShowHint ?? prev.canShowHint,
      timeLimit: partial.timeLimit ?? prev.timeLimit,
      memoryLimit: partial.memoryLimit ?? prev.memoryLimit,
    }));
  }, []);

  const processStreamDelta = useCallback((delta: string) => {
    const state = streamStateRef.current;
    let plainOut = '';
    for (const char of delta) {
      state.raw += char;
      if (state.insideTag) {
        if (char === '>') {
          state.insideTag = false;
        }
        continue;
      }
      if (char === '<') {
        state.insideTag = true;
        continue;
      }
      plainOut += char;
    }
    return { plainOut, raw: state.raw };
  }, []);

  const initializeTestStatuses = useCallback((count: number, signature?: string | null) => {
    if (!count) {
      setTestStatuses({});
      testsSignatureRef.current = null;
      return;
    }
    setTestStatuses((prev) => {
      const signatureProvided = typeof signature === 'string';
      const signatureChanged = signatureProvided && signature !== testsSignatureRef.current;
      const countChanged = Object.keys(prev).length !== count;
      if (!signatureChanged && !countChanged) {
        return prev;
      }
      const next: Record<string, TestStatus> = {};
      Array.from({ length: count }).forEach((_, index) => {
        next[`test-${index}`] = 'idle';
      });
      if (signatureProvided) {
        testsSignatureRef.current = signature ?? null;
      } else if (countChanged) {
        testsSignatureRef.current = signature ?? testsSignatureRef.current;
      }
      return next;
    });
  }, []);

  const testsRunning = useMemo(() => Object.values(testStatuses).some((status) => status === 'running'), [testStatuses]);

  useEffect(() => {
    if (!chatScrollRef.current) return;
    chatScrollRef.current.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isStreaming, streamBuffer]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const handleResizeStart = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!leftPaneRef.current) return;
      const container = leftPaneRef.current;
      const baseHeight =
        taskPaneHeight ??
        clampValue(container.clientHeight * 0.5, MIN_TASK_PANE_HEIGHT, container.clientHeight - MIN_IDE_PANE_HEIGHT);
      resizeStateRef.current = { startY: event.clientY, startHeight: baseHeight };
      setTaskPaneHeight(baseHeight);
      setIsResizing(true);
    },
    [taskPaneHeight],
  );

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (event: MouseEvent) => {
      if (!resizeStateRef.current || !leftPaneRef.current) return;
      const container = leftPaneRef.current;
      const delta = event.clientY - resizeStateRef.current.startY;
      const maxHeight = Math.max(MIN_TASK_PANE_HEIGHT, container.clientHeight - MIN_IDE_PANE_HEIGHT);
      const next = clampValue(resizeStateRef.current.startHeight + delta, MIN_TASK_PANE_HEIGHT, maxHeight);
      setTaskPaneHeight(next);
    };
    const stopResize = () => {
      setIsResizing(false);
      resizeStateRef.current = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [isResizing]);

  const timerLabel = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (secondsLeft % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const handleSendMessage = async () => {
    if (!input.trim() || isSending) return;
    const trimmed = input.trim();
    const timestamp = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = { from: 'user', text: trimmed, time: timestamp };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);
    const awaitingTask = !taskUnlocked;
    if (awaitingTask) {
      setIsTaskGenerating(true);
      setActiveTaskTab('condition');
    }

    const nextHistory: OpenRouterMessage[] = [...history, { role: 'user', content: trimmed }];
    setHistory(nextHistory);

    try {
      setIsStreaming(true);
      setStreamBuffer('');
      streamStateRef.current = { raw: '', insideTag: false };
      let finalText = '';
      let unlockedDuringRun = taskUnlocked;

      try {
        await streamInterviewTurn({
          level,
          language,
          history: nextHistory,
          onChunk: (delta) => {
            if (!delta) return;
            const { plainOut, raw } = processStreamDelta(delta);
            finalText = raw;
            if (plainOut) {
              setStreamBuffer((prev) => prev + plainOut);
            }
            const partial = parseTaskBlocks(raw);
            if (
              partial.condition ||
              partial.tests?.length ||
              partial.testCases?.length ||
              partial.examples?.length ||
              partial.example
            ) {
              mergeTaskSpec(partial);
              const partialTestCount = partial.testCases?.length ?? partial.tests?.length ?? 0;
              if (partialTestCount) {
                initializeTestStatuses(partialTestCount, buildTestsSignature(partial.testCases, partial.tests));
              }
            }
            if (!unlockedDuringRun && partial.condition) {
              unlockedDuringRun = true;
              setTaskUnlocked(true);
              setIsTaskGenerating(false);
            }
          },
        });
      } catch (streamErr) {
        console.error('[InterviewSession] stream error', streamErr);
      }

      if (!finalText.trim()) {
        try {
          finalText = await sendInterviewTurn({ level, language, history: nextHistory });
        } catch (fallbackErr) {
          console.error('[InterviewSession] fallback chat error', fallbackErr);
          throw fallbackErr;
        }
      }

      console.debug('[InterviewSession] final AI reply', finalText);
      const parsed = parseTaskBlocks(finalText);
      console.debug('[InterviewSession] parsed taskSpec', parsed);
      const ackOnly = finalText.split('<условие>')[0]?.trim();
      let chatDisplay = ackOnly || DEFAULT_ACK;
      const ackHasGuidance =
        /посмотри на панел/i.test(chatDisplay) || /подсказка/i.test(chatDisplay) || /проговори свой подход/i.test(chatDisplay);
      if (!guidanceInjected) {
        if (!ackHasGuidance) {
          chatDisplay = `${chatDisplay} ${PANEL_GUIDANCE}`.trim();
        }
        setGuidanceInjected(true);
      }
      const aiMessage: ChatMessage = {
        from: 'ai',
        text: chatDisplay,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setHistory((prev) => [...prev, { role: 'assistant', content: finalText }]);
      if (
        parsed.condition ||
        (parsed.tests && parsed.tests.length) ||
        parsed.example ||
        parsed.testCases?.length ||
        parsed.examples?.length
      ) {
        mergeTaskSpec(parsed);
        setActiveTaskTab('condition');
        const testCount = parsed.testCases?.length ?? parsed.tests?.length ?? 0;
        initializeTestStatuses(testCount, buildTestsSignature(parsed.testCases, parsed.tests));
      }
      if (!taskUnlocked && parsed.condition) {
        setTaskUnlocked(true);
        setIsTaskGenerating(false);
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
      setIsStreaming(false);
      setStreamBuffer('');
      if (awaitingTask) {
        setIsTaskGenerating(false);
      }
    }
  };

  const handleDismissSuggestion = useCallback(() => {
    setAutoSuggestion('');
    setAutoStatus('idle');
  }, []);

  const handleAcceptSuggestion = useCallback(() => {
    if (!autoSuggestion) return;
    setCode((prev) => `${prev}${autoSuggestion}`);
    setAutoSuggestion('');
    setAutoStatus('idle');
    setCaretAtEnd(true);
  }, [autoSuggestion]);

  const handleCaretChange = useCallback(
    (atEnd: boolean) => {
      setCaretAtEnd(atEnd);
      if (!atEnd && autoSuggestion) {
        handleDismissSuggestion();
      }
    },
    [autoSuggestion, handleDismissSuggestion],
  );

  const handleRunTests = useCallback(async () => {
    if (!taskUnlocked || testsRunStatus === 'running') {
      return;
    }
    const payload = buildTestPayload(taskSpec);
    if (!payload.length) {
      setRuntimeOutput({
        type: 'tests',
        status: 'error',
        stdout: '',
        stderr: 'Нет открытых тестов из условия',
      });
      appendRunnerLog('Запуск тестов отменён: нет открытых тестов');
      return;
    }
    if (!runnerReady) {
      setRuntimeOutput({
        type: 'tests',
        status: 'error',
        stdout: '',
        stderr: 'Среда выполнения ещё готовится — попробуйте чуть позже',
      });
      appendRunnerLog('Запуск тестов отменён: среда не готова');
      return;
    }
    setTestsRunStatus('running');
    setActiveTaskTab('tests');
    console.log('[IDE] run tests start', { language, total: payload.length });
    appendRunnerLog(`Запуск тестов (${payload.length})`);
    setRuntimeOutput({ type: 'tests', status: 'running', stdout: '', stderr: '' });
    setTestStatuses((prev) => {
      const next = { ...prev };
      payload.forEach((_, index) => {
        next[`test-${index}`] = 'running';
      });
      return next;
    });
    try {
      const results = await runUserTests(language ?? 'javascript', code, payload, token);
      console.log('[IDE] run tests result', { total: results.length });
      setRuntimeOutput({ type: 'tests', status: 'completed', stdout: '', stderr: '', tests: results });
      const passed = results.filter((res) => res.passed || res.status === 'success').length;
      const detailed = results
        .map((res) => {
          const statusLabel = `Тест ${res.index + 1}: ${res.status}${res.passed === false ? ' (ошибка)' : ''}`;
          const stdoutLine = summarizeChannel('stdout', res.stdout ?? '');
          const stderrLine = summarizeChannel('stderr', res.stderr ?? '');
          return [statusLabel, stdoutLine, stderrLine].filter(Boolean).join('\n');
        })
        .join('\n—\n');
      appendRunnerLog(`Тесты выполнены: ${passed}/${results.length}\n${detailed}`);
      setTestStatuses((prev) => {
        const next = { ...prev };
        results.forEach((res) => {
          const key = `test-${res.index}`;
          const passedCase = res.passed ?? (res.status === 'success');
          next[key] = passedCase ? 'passed' : 'failed';
        });
        return next;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка при запуске тестов';
      console.error('[IDE] run tests error', err);
      setRuntimeOutput({ type: 'tests', status: 'error', stdout: '', stderr: message });
      appendRunnerLog(`Ошибка при запуске тестов: ${message}`);
      setTestStatuses((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          if (next[key] === 'running') {
            next[key] = 'idle';
          }
        });
        return next;
      });
    } finally {
      setTestsRunStatus('idle');
    }
  }, [appendRunnerLog, taskUnlocked, taskSpec, testsRunStatus, runnerReady, language, code, token]);

  const handleRunCode = async () => {
    if (!taskUnlocked || codeRunStatus === 'running') return;
    if (!runnerReady) {
      setRuntimeOutput({
        type: 'code',
        status: 'error',
        stdout: '',
        stderr: 'Среда выполнения ещё готовится — попробуйте чуть позже',
      });
      appendRunnerLog('Запуск кода невозможен: среда не готова');
      return;
    }
    console.log('[IDE] run code click', { language, length: code.length });
    setCodeRunStatus('running');
    appendRunnerLog(`Запуск кода (${language ?? 'javascript'}, символов: ${code.length})`);
    setRuntimeOutput({ type: 'code', status: 'running', stdout: '', stderr: '' });
    try {
      const result = await runUserCode(language ?? 'javascript', code, token);
      const stdout = result.stdout ?? '';
      const stderr = result.stderr ?? '';
      setRuntimeOutput({
        type: 'code',
        status: result.status,
        stdout,
        stderr,
      });
      appendRunnerLog(
        `Результат запуска: ${result.status}\n${summarizeChannel('stdout', stdout)}\n${summarizeChannel('stderr', stderr)}`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка при запуске кода';
      console.error('[IDE] run code error', err);
      setRuntimeOutput({ type: 'code', status: 'error', stdout: '', stderr: message });
      appendRunnerLog(`Ошибка запуска: ${message}`);
    } finally {
      setCodeRunStatus('idle');
    }
  };

  const taskPanePx = taskPaneHeight ?? 360;
  const testsButtonDisabled = !taskUnlocked || testsRunStatus === 'running' || !runnerReady;

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
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200 min-h-0 overflow-hidden" ref={leftPaneRef}>
          <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex flex-col min-h-0" style={{ height: taskPanePx, flex: '0 0 auto' }}>
            <div className="flex-1 min-h-0 overflow-hidden">
              {taskUnlocked ? (
                <TaskPanel
                  spec={taskSpec}
                  activeTab={activeTaskTab}
                  onTabChange={setActiveTaskTab}
                  onCopyCondition={() => triggerWarning('Скопировано условие задачи')}
                  testStatuses={testStatuses}
                />
              ) : isTaskGenerating ? (
                <TaskLoadingPlaceholder />
              ) : (
                <TaskIntro />
              )}
            </div>
          </div>
          <div className="h-2 relative cursor-row-resize group" onMouseDown={handleResizeStart}>
            <div className="absolute inset-x-8 top-0 bottom-0 bg-gray-200 rounded-full group-hover:bg-gray-400 transition-colors" />
          </div>

          <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col gap-2">
            {runnerError && <p className="text-xs text-red-500 text-right">Среда выполнения: {runnerError}</p>}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleRunCode}
                disabled={!taskUnlocked || codeRunStatus === 'running' || !runnerReady}
                className={`text-sm font-semibold rounded-lg px-5 py-2 transition-colors ${
                  !taskUnlocked || !runnerReady
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : codeRunStatus === 'running'
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {codeRunStatus === 'running' ? 'Запуск…' : 'Запустить текущий код'}
              </button>
              <button
                type="button"
                onClick={handleRunTests}
                disabled={testsButtonDisabled}
                className={`text-sm font-semibold rounded-lg px-5 py-2 transition-colors ${
                  testsButtonDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {testsRunStatus === 'running' ? 'Запуск тестов…' : 'Запустить тесты'}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Логи запуска кода</span>
              <span>{runnerReady ? 'Среда готова' : 'Среда инициализируется…'}</span>
            </div>
            <div
              ref={runnerLogRef}
              className="bg-white border border-gray-200 rounded-lg max-h-40 overflow-auto text-[10px] leading-tight font-mono text-gray-700 p-2 space-y-1"
            >
              {runnerLogs.length === 0 && <p className="text-gray-400">Запуски ещё не выполнялись</p>}
              {runnerLogs.map((log) => (
                <p key={log.id} className="whitespace-pre-wrap">
                  <span className="text-gray-400">{log.time}</span> — {log.message}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col bg-white min-h-0" style={{ flex: '1 1 0%' }}>
            <div className="flex border-y border-gray-200 min-h-[200px] flex-1 min-h-0">
              <div className="flex-1 min-h-0 overflow-hidden">
                <CodeWorkbench
                  value={code}
                  language={(language ?? 'javascript').toLowerCase()}
                  autoSuggestion={autoSuggestion}
                  caretAtEnd={caretAtEnd}
                  onChange={handleCodeChange}
                  onCaretChange={handleCaretChange}
                  onAcceptSuggestion={handleAcceptSuggestion}
                  onDismissSuggestion={handleDismissSuggestion}
                />
              </div>
              <div className="w-64 border-l border-gray-200 bg-gray-50 flex flex-col flex-shrink-0 h-full min-h-0">
                <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Автодополнение</p>
                    <p className="text-[11px] text-gray-500">Режим: условие задачи + текущий код</p>
                  </div>
                  {autoSuggestion && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard
                          ?.writeText(autoSuggestion)
                          .then(() => appendRunnerLog('Подсказка скопирована в буфер обмена'))
                          .catch(() => appendRunnerLog('Не удалось скопировать подсказку'));
                      }}
                      className="text-[10px] px-2 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      Копировать
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-auto p-3 space-y-2 text-xs text-gray-600 min-h-0">
                  {!taskUnlocked && <p>Доступно после генерации задачи.</p>}
                  {taskUnlocked && autoStatus === 'pending' && <p>AI подбирает автодополнение…</p>}
                  {taskUnlocked && autoStatus === 'error' && autoError && (
                    <p className="text-red-500">Ошибка: {autoError}</p>
                  )}
                  {taskUnlocked && autoStatus === 'ready' && autoSuggestion && (
                    <pre className="bg-white border border-gray-200 rounded-lg p-2 whitespace-pre-wrap break-words text-[11px] text-gray-800 max-h-56 max-w-full overflow-auto">
{autoSuggestion}
                    </pre>
                  )}
                  {taskUnlocked && autoStatus === 'ready' && !autoSuggestion && (
                    <p>Сделайте небольшую паузу — появится предложение.</p>
                  )}
                  {taskUnlocked && autoStatus === 'idle' && !autoSuggestion && (
                    <p>Дайте системе секунду — AI подготовит продолжение.</p>
                  )}
                </div>
                <div className="px-3 py-2 border-t border-gray-200 space-y-2">
                  <p className="text-[11px] text-gray-500">
                    {caretAtEnd
                      ? 'Нажмите Tab, чтобы вставить подсказку'
                      : 'Верните курсор в конец строки, чтобы принять подсказку'}
                  </p>
                  {taskUnlocked && autoSuggestion && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleAcceptSuggestion}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
                      >
                        Вставить
                      </button>
                      <button
                        onClick={handleDismissSuggestion}
                        className="px-3 py-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50"
                      >
                        Скрыть
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {runtimeOutput && (
              <div className="border-t border-gray-200 bg-black text-green-200 font-mono text-xs p-3 space-y-2 max-h-48 overflow-auto">
                <div className="flex items-center justify-between text-gray-400 uppercase tracking-wide">
                  <span>
                    {runtimeOutput.type === 'code' ? 'Результат запуска' : 'Результаты тестов'} — {runtimeOutput.status}
                  </span>
                  <button
                    type="button"
                    className="text-[10px] text-gray-500 hover:text-gray-300"
                    onClick={() => setRuntimeOutput(null)}
                  >
                    Очистить
                  </button>
                </div>
                {runtimeOutput.stdout && (
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">stdout</p>
                    <pre className="whitespace-pre-wrap">{runtimeOutput.stdout || '(пусто)'}</pre>
                  </div>
                )}
                {runtimeOutput.stderr && (
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">stderr</p>
                    <pre className="whitespace-pre-wrap text-red-400">{runtimeOutput.stderr}</pre>
                  </div>
                )}
                {runtimeOutput.tests && runtimeOutput.tests.length > 0 && (
                  <div className="space-y-1">
                    {runtimeOutput.tests.map((test) => {
                      const passed = test.passed ?? (test.status === 'success');
                      return (
                        <div key={test.index} className="flex items-center gap-3">
                          <span className="text-gray-400">Тест {test.index + 1}</span>
                          <span className={passed ? 'text-green-400' : 'text-red-400'}>
                            {passed ? 'успех' : 'ошибка'}
                          </span>
                          {test.stderr && <span className="text-red-400">{test.stderr}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
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

          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
            {isStreaming && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-white text-gray-900 border border-gray-200">
                  {streamBuffer ? (
                    <p className="text-sm whitespace-pre-line">{streamBuffer}</p>
                  ) : (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-3 bg-gray-200 rounded w-32" />
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </div>
                  )}
                  <span className="text-xs text-gray-400 mt-1 block">AI формирует задачу…</span>
                </div>
              </div>
            )}
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

      {!interviewTerminated && activeWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/25 backdrop-blur-[1px]">
          <div className="bg-white border border-red-200 shadow-2xl rounded-2xl px-8 py-6 max-w-md w-full text-center">
            <p className="text-red-600 font-semibold text-lg mb-2">Античит-предупреждение</p>
            <p className="text-gray-800 text-sm mb-3">{activeWarning.message}</p>
            <p className="text-xs text-gray-500 mb-4">
              Всего предупреждений: {warnings.length} из 3 · Осталось {Math.max(0, 3 - warnings.length)}
            </p>
            <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500/80"
                style={{ width: `${warningProgress}%`, transition: 'width 5s linear' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskIntro() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100 p-6 flex flex-col gap-3">
      <h3 className="text-gray-900 text-lg">Обсудите задачу с AI</h3>
      <p className="text-sm text-gray-600">
        Перед тем как увидеть условие, расскажите интервьюеру о своём подходе. Jam задаст уточняющие вопросы и только после этого
        откроет задачу.
      </p>
      <p className="text-sm text-blue-700 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        После подтверждения готовности появится серый индикатор загрузки, а затем полное условие.
      </p>
      <p className="text-xs text-gray-500">
        Если чувствуете, что застряли, можете попросить подсказку — интервьюер покажет её отдельным блоком.
      </p>
    </div>
  );
}

function TaskLoadingPlaceholder() {
  return (
    <div className="bg-white border-b border-blue-100 p-6 flex-1 space-y-4">
      <div className="space-y-2">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-64 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="space-y-2">
            <div className="h-3 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

interface TaskPanelProps {
  spec: ParsedTaskSpec;
  activeTab: TaskTab;
  onTabChange: (tab: TaskTab) => void;
  onCopyCondition?: () => void;
  testStatuses: Record<string, TestStatus>;
}

function TaskPanel({ spec, activeTab, onTabChange, onCopyCondition, testStatuses }: TaskPanelProps) {
  const testCount = spec.testCases?.length ?? spec.tests?.length ?? 0;
  const tabs: { id: TaskTab; label: string; disabled?: boolean }[] = [
    { id: 'condition', label: 'Условие' },
    { id: 'examples', label: 'Примеры', disabled: !(spec.examples?.length || spec.example) },
    { id: 'tests', label: `Тесты (${testCount})`, disabled: !testCount },
  ];
  const complexityMatch = spec.condition?.match(/O\([^)]*\)/i)?.[0];
  const hintReady = Boolean(spec.hint && spec.canShowHint);
  const hintLocked = Boolean(spec.hint && !spec.canShowHint);

  if (!spec.condition) {
    return <TaskLoadingPlaceholder />;
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-blue-50 border-b border-blue-100">
      <div className="px-4 pt-4 flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 bg-blue-100 hover:bg-blue-200'
            } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden bg-white mt-4 mx-4 rounded-xl border border-blue-100 shadow-sm min-h-0">
        {activeTab === 'condition' && (
          <div className="p-5 h-full overflow-y-auto space-y-6" onCopy={onCopyCondition}>
            <section className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Описание</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{spec.condition}</p>
            </section>

            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Ключевые ограничения</p>
              <div className="flex flex-wrap gap-2">
                {complexityMatch && <ConditionChip label="Сложность" value={complexityMatch} />}
                {spec.timeLimit && <ConditionChip label="Время" value={spec.timeLimit} />}
                {spec.memoryLimit && <ConditionChip label="Память" value={spec.memoryLimit} />}
              </div>
            </section>

            {hintReady && (
              <section>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-amber-900 space-y-1">
                  <p className="text-sm font-semibold">Подсказка интервьюера</p>
                  <p className="text-sm whitespace-pre-wrap">{spec.hint}</p>
                </div>
              </section>
            )}

            {hintLocked && (
              <p className="text-xs text-gray-500 italic">
                Подсказка скрыта. Сообщи интервьюеру, если захочешь её получить.
              </p>
            )}
          </div>
        )}
        {activeTab === 'examples' && <ExamplesTab examples={spec.examples} fallbackExample={spec.example} />}
        {activeTab === 'tests' && (
          <TestsTab detailedTests={spec.testCases} fallbackTests={spec.tests} testStatuses={testStatuses} />
        )}
      </div>
    </div>
  );
}

function ConditionChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-xs font-medium text-blue-900 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
      {label}: {value}
    </span>
  );
}

function ExamplesTab({
  examples,
  fallbackExample,
}: {
  examples?: ParsedExampleCase[];
  fallbackExample?: string;
}) {
  if (!examples?.length && !fallbackExample) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-gray-500">Примеры ещё не предоставлены</div>
    );
  }

  if (examples?.length) {
    return (
      <div className="p-4 h-full overflow-y-auto space-y-3 min-h-0">
        {examples.map((example, index) => (
          <div key={`example-${index}`} className="border border-gray-200 rounded-xl bg-gray-50 space-y-2">
            <div className="px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Пример {index + 1}
            </div>
            {example.input && (
              <div className="px-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Вход</p>
                <pre className="text-xs whitespace-pre-wrap text-gray-800 bg-white rounded-lg border border-gray-200 p-2">
                  {example.input}
                </pre>
              </div>
            )}
            {example.output && (
              <div className="px-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Выход</p>
                <pre className="text-xs whitespace-pre-wrap text-gray-800 bg-white rounded-lg border border-gray-200 p-2">
                  {example.output}
                </pre>
              </div>
            )}
            {example.explanation && (
              <div className="px-4 pb-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Пояснение</p>
                <p className="text-xs text-gray-700 whitespace-pre-wrap">{example.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  const blocks = fallbackExample?.split(/\n\s*\n/).filter(Boolean) ?? [];
  return (
    <div className="p-4 h-full overflow-y-auto space-y-3">
      {blocks.map((block, index) => (
        <div key={`example-${index}`} className="border border-gray-200 rounded-xl bg-gray-50">
          <div className="px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Пример {index + 1}
          </div>
          <pre className="text-xs whitespace-pre-wrap text-gray-800 px-4 py-3">{block}</pre>
        </div>
      ))}
    </div>
  );
}

interface TestsTabProps {
  detailedTests?: ParsedTestCase[];
  fallbackTests?: string[];
  testStatuses: Record<string, TestStatus>;
}

function TestsTab({ detailedTests, fallbackTests, testStatuses }: TestsTabProps) {
  const tests = detailedTests?.length ? detailedTests : undefined;
  const fallback = !tests ? fallbackTests ?? [] : [];
  const total = tests?.length ?? fallback.length;

  if (!total) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-gray-500">Открытых тестов нет</div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto space-y-4 min-h-0">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">Открытые тесты</p>
      </div>

      <div className="space-y-3">
        {tests
          ? tests.map((test, index) => {
              const id = `test-${index}`;
              const status = testStatuses[id] ?? 'idle';
              return (
                <div key={id} className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Тест {index + 1}</span>
                    <StatusBadge status={status} />
                  </div>
                  {test.input && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">Ввод</p>
                      <pre className="text-xs bg-white border border-gray-200 rounded p-2 whitespace-pre-wrap">{test.input}</pre>
                    </div>
                  )}
                  {test.output && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">Ожидаемый вывод</p>
                      <pre className="text-xs bg-white border border-gray-200 rounded p-2 whitespace-pre-wrap">{test.output}</pre>
                    </div>
                  )}
                </div>
              );
            })
          : fallback.map((test, index) => {
              const id = `test-${index}`;
              const status = testStatuses[id] ?? 'idle';
              return (
                <div key={id} className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Тест {index + 1}</span>
                    <StatusBadge status={status} />
                  </div>
                  <pre className="text-xs bg-white border border-gray-200 rounded p-2 whitespace-pre-wrap">{test}</pre>
                </div>
              );
            })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TestStatus }) {
  const labelMap: Record<TestStatus, string> = {
    idle: 'не запущен',
    running: 'в прогоне',
    passed: 'успешно',
    failed: 'ошибка',
  };
  const classMap: Record<TestStatus, string> = {
    idle: 'bg-gray-200 text-gray-700',
    running: 'bg-blue-100 text-blue-700 animate-pulse',
    passed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${classMap[status]}`}>{labelMap[status]}</span>
  );
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function sanitizeCompletion(raw?: string) {
  if (!raw) return '';
  let trimmed = raw.trim();
  const fenced = trimmed.match(/^```[a-zA-Z0-9]*\n([\s\S]*?)```$/);
  if (fenced) {
    trimmed = fenced[1].trim();
  } else if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
    trimmed = trimmed.slice(3, -3).trim();
  }
  return trimmed;
}

function summarizeChannel(label: string, value: string, limit = 200) {
  if (!value) return `${label}: (пусто)`;
  const normalized = value.replace(/\r/g, '').trim();
  if (!normalized) {
    return `${label}: (пусто)`;
  }
  const preview = normalized.slice(0, limit);
  return `${label}: ${preview}${normalized.length > limit ? '…' : ''}`;
}

function buildTestPayload(spec: ParsedTaskSpec): TestCasePayload[] {
  if (spec.testCases?.length) {
    return spec.testCases.map((test) => ({
      input: test.input ?? '',
      expected: test.output ?? undefined,
    }));
  }
  if (spec.tests?.length) {
    return spec.tests.map((input) => ({ input }));
  }
  return [];
}

function buildTestsSignature(testCases?: ParsedTestCase[], tests?: string[]) {
  if (testCases?.length) {
    return testCases.map(({ input = '', output = '' }) => `${input}::${output}`).join('|');
  }
  if (tests?.length) {
    return tests.join('|');
  }
  return null;
}
