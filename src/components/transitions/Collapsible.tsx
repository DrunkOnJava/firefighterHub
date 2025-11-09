/**
 * Collapsible Component
 * 
 * Smooth expand/collapse animation with auto-height calculation.
 * 
 * Features:
 * - Smooth height transitions
 * - Auto-height calculation
 * - Accordion variant
 * - Icon rotation animation
 * - Keyboard accessible
 * - Respects prefers-reduced-motion
 * 
 * Usage:
 * ```tsx
 * <Collapsible
 *   title="Click to expand"
 *   isOpen={isOpen}
 *   onToggle={setIsOpen}
 * >
 *   <p>Content goes here</p>
 * </Collapsible>
 * ```
 */

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ChevronDown } from 'lucide-react';
import '../../styles/animations.css';

interface CollapsibleProps {
  title: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  isDarkMode?: boolean;
}

export function Collapsible({
  title,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  defaultOpen = false,
  disabled = false,
  icon,
  iconPosition = 'right',
  className = '',
  headerClassName = '',
  contentClassName = '',
  isDarkMode = true,
}: CollapsibleProps) {
  const isControlled = controlledIsOpen !== undefined;
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Calculate height for smooth animation
  const [height, setHeight] = useState<number | string>(isOpen ? 'auto' : 0);

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      // Measure content height
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight);

      // Set to auto after animation completes
      const timer = setTimeout(() => {
        setHeight('auto');
      }, prefersReducedMotion ? 0 : 200);

      return () => clearTimeout(timer);
    } else {
      // Get current height before collapsing
      setHeight(contentRef.current.scrollHeight);
      
      // Trigger reflow to ensure transition works
      requestAnimationFrame(() => {
        setHeight(0);
      });
    }
  }, [isOpen, prefersReducedMotion]);

  const handleToggle = () => {
    if (disabled) return;

    const newIsOpen = !isOpen;
    
    if (isControlled) {
      onToggle?.(newIsOpen);
    } else {
      setInternalIsOpen(newIsOpen);
      onToggle?.(newIsOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const defaultIcon = (
    <ChevronDown
      className={`
        w-5 h-5
        ${!prefersReducedMotion ? 'transition-transform duration-200' : ''}
        ${isOpen ? 'rotate-180' : 'rotate-0'}
      `}
    />
  );

  return (
    <div
      className={`
        ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        border-2 rounded-lg overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isOpen}
        className={`
          w-full px-4 py-3
          flex items-center justify-between gap-3
          ${isDarkMode ? 'text-white hover:bg-slate-700' : 'text-slate-900 hover:bg-slate-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${!prefersReducedMotion ? 'transition-colors duration-150' : ''}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
          ${headerClassName}
        `}
      >
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        
        <span className="flex-1 text-left font-medium">{title}</span>
        
        {iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon || defaultIcon}</span>
        )}
      </button>

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          height,
          overflow: 'hidden',
          transition: prefersReducedMotion
            ? 'none'
            : 'height 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        aria-hidden={!isOpen}
      >
        <div className={`px-4 py-3 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Accordion Component
 * Multiple collapsible items where only one can be open at a time
 */
interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
  isDarkMode?: boolean;
}

export function Accordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className = '',
  isDarkMode = true,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(defaultOpenId ? [defaultOpenId] : [])
  );

  const handleToggle = (id: string, isOpen: boolean) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      
      if (isOpen) {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      } else {
        next.delete(id);
      }
      
      return next;
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <Collapsible
          key={item.id}
          title={item.title}
          isOpen={openIds.has(item.id)}
          onToggle={(isOpen) => handleToggle(item.id, isOpen)}
          disabled={item.disabled}
          isDarkMode={isDarkMode}
        >
          {item.content}
        </Collapsible>
      ))}
    </div>
  );
}
