const express = require('express');
const { listAlerts, markAsRead } = require('../controllers/alertController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.get('/', listAlerts);
router.patch('/:id/read', markAsRead);

module.exports = router;
