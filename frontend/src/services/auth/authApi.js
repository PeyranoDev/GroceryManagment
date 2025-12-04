import { authRequest } from '../core/apiClient';

export const authAPI = {
  login: (credentials) => authRequest('/Auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => authRequest('/Auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  impersonate: (userId) => authRequest(`/Auth/impersonate/${userId}`, { method: 'POST' }),
};

