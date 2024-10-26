import { Save, FileUp, FileDown } from 'lucide-react';

interface ActionButtonsProps {
  onGenerateJSON: () => void;
  onSaveDraft: () => void;
  onLoadDraft: () => void;
  onToggleAutoSave: () => void;
  loading: boolean;
  autoSave: boolean;
}

export function ActionButtons({
  onGenerateJSON,
  onSaveDraft,
  onLoadDraft,
  onToggleAutoSave,
  loading,
  autoSave
}: ActionButtonsProps) {
  return (
    <div className="flex justify-center space-x-4">
      <button 
        type="button" 
        onClick={onGenerateJSON} 
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
      >
        <Save className="mr-2" size={20} />
        {loading ? 'Wird generiert...' : 'JSON-Datei generieren'}
      </button>
      <button 
        type="button" 
        onClick={onSaveDraft}
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300 flex items-center"
      >
        <FileDown className="mr-2" size={20} />
        Entwurf speichern
      </button>
      <button 
        type="button" 
        onClick={onLoadDraft}
        className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition duration-300 flex items-center"
      >
        <FileUp className="mr-2" size={20} />
        Entwurf laden
      </button>
      <button 
        type="button" 
        onClick={onToggleAutoSave}
        className={`flex items-center px-6 py-2 rounded-md transition duration-300 ${
          autoSave 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-gray-500 hover:bg-gray-600'
        } text-white`}
      >
        <Save className="mr-2" size={20} />
        Auto-Save: {autoSave ? 'An' : 'Aus'}
      </button>
    </div>
  );
}
