import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from './ui/tooltip';

export const MarkdownShortcutsHelp = () => {
  const shortcuts = [
    { key: '⌘+B', description: 'Bold', example: '**text**' },
    { key: '⌘+I', description: 'Italic', example: '_text_' },
    { key: '⌘+K', description: 'Code', example: '`code`' },
    { key: '⌘+L', description: 'List item', example: '- item' },
    { key: '⌘+H', description: 'Heading', example: '### heading' },
    { key: '⌘+C', description: 'Code block', example: '```\ncode\n```' },
    { key: 'Tab', description: 'Indent', example: '  text' },
    { key: 'Shift+Tab', description: 'Outdent', example: 'text' },
    { key: '⌘+S', description: 'Save Draft', example: '' },
    { key: '⌘+J', description: 'Preview Mode', example: '' },
    { key: '⌘+L', description: 'Load Draft', example: '' },
  ];

  return (
    <Tooltip
      content={
        <div className="w-72 space-y-3 p-2">
          <h3 className="font-bold text-sm border-b pb-2">Keyboard Shortcuts:</h3>
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold text-sm mb-1">Text Formatting:</h4>
              <ul className="text-sm space-y-1">
                {shortcuts.slice(0, 6).map(({ key, description }) => (
                  <li key={key} className="flex items-center justify-between">
                    <code className="bg-gray-100 px-1 rounded">{key}</code>
                    <span className="text-gray-600">{description}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Indentation:</h4>
              <ul className="text-sm space-y-1">
                {shortcuts.slice(6, 8).map(({ key, description }) => (
                  <li key={key} className="flex items-center justify-between">
                    <code className="bg-gray-100 px-1 rounded">{key}</code>
                    <span className="text-gray-600">{description}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">General:</h4>
              <ul className="text-sm space-y-1">
                {shortcuts.slice(8).map(({ key, description }) => (
                  <li key={key} className="flex items-center justify-between">
                    <code className="bg-gray-100 px-1 rounded">{key}</code>
                    <span className="text-gray-600">{description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      }
    >
      <button className="inline-flex items-center text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100">
        <Info className="h-4 w-4 mr-2" />
        <span>Shortcuts</span>
      </button>
    </Tooltip>
  );
};
