import { Code } from 'lucide-react';

interface FormHeaderProps {
  showJsonPreview: boolean;
  onTogglePreview: () => void;
}

export function FormHeader({ showJsonPreview, onTogglePreview }: FormHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-blue-600">KP Medizin Prüfungsfragen-Generator</h2>
      <button
        onClick={onTogglePreview}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
      >
        <Code size={20} />
        {showJsonPreview ? 'JSON ausblenden' : 'JSON anzeigen'}
      </button>
    </div>
  );
}
