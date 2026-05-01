const express = require('express');
const { listAthletes, getAthlete, getStats } = require('../controllers/athleteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/stats/summary', getStats);
router.get('/', listAthletes);
router.get('/:id', getAthlete);

module.exports = router;
