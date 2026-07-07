import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';

export function SameDayWarningDialog({ patient, open, onClose, onConfirm }) {
  if (!patient) return null;

  return (
    <Dialog open={open} onClose={onClose} className="border-destructive/40">
      <DialogHeader>
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="text-destructive" size={20} />
        </div>
        <DialogTitle className="text-destructive">Atencion</DialogTitle>
        <DialogDescription>
          Ya se registro una sesion para {patient.nombre} {patient.apellido} en el dia de hoy.
          ¿Estas seguro de que deseas descontar otra sesion?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Descontar igualmente
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
