import React from 'react';
import { AutoExpandingTextarea } from './AutoExpandingTextarea';

interface MarkdownTextAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  template?: string;
  hint?: string;
  minRows?: number;
  maxRows?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function MarkdownTextArea({
  label,
  value,
  onChange,
  placeholder,
  template,
  hint,
  minRows = 3,
  maxRows = 6,
  onKeyDown
}: MarkdownTextAreaProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle markdown shortcuts
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      let newText = text;
      let newCursorPos = start;

      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          newText = text.substring(0, start) + '**' + 
                   text.substring(start, end) + 
                   '**' + text.substring(end);
          newCursorPos = end + 4;
          break;
        case 'i':
          e.preventDefault();
          newText = text.substring(0, start) + '_' + 
                   text.substring(start, end) + 
                   '_' + text.substring(end);
          newCursorPos = end + 2;
          break;
        case 'k':
          e.preventDefault();
          newText = text.substring(0, start) + '`' + 
                   text.substring(start, end) + 
                   '`' + text.substring(end);
          newCursorPos = end + 2;
          break;
        case 'l':
          e.preventDefault();
          newText = text.substring(0, start) + '\n- ' + 
                   text.substring(start);
          newCursorPos = start + 3;
          break;
        case 'h':
          e.preventDefault();
          newText = text.substring(0, start) + '\n### ' + 
                   text.substring(start);
          newCursorPos = start + 5;
          break;
        case 'c':
          e.preventDefault();
          newText = text.substring(0, start) + '```\n' + 
                   text.substring(start, end) + 
                   '\n```' + text.substring(end);
          newCursorPos = end + 7;
          break;
      }

      if (newText !== text) {
        onChange(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
        return;
      }
    }

    onKeyDown?.(e);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium">
          {label}
        </label>
      )}
      <AutoExpandingTextarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || template}
        minRows={minRows}
        maxRows={maxRows}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {hint && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
}
