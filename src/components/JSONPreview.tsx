import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Search, FileJson, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Question } from '../App';
import { cn } from "../lib/utils"; // Fix the import path

interface JSONPreviewProps {
  data: any;
  onCopy: () => void;
}

export function JSONPreview({ data, onCopy }: JSONPreviewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'json' | 'markdown'>('json');
  const preRef = useRef<HTMLPreElement>(null);

  const getFormattedJson = () => {
    try {
      // Return all data without filtering
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return 'Error: Invalid JSON data';
    }
  };

  const getMarkdownContent = () => {
    try {
      const markdownParts = [];

      // Add metadata information
      markdownParts.push('# Prüfungsprotokoll');
      markdownParts.push(`**ID:** ${data.id || '(Noch nicht generiert)'}`);
      markdownParts.push(`**Version:** ${data.version}`);
      markdownParts.push(`**Bundesland:** ${data.state || '(Nicht ausgewählt)'}`);
      markdownParts.push(`**Prüfungsjahr:** ${data.examYear || '(Nicht ausgewählt)'}`);
      markdownParts.push(`**Prüfungsmonat:** ${data.examMonth || '(Nicht ausgewählt)'}`);
      markdownParts.push('');

      // Add subject information
      markdownParts.push('## Fachliche Einordnung');
      markdownParts.push(`**Fach:** ${data.fach || '(Nicht ausgewählt)'}`);
      markdownParts.push(`**Fachgebiet:** ${data.fachgebiet || '(Nicht ausgewählt)'}`);
      markdownParts.push(`**Thema:** ${data.thema || '(Nicht ausgewählt)'}`);
      markdownParts.push(`**Kategorie:** ${data.kategorie || '(Nicht ausgewählt)'}`);
      markdownParts.push('');

      // Teil 1
      markdownParts.push('## Teil 1: Anamnese und körperliche Untersuchung');
      markdownParts.push(`**Schwierigkeit:** ${data.teil1.schwierigkeit || '(Nicht angegeben)'}`);
      if (data.teil1.inhalt) {
        markdownParts.push('### Inhalt');
        markdownParts.push(data.teil1.inhalt);
      }
      if (data.teil1.questions?.length > 0) {
        markdownParts.push('\n### Fragen');
        data.teil1.questions.forEach((q: Question, i: number) => {
          markdownParts.push(`#### Frage ${i + 1}`);
          markdownParts.push(`**Frage:** ${q.question || '(Keine Frage)'}`);
          markdownParts.push(`**Antwort:** ${q.answer || '(Keine Antwort)'}`);
          markdownParts.push(`**Ideale Antwort:** ${q.idealAnswer || '(Keine ideale Antwort)'}`);
          markdownParts.push(`**Schwierigkeit:** ${q.schwierigkeit || '(Nicht angegeben)'}`);
          markdownParts.push(`**Tags:** ${q.tags.join(', ') || '(Keine Tags)'}`);
          if (q.kommentar) markdownParts.push(`**Kommentar:** ${q.kommentar}`);
          markdownParts.push('');
        });
      }

      // Teil 2
      markdownParts.push('## Teil 2: Dokumentation');
      markdownParts.push(`**Schwierigkeit:** ${data.teil2.schwierigkeit || '(Nicht angegeben)'}`);
      if (data.teil2.inhalt) {
        markdownParts.push('### Inhalt');
        markdownParts.push(data.teil2.inhalt);
      }
      markdownParts.push('');

      // Teil 3
      markdownParts.push('## Teil 3: Fallbeschreibung');
      markdownParts.push(`**Schwierigkeit:** ${data.teil3.schwierigkeit || '(Nicht angegeben)'}`);
      if (data.teil3.inhalt) {
        markdownParts.push('### Inhalt');
        markdownParts.push(data.teil3.inhalt);
      }
      if (data.teil3.questions?.length > 0) {
        markdownParts.push('\n### Fragen');
        data.teil3.questions.forEach((q: Question, i: number) => {
          markdownParts.push(`#### Frage ${i + 1}`);
          markdownParts.push(`**Frage:** ${q.question || '(Keine Frage)'}`);
          markdownParts.push(`**Antwort:** ${q.answer || '(Keine Antwort)'}`);
          markdownParts.push(`**Ideale Antwort:** ${q.idealAnswer || '(Keine ideale Antwort)'}`);
          markdownParts.push(`**Schwierigkeit:** ${q.schwierigkeit || '(Nicht angegeben)'}`);
          markdownParts.push(`**Tags:** ${q.tags.join(', ') || '(Keine Tags)'}`);
          if (q.kommentar) markdownParts.push(`**Kommentar:** ${q.kommentar}`);
          markdownParts.push('');
        });
      }

      // Additional Information
      markdownParts.push('## Zusätzliche Informationen');
      markdownParts.push(`**Schwierigkeit (Gesamt):** ${data.schwierigkeit || '(Nicht angegeben)'}`);
      markdownParts.push(`**Schlagwörter:** ${data.schlagwoerter || '(Keine Schlagwörter)'}`);
      markdownParts.push(`**Prüfungskompetenz:** ${data.pruefungskompetenz || '(Nicht angegeben)'}`);
      markdownParts.push(`**Verbundene Themen:** ${data.verbundenThemen || '(Keine verbundenen Themen)'}`);
      if (data.kommentar) {
        markdownParts.push(`**Allgemeiner Kommentar:** ${data.kommentar}`);
      }

      return markdownParts.join('\n');
    } catch (error) {
      return 'Error: Could not generate markdown';
    }
  };

  const handleCopy = () => {
    const content = viewMode === 'json' ? getFormattedJson() : getMarkdownContent();
    navigator.clipboard.writeText(content);
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(searchTerm, 'gi');
    return text.replace(regex, match => `<mark class="bg-yellow-200 text-gray-900">${match}</mark>`);
  };

  useEffect(() => {
    if (preRef.current) {
      const pre = preRef.current;
      if (pre.scrollHeight > pre.clientHeight) {
        pre.scrollTop = 0;
      }
    }
  }, [data]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Suchen..."]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      {/* Header with improved styling */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg overflow-hidden border shadow-sm">
            <button
              onClick={() => setViewMode('json')}
              className={cn(
                "px-4 py-2 text-sm flex items-center gap-2 transition-colors",
                viewMode === 'json'
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              )}
            >
              <FileJson size={16} />
              <span className="hidden sm:inline">JSON View</span>
            </button>
            <button
              onClick={() => setViewMode('markdown')}
              className={cn(
                "px-4 py-2 text-sm flex items-center gap-2 transition-colors",
                viewMode === 'markdown'
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              )}
            >
              <FileText size={16} />
              <span className="hidden sm:inline">MD View</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Suchen..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors whitespace-nowrap",
              copied 
                ? "bg-green-500 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            )}
          >
            {copied ? (
              <>
                <Check size={16} />
                <span className="hidden sm:inline">Kopiert!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span className="hidden sm:inline">
                  {viewMode === 'json' ? 'JSON kopieren' : 'Text kopieren'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content with improved styling */}
      <div className="flex-1 relative overflow-hidden rounded-lg">
        {viewMode === 'json' ? (
          <pre 
            ref={preRef}
            className="bg-gray-900 text-green-400 p-6 overflow-auto absolute inset-0 font-mono text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: highlightSearchTerm(getFormattedJson())
            }}
          />
        ) : (
          <div className="bg-white overflow-auto absolute inset-0 border rounded-lg">
            <div className="p-6 prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 pb-2 border-b" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-6 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-medium mt-4 mb-2" {...props} />,
                  h4: ({node, ...props}) => <h4 className="text-base font-medium mt-3 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="my-2 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="my-2 list-disc list-inside" {...props} />,
                  ol: ({node, ...props}) => <ol className="my-2 list-decimal list-inside" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-blue-600" {...props} />,
                }}
              >
                {getMarkdownContent()}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
