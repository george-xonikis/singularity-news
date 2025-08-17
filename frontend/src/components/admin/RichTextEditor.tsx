'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamic import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-50 border border-gray-300 rounded-md animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Loading editor...</p>
    </div>
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          ['link', 'image'],
          ['clean'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
        ],
      },
      clipboard: {
        matchVisual: false, // This prevents toolbar from disappearing on paste
      },
    }),
    []
  );

  const formats = useMemo(
    () => [
      'header',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'indent',
      'link',
      'image',
      'color',
      'background',
      'align',
    ],
    []
  );

  return (
    <div className="bg-white border border-gray-300 rounded-md overflow-hidden" style={{ height: '850px' }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="[&_.ql-container]:flex-1 [&_.ql-container]:overflow-hidden [&_.ql-editor]:h-full [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:text-base [&_.ql-editor]:leading-relaxed [&_.ql-editor]:p-4 [&_.ql-toolbar]:flex-shrink-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:bg-white"
      />
    </div>
  );
}