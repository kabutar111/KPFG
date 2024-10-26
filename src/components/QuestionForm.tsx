import React from 'react';
import { Question } from '../App';
import { Categories, isFach, isFachgebiet } from '../categories';
import { Trash2 } from 'lucide-react';
import { MarkdownTextArea } from './MarkdownTextArea';
import { markdownFieldTemplates } from '../utils/markdownFieldTemplates';

interface QuestionFormProps {
  question: Question;
  index: number;
  teil: 'teil1' | 'teil3';
  onDelete: () => void;
  onChange: (field: keyof Question, value: string | string[]) => void;
  colorScheme: 'blue' | 'yellow';
  onIndentation: (e: React.KeyboardEvent<HTMLTextAreaElement>, teilName: string, index: number, field: keyof Question) => void;
}

export function QuestionForm({ 
  question: q, 
  index, 
  teil, 
  onDelete, 
  onChange,
  colorScheme,
  onIndentation
}: QuestionFormProps) {
  return (
    <div className="bg-white p-4 rounded-md shadow mb-4">
      <div className="flex justify-between items-center">
        <h4 className={`text-lg font-medium text-${colorScheme}-600 mb-2`}>
          Frage {index + 1}
        </h4>
        <button
          type="button"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Selection fields */}
        <select
          value={q.fach}
          onChange={(e) => onChange('fach', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Fach auswählen</option>
          {Categories.faecher.map(fach => (
            <option key={fach} value={fach}>{fach}</option>
          ))}
        </select>

        <select
          value={q.fachgebiet}
          onChange={(e) => onChange('fachgebiet', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Fachgebiet auswählen</option>
          {q.fach && isFach(q.fach) && Categories.fachgebiete[q.fach]?.map((fachgebiet: string) => (
            <option key={fachgebiet} value={fachgebiet}>{fachgebiet}</option>
          ))}
        </select>

        <select
          value={q.thema}
          onChange={(e) => onChange('thema', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Thema auswählen</option>
          {q.fachgebiet && isFachgebiet(q.fachgebiet) && Categories.themen[q.fachgebiet]?.map((thema: string) => (
            <option key={thema} value={thema}>{thema}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {/* Text fields */}
        {(['question', 'answer', 'idealAnswer', 'kommentar'] as const).map((field) => (
          <MarkdownTextArea
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={q[field]}
            onChange={(value) => onChange(field, value)}
            template={markdownFieldTemplates[field]}
            hint={field === 'kommentar' ? 'Tipps und Hinweise' : undefined}
            onKeyDown={(e) => onIndentation(e, teil, index, field)}
          />
        ))}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {q.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <input
            type="text"
            value={q.tags.join(', ')}
            onChange={(e) => onChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
            placeholder="Zusatzliche Tags (durch Komma getrennt)"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Difficulty */}
        <select
          value={q.schwierigkeit}
          onChange={(e) => onChange('schwierigkeit', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Schwierigkeitsgrad auswählen</option>
          <option value="leicht">Leicht</option>
          <option value="mittel">Mittel</option>
          <option value="schwer">Schwer</option>
        </select>
      </div>
    </div>
  );
}
