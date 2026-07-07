import { useEffect, useState } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input, Label, Textarea } from './ui/Input';
import { useToast } from '../contexts/ToastContext';

const EMPTY_FORM = {
  nombre: '',
  apellido: '',
  obraSocial: '',
  tipoLesion: '',
  sesionesAutorizadas: '',
  observaciones: '',
};

export function PatientFormDialog({ open, onClose, onSubmit, patientToEdit, onDelete }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const isEditing = !!patientToEdit;

  useEffect(() => {
    if (open) {
      setForm(
        patientToEdit
          ? {
              nombre: patientToEdit.nombre,
              apellido: patientToEdit.apellido,
              obraSocial: patientToEdit.obraSocial,
              tipoLesion: patientToEdit.tipoLesion,
              sesionesAutorizadas: patientToEdit.sesionesAutorizadas,
              observaciones: patientToEdit.observaciones || '',
            }
          : EMPTY_FORM
      );
    }
  }, [open, patientToEdit]);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.obraSocial || !form.tipoLesion) {
      showToast('Completa todos los campos obligatorios.', 'error');
      return;
    }
    if (!isEditing && (form.sesionesAutorizadas === '' || Number(form.sesionesAutorizadas) < 0)) {
      showToast('Indica una cantidad valida de sesiones autorizadas.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await onSubmit(patientToEdit.id, {
          nombre: form.nombre,
          apellido: form.apellido,
          obraSocial: form.obraSocial,
          tipoLesion: form.tipoLesion,
          observaciones: form.observaciones,
        });
        showToast('Paciente actualizado correctamente.', 'success');
      } else {
        await onSubmit({
          ...form,
          sesionesAutorizadas: Number(form.sesionesAutorizadas),
        });
        showToast('Paciente creado correctamente.', 'success');
      }
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="max-w-lg">
      <DialogHeader>
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <UserPlus className="text-primary" size={20} />
        </div>
        <DialogTitle>{isEditing ? 'Editar paciente' : 'Nuevo paciente'}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Actualiza los datos del paciente.'
            : 'Completa los datos para registrar un nuevo paciente.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" value={form.nombre} onChange={handleChange('nombre')} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="apellido">Apellido</Label>
            <Input id="apellido" value={form.apellido} onChange={handleChange('apellido')} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="obraSocial">Obra Social</Label>
          <Input id="obraSocial" value={form.obraSocial} onChange={handleChange('obraSocial')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tipoLesion">Tipo de lesion</Label>
          <Input
            id="tipoLesion"
            value={form.tipoLesion}
            onChange={handleChange('tipoLesion')}
            placeholder="Ej: Lumbalgia, Rotura de LCA, Esguince de tobillo..."
          />
        </div>

        {!isEditing && (
          <div className="space-y-1.5">
            <Label htmlFor="sesionesAutorizadas">Sesiones autorizadas</Label>
            <Input
              id="sesionesAutorizadas"
              type="number"
              min="0"
              value={form.sesionesAutorizadas}
              onChange={handleChange('sesionesAutorizadas')}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={form.observaciones}
            onChange={handleChange('observaciones')}
            placeholder="Notas libres sobre el paciente..."
          />
        </div>

        <DialogFooter className={isEditing ? 'sm:justify-between' : undefined}>
          {isEditing && onDelete && (
            <Button
              type="button"
              variant="ghost"
              className="mr-auto text-destructive hover:bg-destructive/10"
              onClick={() => {
                onClose();
                onDelete(patientToEdit);
              }}
            >
              <Trash2 size={16} />
              Eliminar paciente
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear paciente'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
