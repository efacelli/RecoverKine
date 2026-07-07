import { Users, CircleCheck, CircleAlert, CircleDot, CircleX } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

const CARDS = [
  { key: null, label: 'Total de pacientes', icon: Users, statKey: 'total', color: 'text-primary' },
  { key: 'MAS_DE_5', label: 'Mas de 5 sesiones', icon: CircleCheck, statKey: 'masDe5', color: 'text-success' },
  { key: 'ENTRE_3_Y_5', label: 'Entre 3 y 5 sesiones', icon: CircleAlert, statKey: 'entre3y5', color: 'text-warning' },
  { key: 'ENTRE_1_Y_2', label: 'Entre 1 y 2 sesiones', icon: CircleDot, statKey: 'entre1y2', color: 'text-orange-500' },
  { key: 'SIN_SESIONES', label: 'Sin sesiones', icon: CircleX, statKey: 'sinSesiones', color: 'text-destructive' },
];

export function StatsCards({ stats, rangoFilter, onToggleRango, onClearFilters }) {
  const hasFilter = !!rangoFilter;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CARDS.map(({ key, label, icon: Icon, statKey, color }) => {
          const active = key !== null && rangoFilter === key;
          return (
            <Card
              key={label}
              onClick={() => key && onToggleRango(key)}
              className={cn(
                'cursor-pointer select-none p-4 hover:shadow-soft-lg hover:-translate-y-0.5',
                active && 'ring-2 ring-primary border-primary'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <Icon size={18} className={color} />
              </div>
              <p className="mt-2 text-2xl font-semibold">{stats[statKey] ?? 0}</p>
            </Card>
          );
        })}
      </div>

      {hasFilter && (
        <div className="mt-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
