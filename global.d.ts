declare module 'react';
declare module 'react/jsx-runtime';
declare module 'react-dom/client';
declare module 'lucide-react';
declare module '@monaco-editor/react';
declare module 'monaco-editor';

declare module '*.png' {
  const src: string;
  export default src;
}

declare module 'figma:asset/*' {
  const src: string;
  export default src;
}


