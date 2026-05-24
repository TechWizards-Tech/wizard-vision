const express = require('express');
const { upload, importXlsx, recalculateMl } = require('../controllers/importController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.post('/xlsx', upload.single('file'), importXlsx);
router.post('/recalculate', recalculateMl);

module.exports = router;
