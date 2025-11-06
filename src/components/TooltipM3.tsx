import { ReactNode, useState, useRef, useEffect } from "react";
import { colors, tokens } from "../styles";

interface TooltipM3Props {
  content: string;
  children: ReactNode;
  delay?: number;
  position?: "top" | "bottom" | "left" | "right";
}

export function TooltipM3({
  content,
  children,
  delay = 500,
  position = "top",
}: TooltipM3Props) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-current border-l-transparent border-r-transparent border-b-transparent",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-current border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-current border-t-transparent border-b-transparent border-r-transparent",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-current border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      {isVisible && content && (
        <div
          className={`absolute ${positionClasses[position]} z-50 pointer-events-none`}
          role="tooltip"
        >
          <div
            className={`px-3 py-2 ${tokens.typography.body.secondary} font-medium ${tokens.borders.radius.lg} shadow-lg whitespace-nowrap ${colors.structural.bg.card} ${colors.structural.text.surface} border ${colors.structural.border.default}`}
          >
            {content}
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[position]} ${colors.structural.text.surface}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
