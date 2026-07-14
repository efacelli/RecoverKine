import { useHistory } from '../hooks/useHistory';
import { Card } from './ui/Card';
import { Input, Label } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { History as HistoryIcon } from 'lucide-react';

export function HistoryModule() {
  const { logs, loading, filters, setFilters, pacienteInput, setPacienteInput } = useHistory();

  const handleChange = (field) => (e) => setFilters((prev) => ({ ...prev, [field]: e.target.value }));

  const clearFilters = () => {
    setFilters({ patientId: '', operador: '', desde: '', hasta: '', paciente: '' });
    setPacienteInput('');
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          <div className="space-y-1.5">
            <Label>Paciente</Label>
            <Input
              value={pacienteInput}
              onChange={(e) => setPacienteInput(e.target.value)}
              placeholder="Ej: Juan"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Usuario</Label>
            <Select value={filters.operador} onChange={handleChange('operador')}>
              <option value="">Todos</option>
              <option value="IGNACIO">Ignacio</option>
              <option value="MARIANO">Mariano</option>
              <option value="TOBIAS">Tobias</option>
              <option value="ANTONELA">Antonela</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Desde</Label>
            <Input type="date" value={filters.desde} onChange={handleChange('desde')} />
          </div>
          <div className="space-y-1.5">
            <Label>Hasta</Label>
            <Input type="date" value={filters.hasta} onChange={handleChange('hasta')} />
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Limpiar filtros
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">Cargando historial...</div>
        ) : !logs.length ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center text-muted-foreground">
            <HistoryIcon size={22} />
            <p>No hay registros para los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Hora</th>
                  <th className="px-4 py-3 font-medium">Usuario</th>
                  <th className="px-4 py-3 font-medium">Paciente</th>
                  <th className="px-4 py-3 font-medium">Accion</th>
                  <th className="px-4 py-3 font-medium">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const fecha = new Date(log.fecha);
                  return (
                    <tr key={log.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 whitespace-nowrap">{fecha.toLocaleDateString('es-AR')}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-medium">{log.operador}</td>
                      <td className="px-4 py-3">{log.pacienteNombre || '-'}</td>
                      <td className="px-4 py-3">{log.accion}</td>
                      <td className="max-w-[280px] truncate px-4 py-3 text-muted-foreground" title={log.detalle}>
                        {log.detalle || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}