import { api } from './api';

export async function loginRequest(username, password) {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
}

export async function logoutRequest(operador) {
  return api.post('/auth/logout', { operador });
}
