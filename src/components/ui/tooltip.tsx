import * as React from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export const Tooltip = ({ children, content, className = '' }: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX
      });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            className={`fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg p-2 ${className}`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};
