import { useEffect, useState, useCallback } from 'react';

export const useDropdownPosition = (anchorRef, enabled) => {
  const [pos, setPos] = useState(null);

  const compute = useCallback(() => {
    const rect = anchorRef?.current?.getBoundingClientRect();
    if (!rect) return;
    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;
    const desired = 320;
    const placeAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(120, Math.min(desired, placeAbove ? spaceAbove : spaceBelow));
    const top = placeAbove ? (rect.top + window.scrollY - maxHeight - 8) : (rect.bottom + window.scrollY + 8);
    const left = rect.left + window.scrollX;
    const width = rect.width;
    setPos({ top, left, width, maxHeight });
  }, [anchorRef]);

  useEffect(() => {
    if (!enabled) return;
    compute();
    const handler = () => compute();
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [enabled, compute]);

  return { pos, recompute: compute };
};

