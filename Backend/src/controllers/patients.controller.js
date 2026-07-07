const ExcelJS = require('exceljs');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { asyncHandler, nombreCompleto } = require('../utils/helpers');

// GET /api/patients?estado=&rango=&search=
const getPatients = asyncHandler(async (req, res) => {
  const { estado, rango, search } = req.query;

  const where = {};

  if (estado && estado !== 'TODOS') {
    where.estado = estado;
  }

  if (search) {
    where.OR = [
      { nombre: { contains: search, mode: 'insensitive' } },
      { apellido: { contains: search, mode: 'insensitive' } },
      { obraSocial: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (rango === 'MAS_DE_5') where.sesionesRestantes = { gt: 5 };
  if (rango === 'ENTRE_3_Y_5') where.sesionesRestantes = { gte: 3, lte: 5 };
  if (rango === 'ENTRE_1_Y_2') where.sesionesRestantes = { gte: 1, lte: 2 };
  if (rango === 'SIN_SESIONES') where.sesionesRestantes = { equals: 0 };

  const patients = await prisma.patient.findMany({
    where,
    orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
  });

  res.json({ success: true, data: patients });
});

// GET /api/patients/stats
const getStats = asyncHandler(async (req, res) => {
  const [total, masDe5, entre3y5, entre1y2, sinSesiones] = await Promise.all([
    prisma.patient.count(),
    prisma.patient.count({ where: { sesionesRestantes: { gt: 5 } } }),
    prisma.patient.count({ where: { sesionesRestantes: { gte: 3, lte: 5 } } }),
    prisma.patient.count({ where: { sesionesRestantes: { gte: 1, lte: 2 } } }),
    prisma.patient.count({ where: { sesionesRestantes: { equals: 0 } } }),
  ]);

  res.json({
    success: true,
    data: { total, masDe5, entre3y5, entre1y2, sinSesiones },
  });
});

// GET /api/patients/:id
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.findUnique({
    where: { id: req.params.id },
    include: { movimientos: { orderBy: { fecha: 'desc' }, take: 20 } },
  });
  if (!patient) throw new ApiError(404, 'Paciente no encontrado.');
  res.json({ success: true, data: patient });
});

// POST /api/patients
const createPatient = asyncHandler(async (req, res) => {
  const { nombre, apellido, obraSocial, tipoLesion, sesionesAutorizadas, observaciones } = req.body;

  if (!nombre || !apellido || !obraSocial || !tipoLesion || sesionesAutorizadas === undefined) {
    throw new ApiError(400, 'Faltan campos obligatorios: nombre, apellido, obra social, tipo de lesion y sesiones autorizadas.');
  }

  if (Number(sesionesAutorizadas) < 0) {
    throw new ApiError(400, 'Las sesiones autorizadas no pueden ser negativas.');
  }

  // Verificar que el paciente no exista ya (por nombre y apellido)
  const existente = await prisma.patient.findFirst({
    where: {
      nombre: { equals: nombre.trim(), mode: 'insensitive' },
      apellido: { equals: apellido.trim(), mode: 'insensitive' },
    },
  });

  if (existente) {
    throw new ApiError(409, `Ya existe un paciente registrado con el nombre ${nombre} ${apellido}.`);
  }

  const patient = await prisma.patient.create({
    data: {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      obraSocial: obraSocial.trim(),
      tipoLesion: tipoLesion.trim(),
      sesionesAutorizadas: Number(sesionesAutorizadas),
      sesionesRestantes: Number(sesionesAutorizadas),
      observaciones: observaciones?.trim() || null,
      estado: 'ACTIVO',
    },
  });

  await prisma.historyLog.create({
    data: {
      operador: req.operador,
      patientId: patient.id,
      pacienteNombre: nombreCompleto(patient),
      accion: 'Paciente creado',
      detalle: `Se registro el paciente con ${patient.sesionesAutorizadas} sesiones autorizadas.`,
    },
  });

  res.status(201).json({ success: true, data: patient });
});

// PUT /api/patients/:id
const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, obraSocial, tipoLesion, observaciones, estado } = req.body;

  const existing = await prisma.patient.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Paciente no encontrado.');

  const cambios = [];
  if (tipoLesion !== undefined && tipoLesion !== existing.tipoLesion) {
    cambios.push(`Tipo de lesion: "${existing.tipoLesion}" -> "${tipoLesion}"`);
  }
  if (observaciones !== undefined && observaciones !== existing.observaciones) {
    cambios.push('Observaciones modificadas');
  }
  if (estado !== undefined && estado !== existing.estado) {
    cambios.push(`Estado: "${existing.estado}" -> "${estado}"`);
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      nombre: nombre?.trim() ?? existing.nombre,
      apellido: apellido?.trim() ?? existing.apellido,
      obraSocial: obraSocial?.trim() ?? existing.obraSocial,
      tipoLesion: tipoLesion?.trim() ?? existing.tipoLesion,
      observaciones: observaciones !== undefined ? observaciones?.trim() || null : existing.observaciones,
      estado: estado ?? existing.estado,
    },
  });

  await prisma.historyLog.create({
    data: {
      operador: req.operador,
      patientId: patient.id,
      pacienteNombre: nombreCompleto(patient),
      accion: 'Paciente editado',
      detalle: cambios.length ? cambios.join(' | ') : 'Se actualizaron los datos del paciente.',
    },
  });

  res.json({ success: true, data: patient });
});

// DELETE /api/patients/:id
const deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) throw new ApiError(404, 'Paciente no encontrado.');

  await prisma.historyLog.create({
    data: {
      operador: req.operador,
      patientId: null,
      pacienteNombre: nombreCompleto(patient),
      accion: 'Paciente eliminado',
      detalle: `Se elimino al paciente ${nombreCompleto(patient)}.`,
    },
  });

  await prisma.patient.delete({ where: { id } });

  res.json({ success: true, message: 'Paciente eliminado correctamente.' });
});

// GET /api/patients/export/excel
const exportExcel = asyncHandler(async (req, res) => {
  const patients = await prisma.patient.findMany({
    orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'RECOVER';
  const sheet = workbook.addWorksheet('Pacientes');

  sheet.columns = [
    { header: 'Nombre', key: 'nombre', width: 20 },
    { header: 'Apellido', key: 'apellido', width: 20 },
    { header: 'Obra Social', key: 'obraSocial', width: 20 },
    { header: 'Tipo de Lesion', key: 'tipoLesion', width: 25 },
    { header: 'Sesiones Autorizadas', key: 'sesionesAutorizadas', width: 18 },
    { header: 'Sesiones Restantes', key: 'sesionesRestantes', width: 18 },
    { header: 'Estado', key: 'estado', width: 20 },
    { header: 'Observaciones', key: 'observaciones', width: 35 },
  ];

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E3A5F' },
  };
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  patients.forEach((p) => {
    sheet.addRow({
      nombre: p.nombre,
      apellido: p.apellido,
      obraSocial: p.obraSocial,
      tipoLesion: p.tipoLesion,
      sesionesAutorizadas: p.sesionesAutorizadas,
      sesionesRestantes: p.sesionesRestantes,
      estado: p.estado,
      observaciones: p.observaciones || '',
    });
  });

  await prisma.historyLog.create({
    data: {
      operador: req.operador,
      accion: 'Exportacion a Excel',
      detalle: `Se exportaron ${patients.length} pacientes.`,
    },
  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachment; filename=pacientes_recover.xlsx');

  await workbook.xlsx.write(res);
  res.end();
});

// POST /api/patients/:id/reminder-log
// Registra en el historial que se genero un mensaje de recordatorio
const logReminder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) throw new ApiError(404, 'Paciente no encontrado.');

  await prisma.historyLog.create({
    data: {
      operador: req.operador,
      patientId: patient.id,
      pacienteNombre: nombreCompleto(patient),
      accion: 'Mensaje de recordatorio generado',
      detalle: `Se genero un recordatorio con ${patient.sesionesRestantes} sesiones restantes.`,
    },
  });

  res.json({ success: true });
});

module.exports = {
  getPatients,
  getStats,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  exportExcel,
  logReminder,
};
