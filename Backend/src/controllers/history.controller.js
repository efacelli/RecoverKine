const prisma = require('../config/prisma');
const { asyncHandler } = require('../utils/helpers');

// GET /api/history?patientId=&operador=&desde=&hasta=&paciente=
const getHistory = asyncHandler(async (req, res) => {
  const { patientId, operador, desde, hasta, paciente } = req.query;

  const where = {};
  if (patientId) where.patientId = patientId;
  if (operador && ['IGNACIO', 'MARIANO', 'TOBIAS', 'ANTONELA'].includes(operador)) where.operador = operador;

  // Busqueda parcial por nombre de paciente (ej: "juan" encuentra "Juan Perez")
  if (paciente) {
    where.pacienteNombre = { contains: paciente.trim(), mode: 'insensitive' };
  }

  if (desde || hasta) {
    where.fecha = {};
    if (desde) where.fecha.gte = new Date(`${desde}T00:00:00`);
    if (hasta) where.fecha.lte = new Date(`${hasta}T23:59:59`);
  }

  const logs = await prisma.historyLog.findMany({
    where,
    orderBy: { fecha: 'desc' },
    take: 500,
  });

  res.json({ success: true, data: logs });
});

module.exports = { getHistory };