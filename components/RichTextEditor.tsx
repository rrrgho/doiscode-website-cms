'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  };

  return (
    <div className="bg-white text-black rounded-lg overflow-hidden border border-input">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        className="[&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-sm [&_.ql-toolbar]:border-none [&_.ql-container]:border-none"
      />
    </div>
  );
}
