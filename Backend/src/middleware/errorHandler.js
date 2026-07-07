const ApiError = require('../utils/ApiError');

// Middleware 404 - debe ir despues de todas las rutas
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

// Middleware central de manejo de errores - debe ir al final de la cadena
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let details = err.details || null;

  // Errores conocidos de Prisma
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Ya existe un registro con esos datos.';
  }
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Registro no encontrado.';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
  });
};

module.exports = { notFoundHandler, errorHandler };
