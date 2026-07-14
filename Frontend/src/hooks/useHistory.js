import { useCallback, useEffect, useState } from 'react';
import { fetchHistory } from '../services/historyService';

export function useHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ patientId: '', operador: '', desde: '', hasta: '', paciente: '' });
  const [pacienteInput, setPacienteInput] = useState('');

  // Debounce: espera 350ms sin que se siga escribiendo antes de buscar,
  // asi no se dispara un pedido al backend en cada tecla.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, paciente: pacienteInput }));
    }, 350);
    return () => clearTimeout(timeout);
  }, [pacienteInput]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistory({
        patientId: filters.patientId || undefined,
        operador: filters.operador || undefined,
        desde: filters.desde || undefined,
        hasta: filters.hasta || undefined,
        paciente: filters.paciente || undefined,
      });
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  return { logs, loading, error, filters, setFilters, pacienteInput, setPacienteInput, refresh: load };
}