import { Question, Teil } from '../App';
import { MarkdownTextArea } from './MarkdownTextArea';
import { QuestionForm } from './QuestionForm';
import { PlusCircle } from 'lucide-react';

interface FormSectionProps {
  title: string;
  teil: Teil & { questions?: Question[] };
  teilName: 'teil1' | 'teil2' | 'teil3';
  colorScheme: 'blue' | 'green' | 'yellow';
  onTeilChange: (teilName: 'teil1' | 'teil2' | 'teil3', fieldName: keyof Teil, value: string) => void;
  onQuestionChange?: (index: number, field: keyof Question, value: string | string[]) => void;
  onAddQuestion?: () => void;
  onDeleteQuestion?: (index: number) => void;
  template: string;
  onIndentation: (e: React.KeyboardEvent<HTMLTextAreaElement>, teilName: string, questionIndex?: number, field?: keyof Question) => void;
}

export function FormSection({
  title,
  teil,
  teilName,
  colorScheme,
  onTeilChange,
  onQuestionChange,
  onAddQuestion,
  onDeleteQuestion,
  template,
  onIndentation
}: FormSectionProps) {
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-800',
      button: 'bg-blue-500 hover:bg-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      button: 'bg-green-500 hover:bg-green-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      button: 'bg-yellow-500 hover:bg-yellow-600'
    }
  };

  const color = colors[colorScheme];

  return (
    <div className={`${color.bg} shadow-sm rounded-lg p-4 border-l-4 ${color.border}`}>
      <h3 className={`text-xl font-semibold ${color.text} mb-3`}>{title}</h3>
      
      <div className="space-y-3">
        <MarkdownTextArea
          label="Inhalt"
          value={teil.inhalt}
          onChange={(value) => onTeilChange(teilName, 'inhalt', value)}
          placeholder={`${title} Inhalt`}
          template={template}
          minRows={3}
          maxRows={6}
          onKeyDown={(e) => onIndentation(e, teilName)}
        />

        <select
          value={teil.schwierigkeit}
          onChange={(e) => onTeilChange(teilName, 'schwierigkeit', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Schwierigkeitsgrad auswählen</option>
          <option value="leicht">Leicht</option>
          <option value="mittel">Mittel</option>
          <option value="schwer">Schwer</option>
        </select>

        {teil.questions && onQuestionChange && onDeleteQuestion && (
          <div className="space-y-3">
            {teil.questions.map((question, index) => (
              <QuestionForm
                key={question.id}
                question={question}
                index={index}
                teil={teilName as 'teil1' | 'teil3'}
                onDelete={() => onDeleteQuestion(index)}
                onChange={(field, value) => onQuestionChange(index, field, value)}
                colorScheme={colorScheme === 'blue' ? 'blue' : 'yellow'}
                onIndentation={onIndentation}
              />
            ))}
            
            {onAddQuestion && (
              <button
                type="button"
                onClick={onAddQuestion}
                className={`mt-4 ${color.button} text-white px-4 py-2 rounded-md transition duration-300`}
              >
                <PlusCircle className="inline-block mr-2" size={20} />
                Weitere Frage hinzufügen
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
