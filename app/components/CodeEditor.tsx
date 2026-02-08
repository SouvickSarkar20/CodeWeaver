"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { FileItem } from '../types'; // Adjust if necessary

// Dynamically import monaco editor (recommended for Next.js)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-gray-400">
      Loading editor...
    </div>
  ),
});

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a file to view its contents
      </div>
    );
  }

  const language = file.name.endsWith('.tsx') || file.name.endsWith('.ts')
    ? 'typescript'
    : file.name.endsWith('.js') || file.name.endsWith('.jsx')
    ? 'javascript'
    : 'plaintext';

  return (
    <MonacoEditor
      height="100%"
      defaultLanguage={language}
      theme="vs-dark"
      value={file.content || ''}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
      }}
    />
  );
}
