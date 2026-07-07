require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const patientsRoutes = require('./routes/patients.routes');
const sessionsRoutes = require('./routes/sessions.routes');
const historyRoutes = require('./routes/history.routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Seguridad y utilidades base
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'RECOVER API funcionando correctamente.' });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/history', historyRoutes);

// Manejo de errores (siempre al final)
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`RECOVER API corriendo en http://localhost:${PORT}`);
});

module.exports = app;
