import { useMemo } from 'react';

export const useSuggestions = (query, inventory) => {
  const suggestions = useMemo(() => {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return [];
    const matches = inventory.filter((item) => String(item.name || '').toLowerCase().includes(q));
    const scored = matches.map((item) => {
      const name = String(item.name || '').toLowerCase();
      const idx = name.indexOf(q);
      const starts = idx === 0 ? 0 : 1;
      return { item, starts, idx, len: name.length };
    });
    scored.sort((a, b) => (a.starts - b.starts) || (a.idx - b.idx) || (a.len - b.len));
    return scored.slice(0, 8).map((s) => s.item);
  }, [query, inventory]);

  return suggestions;
};

