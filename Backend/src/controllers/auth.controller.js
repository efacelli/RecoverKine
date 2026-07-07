const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../utils/helpers');

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, 'Usuario y contrasena son requeridos.');
  }

  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin) {
    throw new ApiError(401, 'Credenciales incorrectas.');
  }

  const passwordValida = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordValida) {
    throw new ApiError(401, 'Credenciales incorrectas.');
  }

  const token = jwt.sign(
    { adminId: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  res.json({
    success: true,
    data: {
      token,
      username: admin.username,
    },
  });
});

// POST /api/auth/logout
// El logout real ocurre en el cliente (se descarta el token). No se registra
// en el historial: quien inicia o cierra sesion no es informacion relevante
// para el registro de acciones sobre pacientes.
const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Sesion cerrada correctamente.' });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.user.adminId },
    select: { id: true, username: true, createdAt: true },
  });
  res.json({ success: true, data: admin });
});

module.exports = { login, logout, me };
