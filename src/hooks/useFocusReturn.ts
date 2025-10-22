import { useEffect, useRef } from 'react';

export function useFocusReturn(isOpen: boolean) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    } else {
      if (previousActiveElement.current) {
        const elementToFocus = previousActiveElement.current;
        setTimeout(() => {
          if (elementToFocus && typeof elementToFocus.focus === 'function') {
            elementToFocus.focus();
          }
        }, 0);
      }
    }
  }, [isOpen]);

  return previousActiveElement;
}
