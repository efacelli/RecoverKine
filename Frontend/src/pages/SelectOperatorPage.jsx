import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { useOperator } from '../contexts/OperatorContext';

const OPTIONS = [
  { value: 'IGNACIO', label: 'Ignacio' },
  { value: 'MARIANO', label: 'Mariano' },
  { value: 'TOBIAS', label: 'Tobias' },
  { value: 'ANTONELLA', label: 'Antonella' },
];

export function SelectOperatorPage() {
  const { setOperador } = useOperator();
  const navigate = useNavigate();

  const handleSelect = (value) => {
    setOperador(value);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#1c3a63_0%,#2c5486_45%,#1a2b52_100%)] px-4">
      <Card className="w-full max-w-md animate-slide-up p-8 text-center">
        <h1 className="text-xl font-semibold">¿Quien esta utilizando el sistema?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecciona tu nombre para continuar. Todas las acciones quedaran registradas a tu nombre.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-smooth hover:-translate-y-1 hover:border-primary hover:shadow-soft-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
                {label[0]}
              </div>
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
