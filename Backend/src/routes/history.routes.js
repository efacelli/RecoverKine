const express = require('express');
const { getHistory } = require('../controllers/history.controller');
const { authMiddleware, operadorMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware, operadorMiddleware);

router.get('/', getHistory);

module.exports = router;
