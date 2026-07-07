import { api } from './api';

export async function decrementSession(patientId, forzar = false) {
  const res = await api.post(`/sessions/${patientId}/decrement`, { forzar });
  return res;
}

export async function incrementSession(patientId) {
  const res = await api.post(`/sessions/${patientId}/increment`, {});
  return res;
}

export async function renewAuthorization(patientId, nuevasSesionesAutorizadas) {
  const res = await api.post(`/sessions/${patientId}/renew`, { nuevasSesionesAutorizadas });
  return res.data;
}

export async function undoMovement(movementId) {
  const res = await api.post(`/sessions/movements/${movementId}/undo`, {});
  return res.data;
}
