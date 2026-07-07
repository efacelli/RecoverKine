import { useState } from 'react';
import { Plus, FileSpreadsheet } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { StatsCards } from '../components/StatsCards';
import { PatientTable } from '../components/PatientTable';
import { PatientFormDialog } from '../components/PatientFormDialog';
import { SameDayWarningDialog } from '../components/SameDayWarningDialog';
import { RenewDialog } from '../components/RenewDialog';
import { ReminderDialog } from '../components/ReminderDialog';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { usePatients } from '../hooks/usePatients';
import { useSessionActions } from '../hooks/useSessionActions';
import { useToast } from '../contexts/ToastContext';
import { downloadExcel } from '../services/patientsService';

export function DashboardPage() {
  const {
    patients,
    stats,
    loading,
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
  } = usePatients();

  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [renewTarget, setRenewTarget] = useState(null);
  const [reminderTarget, setReminderTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    pendingWarning,
    setPendingWarning,
    lastMovement,
    handleDecrement,
    handleIncrement,
    handleRenew,
    handleUndo,
  } = useSessionActions({ onUpdated: refresh });

  const handleFormSubmit = (idOrPayload, maybePayload) => {
    if (maybePayload) return updatePatient(idOrPayload, maybePayload);
    return createPatient(idOrPayload);
  };

  const handleExport = async () => {
    try {
      await downloadExcel();
      showToast('Excel exportado correctamente.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePatient(deleteTarget.id);
      showToast('Paciente eliminado correctamente.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <MainLayout search={search} onSearchChange={setSearch}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Pacientes</h1>
          <p className="text-sm text-muted-foreground">Gestion de sesiones y tratamientos</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="w-auto"
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
            <option value="TRATAMIENTO_COMPLETADO">Tratamiento completado</option>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet size={16} />
            Exportar a Excel
          </Button>
          <Button
            onClick={() => {
              setPatientToEdit(null);
              setFormOpen(true);
            }}
          >
            <Plus size={16} />
            Nuevo paciente
          </Button>
        </div>
      </div>

      <StatsCards
        stats={stats}
        rangoFilter={rangoFilter}
        onToggleRango={toggleRango}
        onClearFilters={clearFilters}
      />

      <PatientTable
        patients={patients}
        loading={loading}
        onDecrement={(patient) => handleDecrement(patient)}
        onIncrement={handleIncrement}
        onRenew={setRenewTarget}
        onReminder={setReminderTarget}
        onEdit={(p) => {
          setPatientToEdit(p);
          setFormOpen(true);
        }}
        onDelete={setDeleteTarget}
        lastMovement={lastMovement}
        onUndo={handleUndo}
      />

      <PatientFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        patientToEdit={patientToEdit}
        onDelete={setDeleteTarget}
      />

      <SameDayWarningDialog
        patient={pendingWarning?.patient}
        open={!!pendingWarning}
        onClose={() => setPendingWarning(null)}
        onConfirm={async () => {
          await handleDecrement(pendingWarning.patient, true);
        }}
      />

      <RenewDialog
        patient={renewTarget}
        open={!!renewTarget}
        onClose={() => setRenewTarget(null)}
        onConfirm={async (cantidad) => {
          await handleRenew(renewTarget, cantidad);
          setRenewTarget(null);
        }}
      />

      <ReminderDialog
        patient={reminderTarget}
        open={!!reminderTarget}
        onClose={() => setReminderTarget(null)}
      />

      <ConfirmDeleteDialog
        patient={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </MainLayout>
  );
}
