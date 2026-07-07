import { useCallback, useEffect, useState } from 'react';
import {
  fetchPatients,
  fetchStats,
  createPatient as createPatientRequest,
  updatePatient as updatePatientRequest,
  deletePatient as deletePatientRequest,
} from '../services/patientsService';

export function usePatients() {
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({ total: 0, masDe5: 0, entre3y5: 0, entre1y2: 0, sinSesiones: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [estadoFilter, setEstadoFilter] = useState('TODOS');
  const [rangoFilter, setRangoFilter] = useState(null);
  const [search, setSearch] = useState('');

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPatients({
        estado: estadoFilter !== 'TODOS' ? estadoFilter : undefined,
        rango: rangoFilter || undefined,
        search: search || undefined,
      });
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [estadoFilter, rangoFilter, search]);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch {
      // silencioso: no bloquear la UI si fallan las estadisticas
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const refresh = useCallback(async () => {
    await Promise.all([loadPatients(), loadStats()]);
  }, [loadPatients, loadStats]);

  const toggleRango = (rango) => {
    setRangoFilter((prev) => (prev === rango ? null : rango));
    setEstadoFilter('TODOS');
  };

  const clearFilters = () => {
    setRangoFilter(null);
    setEstadoFilter('TODOS');
    setSearch('');
  };

  const createPatient = async (payload) => {
    const patient = await createPatientRequest(payload);
    await refresh();
    return patient;
  };

  const updatePatient = async (id, payload) => {
    const patient = await updatePatientRequest(id, payload);
    await refresh();
    return patient;
  };

  const deletePatient = async (id) => {
    await deletePatientRequest(id);
    await refresh();
  };

  return {
    patients,
    stats,
    loading,
    error,
    estadoFilter,
    setEstadoFilter,
    rangoFilter,
    toggleRango,
    search,
    setSearch,
    clearFilters,
    refresh,
    createPatient,
    updatePatient,
    deletePatient,
  };
}
