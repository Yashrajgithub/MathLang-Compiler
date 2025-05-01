// src/components/CodeEditor.tsx
import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

const CodeEditor = ({ code, onChange }: { code: string; onChange: (newCode: string) => void }) => {
  return (
    <Editor
      value={code}
      onValueChange={onChange}
      highlight={(code) => highlight(code, languages.js)}
      padding={10}
      style={{
        fontFamily: 'monospace',
        fontSize: 16,
        backgroundColor: '#1e1e1e',
        color: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #444',
        minHeight: '200px',
      }}
    />
  );
};

export default CodeEditor;
