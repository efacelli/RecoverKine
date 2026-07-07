import { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input, Label } from './ui/Input';

export function RenewDialog({ patient, open, onClose, onConfirm }) {
  const [cantidad, setCantidad] = useState('');

  useEffect(() => {
    if (open) setCantidad('');
  }, [open]);

  if (!patient) return null;

  const handleConfirm = () => {
    const numero = Number(cantidad);
    if (!cantidad || numero < 0 || Number.isNaN(numero)) return;
    onConfirm(numero);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <RefreshCcw className="text-primary" size={20} />
        </div>
        <DialogTitle>Renovar autorizacion</DialogTitle>
        <DialogDescription>
          Ingresa la nueva cantidad de sesiones autorizadas para {patient.nombre} {patient.apellido}.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Label htmlFor="cantidad-renovacion">Nueva cantidad de sesiones autorizadas</Label>
        <Input
          id="cantidad-renovacion"
          type="number"
          min="0"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="Ej: 10"
          autoFocus
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm}>Renovar</Button>
      </DialogFooter>
    </Dialog>
  );
}
