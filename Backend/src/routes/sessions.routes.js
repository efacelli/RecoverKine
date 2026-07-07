const express = require('express');
const {
  decrementSession,
  incrementSession,
  renewAuthorization,
  undoMovement,
} = require('../controllers/sessions.controller');
const { authMiddleware, operadorMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware, operadorMiddleware);

router.post('/:patientId/decrement', decrementSession);
router.post('/:patientId/increment', incrementSession);
router.post('/:patientId/renew', renewAuthorization);
router.post('/movements/:movementId/undo', undoMovement);

module.exports = router;
