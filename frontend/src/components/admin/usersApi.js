import { apiRequest } from '../../services/core/apiClient';

export const usersAPI = {
  getAll: () => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const u = storedUser ? JSON.parse(storedUser) : null;
      const isSuper = u?.currentRole === 'SuperAdmin';
      const endpoint = isSuper ? '/Users/grocery/all' : '/Users/grocery';
      return apiRequest(endpoint);
    } catch {
      return apiRequest('/Users/grocery');
    }
  },
  getById: (id) => apiRequest(`/Users/${id}`),
  create: (user) => apiRequest('/Users', { method: 'POST', body: JSON.stringify(user) }),
  update: (id, user) => apiRequest(`/Users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
  delete: (id) => apiRequest(`/Users/${id}`, { method: 'DELETE' }),
  setSuperAdmin: (id, isSuperAdmin) => apiRequest(`/Users/${id}/super-admin`, { method: 'PATCH', body: JSON.stringify({ isSuperAdmin }) }),
  setRole: (id, role) => {
    const map = { staff: 1, admin: 2, superadmin: 3 };
    const input = String(role).toLowerCase();
    const numeric = map[input] ?? (typeof role === 'number' ? role : undefined);
    const payload = { role: numeric };
    return apiRequest(`/Users/${id}/role`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  activate: (id) => apiRequest(`/Users/${id}/activate`, { method: 'PATCH' }),
};

