import { Trash2 } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';

export function ConfirmDeleteDialog({ patient, open, onClose, onConfirm }) {
  if (!patient) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <Trash2 className="text-destructive" size={20} />
        </div>
        <DialogTitle>Eliminar paciente</DialogTitle>
        <DialogDescription>
          Esta a punto de eliminar a {patient.nombre} {patient.apellido} de forma permanente. Esta
          accion no se puede deshacer.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Eliminar
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
