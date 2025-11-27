import React, { useCallback, useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type * as monacoEditor from 'monaco-editor';

interface CodeWorkbenchProps {
  value: string;
  language?: string;
  autoSuggestion?: string;
  caretAtEnd: boolean;
  onChange: (value: string) => void;
  onCaretChange: (atEnd: boolean) => void;
  onAcceptSuggestion: () => void;
  onDismissSuggestion: () => void;
}

export function CodeWorkbench({
  value,
  language = 'javascript',
  autoSuggestion,
  caretAtEnd,
  onChange,
  onCaretChange,
  onAcceptSuggestion,
  onDismissSuggestion,
}: CodeWorkbenchProps) {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monacoEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const caretAtEndRef = useRef(caretAtEnd);
  const autoSuggestionRef = useRef(autoSuggestion);

  const updateGhostDecoration = useCallback(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    let newDecorations: monacoEditor.editor.IModelDeltaDecoration[] = [];
    if (autoSuggestionRef.current && caretAtEndRef.current) {
      const position = editor.getPosition();
      if (position) {
        const firstLine = autoSuggestionRef.current.split('\n')[0] ?? '';
        const ghostText = firstLine.replace(/\r/g, '').replace(/\t/g, '␉');
        newDecorations = [
          {
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column,
            ),
            options: {
              after: {
                content: ghostText,
                inlineClassName: 'monaco-ghost-text',
              },
              stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            },
          },
        ];
      }
    }
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  }, []);

  const checkCaretAtEnd = useCallback(() => {
    const editor = editorRef.current;
    const model = editor?.getModel();
    if (!editor || !model) return;
    const position = editor.getPosition();
    if (!position) return;
    const offset = model.getOffsetAt(position);
    const atEnd = offset === model.getValueLength();
    caretAtEndRef.current = atEnd;
    onCaretChange(atEnd);
    if (!atEnd && autoSuggestionRef.current) {
      onDismissSuggestion();
    }
  }, [onCaretChange, onDismissSuggestion]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    const disposables: monacoEditor.IDisposable[] = [];

    disposables.push(
      editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Tab, () => {
        editor.trigger('keyboard', 'outdent');
      }),
    );

    disposables.push(
      editor.onKeyDown((event) => {
        if (event.keyCode === monaco.KeyCode.Tab && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
          if (caretAtEndRef.current && autoSuggestionRef.current) {
            event.preventDefault();
            onAcceptSuggestion();
          } else {
            editor.trigger('keyboard', 'type', { text: '\t' });
          }
        }
      }),
    );

    editor.onDidChangeCursorPosition(() => {
      checkCaretAtEnd();
    });

    editor.onDidChangeModelContent(() => {
      checkCaretAtEnd();
    });

    editor.onDidDispose(() => {
      disposables.forEach((d) => d.dispose());
    });
  };

  useEffect(() => {
    caretAtEndRef.current = caretAtEnd;
    updateGhostDecoration();
  }, [caretAtEnd, updateGhostDecoration]);

  useEffect(() => {
    autoSuggestionRef.current = autoSuggestion;
    updateGhostDecoration();
  }, [autoSuggestion, updateGhostDecoration]);

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        theme="vs-dark"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={(val) => onChange(val ?? '')}
        onMount={handleMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: 'Consolas, Fira Code, monospace',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          renderLineHighlight: 'line',
          lineNumbersMinChars: 3,
          wordWrap: 'on',
          smoothScrolling: true,
          scrollbar: { vertical: 'visible', horizontal: 'auto', useShadows: false },
          mouseWheelScrollSensitivity: 1.2,
        }}
      />
    </div>
  );
}

