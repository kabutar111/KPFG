import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AutoExpandingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  maxRows?: number;
}

export const AutoExpandingTextarea = React.forwardRef<HTMLTextAreaElement, AutoExpandingTextareaProps>(
  ({ className, minRows = 2, maxRows = 8, onChange, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = 'auto';
      const singleRowHeight = 20; // Approximate height of one row
      const minHeight = minRows * singleRowHeight;
      const maxHeight = maxRows * singleRowHeight;
      
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(Math.max(minHeight, scrollHeight), maxHeight)}px`;
    };

    useEffect(() => {
      if (textareaRef.current) {
        adjustHeight();
      }
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      adjustHeight();
      onChange?.(e);
    };

    return (
      <textarea
        {...props}
        ref={(node) => {
          textareaRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        onChange={handleChange}
        className={cn(
          "w-full p-2 text-sm border border-gray-300 rounded-md resize-none overflow-hidden",
          className
        )}
        rows={minRows}
      />
    );
  }
);

AutoExpandingTextarea.displayName = 'AutoExpandingTextarea';
