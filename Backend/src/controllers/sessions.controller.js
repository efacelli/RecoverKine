const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { asyncHandler, getDiaClave, nombreCompleto } = require('../utils/helpers');

// Determina el nuevo estado del paciente segun las sesiones restantes
const calcularNuevoEstado = (sesionesRestantes, estadoActual) => {
  if (sesionesRestantes === 0) return 'TRATAMIENTO_COMPLETADO';
  if (estadoActual === 'TRATAMIENTO_COMPLETADO' || estadoActual === 'INACTIVO') return 'ACTIVO';
  return estadoActual;
};

// POST /api/sessions/:patientId/decrement
// body: { forzar: boolean } -> forzar=true permite descontar aunque ya haya un
// descuento registrado hoy (segunda confirmacion del dialogo de advertencia)
// POST /api/sessions/:patientId/decrement
// body: { forzar: boolean } -> forzar=true permite descontar aunque ya haya un
// descuento registrado hoy (segunda confirmacion del dialogo de advertencia)
const decrementSession = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const forzar = req.body?.forzar === true;

  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new ApiError(404, 'Paciente no encontrado.');

  if (patient.sesionesRestantes <= 0) {
    throw new ApiError(400, 'El paciente ya no posee sesiones disponibles.');
  }

  const diaClave = getDiaClave();

  if (!forzar) {
    const yaDescontadoHoy = await prisma.sessionMovement.findFirst({
      where: { patientId, tipo: 'DESCUENTO', diaClave },
    });

    if (yaDescontadoHoy) {
      // Se devuelve 409 con una bandera especial para que el frontend
      // muestre el dialogo de advertencia en rojo.
      // !!! NOTA: Aquí frena la ejecución, NO RESTA NADA en la base de datos todavía !!!
      return res.status(409).json({
        success: false,
        requiresConfirmation: true,
        message: 'Ya se registro una sesion para este paciente en el dia de hoy. ¿Estas seguro de que deseas descontar otra sesion?',
      });
    }
  }

  // --- SI LLEGA ACÁ (ES PRIMERA VEZ O VIENE CON FORZAR = TRUE): SE EJECUTA LA RESTA ---

  const nuevasRestantes = patient.sesionesRestantes - 1;
  const nuevoEstado = calcularNuevoEstado(nuevasRestantes, patient.estado);

  const [updatedPatient, movement] = await prisma.$transaction([
    prisma.patient.update({
      where: { id: patientId },
      data: { sesionesRestantes: nuevasRestantes, estado: nuevoEstado },
    }),
    prisma.sessionMovement.create({
      data: { patientId, tipo: 'DESCUENTO', operador: req.operador, cantidad: 1, diaClave },
    }),
  ]);

  await prisma.historyLog.create({
    data: {
      operador: req.operador,
      patientId,
      pacienteNombre: nombreCompleto(updatedPatient),
      accion: 'Sesion descontada',
      detalle: `Sesiones restantes: ${nuevasRestantes}.${forzar ? ' (Segundo descuento del mismo dia, confirmado por el usuario)' : ''}`,
    },
  });

  if (nuevoEstado === 'TRATAMIENTO_COMPLETADO' && patient.estado !== 'TRATAMIENTO_COMPLETADO') {
    await prisma.historyLog.create({
      data: {
        operador: req.operador,
        patientId,
        pacienteNombre: nombreCompleto(updatedPatient),
        accion: 'Estado cambiado',
        detalle: 'El paciente paso a estado "Tratamiento completado" al agotar sus sesiones.',
      },
    });
  }

  // Respondemos al frontend con éxito y el estado 200 implícito
  return res.json({ success: true, data: updatedPatient, movementId: movement.id });
});

// POST /api/sessions/:patientId/increment
const incrementSession = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new ApiError(404, 'Paciente no encontrado.');

  const nuevasRestantes = patient.sesionesRestantes + 1;
  const nuevoEstado = calcularNuevoEstado(nuevasRestantes, patient.estado);
  const diaClave = getDiaClave();

  const [updatedPatient, movement] = await prisma.$transaction([
    prisma.patient.update({
      where: { id: patientId },
      data: { sesionesRestantes: nuevasRestantes, estado: nuevoEstado },
    }),
    prisma.sessionMovement.create({
      data: { patientId, tipo: 'SUMA', operador: req.operador, cantidad: 1, diaClave },
    }),
  ]);

  await prisma.historyLog.create({
    data: {
      operador: req.operador,
      patientId,
      pacienteNombre: nombreCompleto(updatedPatient),
      accion: 'Sesion agregada',
      detalle: `Sesiones restantes: ${nuevasRestantes}.`,
    },
  });

  res.json({ success: true, data: updatedPatient, movementId: movement.id });
});

// POST /api/sessions/:patientId/renew
// body: { nuevasSesionesAutorizadas: number }
const renewAuthorization = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { nuevasSesionesAutorizadas } = req.body;

  if (nuevasSesionesAutorizadas === undefined || Number(nuevasSesionesAutorizadas) < 0) {
    throw new ApiError(400, 'Debe indicar una cantidad valida de sesiones autorizadas.');
  }

  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new ApiError(404, 'Paciente no encontrado.');

  const cantidad = Number(nuevasSesionesAutorizadas);
  const diaClave = getDiaClave();

  const [updatedPatient] = await prisma.$transaction([
    prisma.patient.update({
      where: { id: patientId },
      data: {
        sesionesAutorizadas: cantidad,
        sesionesRestantes: cantidad,
        estado: cantidad > 0 ? 'ACTIVO' : patient.estado,
      },
    }),
    prisma.sessionMovement.create({
      data: { patientId, tipo: 'RENOVACION', operador: req.operador, cantidad, diaClave },
    }),
  ]);

  await prisma.historyLog.create({
    data: {
      operador: req.operador,
      patientId,
      pacienteNombre: nombreCompleto(updatedPatient),
      accion: 'Autorizacion renovada',
      detalle: `Nueva autorizacion: ${cantidad} sesiones.`,
    },
  });

  res.json({ success: true, data: updatedPatient });
});

// POST /api/sessions/movements/:movementId/undo
// Revierte el ultimo movimiento (disponible unos segundos en el frontend)
const undoMovement = asyncHandler(async (req, res) => {
  const { movementId } = req.params;

  const movement = await prisma.sessionMovement.findUnique({ where: { id: movementId } });
  if (!movement) throw new ApiError(404, 'La accion ya no puede deshacerse.');

  const patient = await prisma.patient.findUnique({ where: { id: movement.patientId } });
  if (!patient) throw new ApiError(404, 'Paciente no encontrado.');

  let nuevasRestantes = patient.sesionesRestantes;
  if (movement.tipo === 'DESCUENTO') nuevasRestantes += movement.cantidad;
  if (movement.tipo === 'SUMA') nuevasRestantes = Math.max(0, nuevasRestantes - movement.cantidad);
  // Las renovaciones no se deshacen automaticamente por seguridad de datos

  const nuevoEstado = calcularNuevoEstado(nuevasRestantes, patient.estado);

  const [updatedPatient] = await prisma.$transaction([
    prisma.patient.update({
      where: { id: patient.id },
      data: { sesionesRestantes: nuevasRestantes, estado: nuevoEstado },
    }),
    prisma.sessionMovement.delete({ where: { id: movementId } }),
  ]);

  await prisma.historyLog.create({
    data: {
      operador: req.operador,
      patientId: patient.id,
      pacienteNombre: nombreCompleto(updatedPatient),
      accion: 'Accion deshecha',
      detalle: `Se revirtio el ultimo movimiento (${movement.tipo}).`,
    },
  });

  res.json({ success: true, data: updatedPatient });
});

module.exports = { decrementSession, incrementSession, renewAuthorization, undoMovement };
