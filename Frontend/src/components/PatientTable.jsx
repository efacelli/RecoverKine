import { useState } from 'react';
import {
  MinusCircle,
  PlusCircle,
  RefreshCcw,
  MessageSquareText,
  Pencil,
  Trash2,
  Undo2,
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { getSessionColorClasses, getEstadoBadgeClasses, ESTADO_LABELS } from '../utils/statusStyles';
import { cn } from '../utils/cn';

export function PatientTable({
  patients,
  loading,
  onDecrement,
  onIncrement,
  onRenew,
  onReminder,
  onEdit,
  onDelete,
  lastMovement,
  onUndo,
}) {
  const [hoveredRow, setHoveredRow] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-card p-16 text-muted-foreground">
        Cargando pacientes...
      </div>
    );
  }

  if (!patients.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-16 text-center text-muted-foreground">
        <p className="font-medium">No se encontraron pacientes</p>
        <p className="text-sm">Prueba ajustando los filtros o registra un nuevo paciente.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      {lastMovement && (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-accent px-4 py-2 text-sm animate-slide-up">
          <span className="text-accent-foreground">Ultima accion realizada</span>
          <Button size="sm" variant="ghost" onClick={onUndo} className="gap-1">
            <Undo2 size={14} /> Deshacer
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Apellido</th>
              <th className="px-4 py-3 font-medium">Obra Social</th>
              <th className="px-4 py-3 font-medium">Tipo de lesion</th>
              <th className="px-4 py-3 text-center font-medium">Autorizadas</th>
              <th className="px-4 py-3 text-center font-medium">Restantes</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Observaciones</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                onMouseEnter={() => setHoveredRow(patient.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className="border-b border-border/60 transition-smooth last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-3 font-medium">{patient.nombre}</td>
                <td className="px-4 py-3">{patient.apellido}</td>
                <td className="px-4 py-3 text-muted-foreground">{patient.obraSocial}</td>
                <td className="px-4 py-3 text-muted-foreground">{patient.tipoLesion}</td>
                <td className="px-4 py-3 text-center">{patient.sesionesAutorizadas}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => onDecrement(patient)}
                      title="Descontar sesion"
                    >
                      <MinusCircle size={16} />
                    </Button>
                    <Badge className={cn('min-w-[2.5rem] justify-center', getSessionColorClasses(patient.sesionesRestantes))}>
                      {patient.sesionesRestantes}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-success hover:bg-success/10"
                      onClick={() => onIncrement(patient)}
                      title="Sumar sesion"
                    >
                      <PlusCircle size={16} />
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={getEstadoBadgeClasses(patient.estado)}>
                    {ESTADO_LABELS[patient.estado]}
                  </Badge>
                </td>
                <td className="max-w-[180px] truncate px-4 py-3 text-muted-foreground" title={patient.observaciones}>
                  {patient.observaciones || '-'}
                </td>
                <td className="px-4 py-3">
                  <div
                    className={cn(
                      'flex items-center justify-end gap-1 transition-smooth',
                      hoveredRow === patient.id ? 'opacity-100' : 'opacity-60'
                    )}
                  >
                    <Button size="icon" variant="ghost" className="h-8 w-8" title="Renovar autorizacion" onClick={() => onRenew(patient)}>
                      <RefreshCcw size={15} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" title="Generar recordatorio" onClick={() => onReminder(patient)}>
                      <MessageSquareText size={15} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" title="Editar paciente" onClick={() => onEdit(patient)}>
                      <Pencil size={15} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      title="Eliminar paciente"
                      onClick={() => onDelete(patient)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
