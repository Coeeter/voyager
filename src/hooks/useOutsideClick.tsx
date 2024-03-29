import { useCallback, useEffect, useRef } from 'react';

export const useOutsideClick = <T extends HTMLElement>(
  callback: () => void
) => {
  const ref = useRef<T>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });

  return ref;
};
