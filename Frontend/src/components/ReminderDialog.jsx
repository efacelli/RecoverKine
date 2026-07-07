import { MessageSquareText, Copy } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { buildReminderMessage } from '../utils/reminderMessage';
import { useToast } from '../contexts/ToastContext';
import { logReminder } from '../services/patientsService';

export function ReminderDialog({ patient, open, onClose }) {
  const { showToast } = useToast();
  if (!patient) return null;

  const mensaje = buildReminderMessage(patient);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mensaje);
      await logReminder(patient.id);
      showToast('Mensaje copiado correctamente.', 'success');
    } catch {
      showToast('No se pudo copiar el mensaje.', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <MessageSquareText className="text-primary" size={20} />
        </div>
        <DialogTitle>Generar recordatorio</DialogTitle>
        <DialogDescription>
          Mensaje personalizado para {patient.nombre} {patient.apellido}.
        </DialogDescription>
      </DialogHeader>

      <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed">
        {mensaje}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
        <Button onClick={handleCopy}>
          <Copy size={16} />
          Copiar mensaje
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
