const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiClientError extends Error {
  constructor(message, status, requiresConfirmation = false) {
    super(message);
    this.status = status;
    this.requiresConfirmation = requiresConfirmation;
  }
}

async function request(path, { method = 'GET', body, headers = {}, raw = false } = {}) {
  const token = localStorage.getItem('recover-token');
  const operador = localStorage.getItem('recover-operador');

  const finalHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(operador ? { 'X-Operador': operador } : {}),
    ...headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (raw) return response;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiClientError(
      data.message || 'Ocurrio un error inesperado.',
      response.status,
      data.requiresConfirmation || false
    );
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
  raw: (path) => request(path, { raw: true }),
};

export { ApiClientError };