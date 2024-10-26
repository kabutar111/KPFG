import { FileText } from 'lucide-react';

interface MarkdownFillButtonProps {
  onClick: () => void;
  className?: string;
}

export function MarkdownFillButton({ onClick, className = '' }: MarkdownFillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors ${className}`}
    >
      <FileText size={14} className="mr-1" />
      MD
    </button>
  );
}
