declare module '@monaco-editor/react' {
  import type * as React from 'react';

  export type OnMount = (editor: any, monaco: any) => void;

  export interface EditorProps {
    height?: string | number;
    theme?: string;
    defaultLanguage?: string;
    language?: string;
    value?: string;
    options?: Record<string, unknown>;
    onChange?: (value?: string) => void;
    onMount?: OnMount;
  }

  const Editor: React.ComponentType<EditorProps>;
  export default Editor;
}

declare module 'monaco-editor' {
  export namespace editor {
    interface IStandaloneCodeEditor {
      getPosition(): any;
      getModel(): any;
      deltaDecorations(oldDecorations: string[], decorations: any[]): string[];
      addCommand(keybinding: number, handler: () => void): void;
      onDidChangeModelContent(listener: () => void): { dispose(): void };
      onDidChangeCursorPosition(listener: () => void): { dispose(): void };
      onDidDispose(listener: () => void): void;
      trigger(source: string, handlerId: string, payload?: any): void;
    }

    interface IModelDeltaDecoration {
      range: any;
      options: any;
    }

    const TrackedRangeStickiness: {
      NeverGrowsWhenTypingAtEdges: number;
    };
  }

  export class Range {
    constructor(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number);
  }

  export namespace KeyMod {
    const Shift: number;
  }

  export namespace KeyCode {
    const Tab: number;
  }

  export interface IDisposable {
    dispose(): void;
  }
}

