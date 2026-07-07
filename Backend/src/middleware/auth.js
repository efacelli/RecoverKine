const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

// Verifica el token JWT enviado en el header Authorization: Bearer <token>
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No se proporciono un token de autenticacion.');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { adminId: payload.adminId, username: payload.username };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'La sesion expiro. Por favor, inicia sesion nuevamente.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Token invalido.'));
    }
    next(error);
  }
};

// Verifica que el request incluya un operador valido (Ignacio / Juan)
// seleccionado en el dialogo post-login. Se envia en el header X-Operador.
const operadorMiddleware = (req, res, next) => {
  const operador = req.headers['x-operador'];
  if (!operador || !['IGNACIO', 'MARIANO', 'TOBIAS'].includes(operador)) {
    return next(new ApiError(400, 'Debe indicarse el operador actual (Ignacio, Mariano o Tobias).'));
  }
  req.operador = operador;
  next();
};

module.exports = { authMiddleware, operadorMiddleware };
