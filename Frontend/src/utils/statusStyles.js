export function getSessionColorClasses(sesionesRestantes) {
  if (sesionesRestantes > 5) return 'bg-success/10 text-success border-success/30';
  if (sesionesRestantes >= 3) return 'bg-warning/10 text-warning border-warning/30';
  if (sesionesRestantes >= 1) return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
  return 'bg-destructive/10 text-destructive border-destructive/30';
}

export const RANGO_LABELS = {
  MAS_DE_5: 'Mas de 5 sesiones',
  ENTRE_3_Y_5: 'Entre 3 y 5 sesiones',
  ENTRE_1_Y_2: 'Entre 1 y 2 sesiones',
  SIN_SESIONES: 'Sin sesiones',
};

export const ESTADO_LABELS = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  TRATAMIENTO_COMPLETADO: 'Tratamiento completado',
};

export function getEstadoBadgeClasses(estado) {
  switch (estado) {
    case 'ACTIVO':
      return 'bg-success/10 text-success border-success/30';
    case 'INACTIVO':
      return 'bg-muted text-muted-foreground border-border';
    case 'TRATAMIENTO_COMPLETADO':
      return 'bg-info/10 text-info border-info/30';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}
