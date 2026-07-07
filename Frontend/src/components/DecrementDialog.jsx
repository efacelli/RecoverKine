import { MinusCircle } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';

export function DecrementDialog({ patient, open, onClose, onConfirm }) {
  if (!patient) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <MinusCircle className="text-primary" size={20} />
        </div>
        <DialogTitle>¿Desea descontar una sesion?</DialogTitle>
        <DialogDescription>
          Se descontara una sesion a {patient.nombre} {patient.apellido}. Esta accion quedara
          registrada en el historial.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onConfirm}>Confirmar</Button>
      </DialogFooter>
    </Dialog>
  );
}
