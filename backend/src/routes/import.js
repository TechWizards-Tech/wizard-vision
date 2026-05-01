const express = require('express');
const { upload, importXlsx } = require('../controllers/importController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.post('/xlsx', upload.single('file'), importXlsx);

module.exports = router;
