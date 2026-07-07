const express = require('express');
const {
  getPatients,
  getStats,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  exportExcel,
  logReminder,
} = require('../controllers/patients.controller');
const { authMiddleware, operadorMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware, operadorMiddleware);

router.get('/', getPatients);
router.get('/stats', getStats);
router.get('/export/excel', exportExcel);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);
router.post('/:id/reminder-log', logReminder);

module.exports = router;
