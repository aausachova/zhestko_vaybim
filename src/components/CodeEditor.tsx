import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const highlightSyntax = (code: string) => {
    // Простая подсветка синтаксиса для JavaScript
    const keywords = /\b(function|const|let|var|if|else|for|while|return|class|extends|import|export|from|async|await|try|catch|new|this|null|undefined|true|false)\b/g;
    const strings = /('([^'\\]|\\.)*'|"([^"\\]|\\.)*"|`([^`\\]|\\.)*`)/g;
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    const numbers = /\b(\d+)\b/g;
    const functions = /\b([a-zA-Z_]\w*)\s*(?=\()/g;
    
    let highlighted = code
      .replace(/</g, '<')
      .replace(/>/g, '>');
    
    // Подсветка комментариев
    highlighted = highlighted.replace(comments, '<span style="color: #6a737d; font-style: italic;">$1</span>');
    
    // Подсветка строк
    highlighted = highlighted.replace(strings, '<span style="color: #22863a;">$1</span>');
    
    // Подсветка ключевых слов
    highlighted = highlighted.replace(keywords, '<span style="color: #6f42c1; font-weight: 600;">$1</span>');
    
    // Подсветка чисел
    highlighted = highlighted.replace(numbers, '<span style="color: #005cc5;">$1</span>');
    
    // Подсветка функций
    highlighted = highlighted.replace(functions, '<span style="color: #0550ae; font-weight: 500;">$1</span>');
    
    return highlighted;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="relative h-full bg-white">
      <div 
        className="absolute inset-0 p-4 font-mono text-sm whitespace-pre-wrap break-words pointer-events-none overflow-auto"
        style={{ 
          fontFamily: "'Fira Code', 'Consolas', monospace",
          lineHeight: '1.6',
          color: 'transparent',
        }}
        dangerouslySetInnerHTML={{ __html: highlightSyntax(value) }}
      />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 p-4 bg-transparent text-gray-900 font-mono text-sm resize-none focus:outline-none overflow-auto caret-gray-900"
        style={{ 
          fontFamily: "'Fira Code', 'Consolas', monospace",
          lineHeight: '1.6',
          color: 'transparent',
          caretColor: '#1f2937',
        }}
        spellCheck={false}
      />
    </div>
  );
}
