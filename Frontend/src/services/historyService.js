import { api } from './api';

export async function fetchHistory({ patientId, operador, desde, hasta } = {}) {
  const params = new URLSearchParams();
  if (patientId) params.set('patientId', patientId);
  if (operador) params.set('operador', operador);
  if (desde) params.set('desde', desde);
  if (hasta) params.set('hasta', hasta);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await api.get(`/history${query}`);
  return res.data;
}
