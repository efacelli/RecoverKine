// Envuelve controladores async para propagar errores al middleware de errores
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Devuelve la clave de dia 'YYYY-MM-DD' en horario local de Argentina (UTC-3)
const getDiaClave = (date = new Date()) => {
  const offsetDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  return offsetDate.toISOString().split('T')[0];
};

// Determina el "color" / rango de sesiones restantes
const getRangoSesiones = (sesionesRestantes) => {
  if (sesionesRestantes > 5) return 'MAS_DE_5';
  if (sesionesRestantes >= 3) return 'ENTRE_3_Y_5';
  if (sesionesRestantes >= 1) return 'ENTRE_1_Y_2';
  return 'SIN_SESIONES';
};

// Arma el nombre completo para snapshots del historial
const nombreCompleto = (patient) => `${patient.nombre} ${patient.apellido}`;

module.exports = { asyncHandler, getDiaClave, getRangoSesiones, nombreCompleto };
