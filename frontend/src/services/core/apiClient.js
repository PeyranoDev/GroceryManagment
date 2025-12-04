export const getToken = () => localStorage.getItem('auth_token');

const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.__APP_ENV__?.API_URL) return window.__APP_ENV__.API_URL;
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return 'http://localhost:5001';
};

const normalizeApiUrl = (url) => {
  if (!url || typeof url !== 'string') return 'http://localhost:5001/api';
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

export const API_BASE_URL = normalizeApiUrl(getApiUrl());

export const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      const groceryId = u?.currentGroceryId ?? u?.groceryId;
      if (groceryId != null) headers['X-Grocery-Id'] = String(groceryId);
    }
  } catch {}
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const mapApiResponse = (response) => {
  if (response && typeof response === 'object' && 'success' in response) {
    if (!response.success) throw new Error(response.detail || 'Error en la operación');
    return response.data;
  }
  return response;
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = { headers: getHeaders(), ...options };
  const response = await fetch(url, config);
  if (!response.ok) {
    let msg = '';
    try { const ej = await response.json(); msg = ej?.detail || ej?.message || ''; } catch {}
    const fallback = response.status === 403 ? 'No autorizado' : (response.statusText || 'Error de red');
    throw new Error(msg || fallback);
  }
  const json = await response.json();
  return mapApiResponse(json);
};

export const authRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = { headers: { 'Content-Type': 'application/json' }, ...options };
  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Error de red' }));
    throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  return mapApiResponse(json);
};

export const handleApiError = (error) => {
  if (error?.message?.includes('Failed to fetch')) return 'Error de conexión. Verifica que el servidor esté ejecutándose.';
  return error?.message || 'Error desconocido';
};

export const useApiState = () => {
  const { useState } = await import('react');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const execute = async (apiCall) => {
    setLoading(true); setError(null);
    try { return await apiCall(); } catch (err) { setError(handleApiError(err)); throw err; } finally { setLoading(false); }
  };
  return { loading, error, execute };
};

