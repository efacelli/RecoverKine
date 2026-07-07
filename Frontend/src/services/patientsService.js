import { api } from './api';

export async function fetchPatients({ estado, rango, search } = {}) {
  const params = new URLSearchParams();
  if (estado) params.set('estado', estado);
  if (rango) params.set('rango', rango);
  if (search) params.set('search', search);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await api.get(`/patients${query}`);
  return res.data;
}

export async function fetchStats() {
  const res = await api.get('/patients/stats');
  return res.data;
}

export async function fetchPatientById(id) {
  const res = await api.get(`/patients/${id}`);
  return res.data;
}

export async function createPatient(payload) {
  const res = await api.post('/patients', payload);
  return res.data;
}

export async function updatePatient(id, payload) {
  const res = await api.put(`/patients/${id}`, payload);
  return res.data;
}

export async function deletePatient(id) {
  return api.delete(`/patients/${id}`);
}

export async function logReminder(id) {
  return api.post(`/patients/${id}/reminder-log`, {});
}

export async function downloadExcel() {
  const response = await api.raw('/patients/export/excel');
  if (!response.ok) throw new Error('No se pudo exportar el archivo.');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pacientes_recover.xlsx';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
