import { MainLayout } from '../layouts/MainLayout';
import { HistoryModule } from '../components/HistoryModule';

export function HistoryPage() {
  return (
    <MainLayout>
      <div className="mb-5">
        <h1 className="text-xl font-semibold">Historial</h1>
        <p className="text-sm text-muted-foreground">
          Registro completo de todas las acciones realizadas en el sistema
        </p>
      </div>
      <HistoryModule />
    </MainLayout>
  );
}
