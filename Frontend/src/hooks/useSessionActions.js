import { useCallback, useState } from 'react';
import {
  decrementSession,
  incrementSession,
  renewAuthorization,
  undoMovement,
} from '../services/sessionsService';
import { ApiClientError } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const UNDO_WINDOW_MS = 6000;

export function useSessionActions({ onUpdated }) {
  const { showToast } = useToast();
  const [pendingWarning, setPendingWarning] = useState(null); // { patient }
  const [lastMovement, setLastMovement] = useState(null); // { id, timeoutId }

  const clearUndoTimer = () => {
    if (lastMovement?.timeoutId) clearTimeout(lastMovement.timeoutId);
  };

  const registerUndo = useCallback((movementId) => {
    clearUndoTimer();
    const timeoutId = setTimeout(() => setLastMovement(null), UNDO_WINDOW_MS);
    setLastMovement({ id: movementId, timeoutId });
  }, [lastMovement]);

  const handleDecrement = useCallback(
    async (patient, forzar = false) => {
      try {
        const res = await decrementSession(patient.id, forzar);
        onUpdated?.(res.data);
        registerUndo(res.movementId);
        showToast('Sesion descontada correctamente.', 'success');
        setPendingWarning(null);
      } catch (err) {
        // El backend responde 409 + requiresConfirmation cuando ya se
        // registro una sesion hoy para este paciente. Esto NO es un error,
        // es la senal para abrir el dialogo de advertencia (rojo) y dejar
        // que el usuario decida si quiere descontar igual.
        if (err instanceof ApiClientError && err.requiresConfirmation) {
          setPendingWarning({ patient });
          return;
        }
        showToast(err.message, 'error');
      }
    },
    [onUpdated, registerUndo, showToast]
  );

  const handleIncrement = useCallback(
    async (patient) => {
      try {
        const res = await incrementSession(patient.id);
        onUpdated?.(res.data);
        registerUndo(res.movementId);
        showToast('Sesion agregada correctamente.', 'info');
      } catch (err) {
        showToast(err.message, 'error');
      }
    },
    [onUpdated, registerUndo, showToast]
  );

  const handleRenew = useCallback(
    async (patient, nuevasSesiones) => {
      try {
        const updated = await renewAuthorization(patient.id, nuevasSesiones);
        onUpdated?.(updated);
        showToast('Autorizacion renovada correctamente.', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    },
    [onUpdated, showToast]
  );

  const handleUndo = useCallback(async () => {
    if (!lastMovement) return;
    try {
      const updated = await undoMovement(lastMovement.id);
      onUpdated?.(updated);
      clearUndoTimer();
      setLastMovement(null);
      showToast('Accion deshecha correctamente.', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [lastMovement, onUpdated, showToast]);

  return {
    pendingWarning,
    setPendingWarning,
    lastMovement,
    handleDecrement,
    handleIncrement,
    handleRenew,
    handleUndo,
  };
}
