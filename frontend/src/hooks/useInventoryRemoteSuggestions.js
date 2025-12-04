import { useEffect, useState } from 'react';
import { inventoryAPI } from '../services/api';

export const useInventoryRemoteSuggestions = (query, inventoryFallback = []) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const q = String(query || '').trim();
    if (!q) { setSuggestions([]); return; }
    let cancelled = false;
    const fetcher = async () => {
      try {
        const resp = await inventoryAPI.getFiltered({ searchTerm: q });
        const items = resp.data || resp || [];
        const mapped = (Array.isArray(items) ? items : []).map((it) => ({
          id: it.id ?? it.Id,
          name: it.product?.name ?? it.name ?? it.Product?.Name ?? '',
          unit: it.unit ?? it.Unit ?? 'u',
        }));
        if (!cancelled) setSuggestions(mapped.slice(0, 8));
      } catch {
        // fallback to local filter
        const ql = q.toLowerCase();
        const local = (Array.isArray(inventoryFallback) ? inventoryFallback : [])
          .filter((item) => String(item.name || '').toLowerCase().includes(ql))
          .map((item) => ({ id: item.id, name: item.name || '', unit: item.unit || 'u' }))
          .slice(0, 8);
        if (!cancelled) setSuggestions(local);
      }
    };
    fetcher();
    return () => { cancelled = true; };
  }, [query, inventoryFallback]);

  return suggestions;
};

