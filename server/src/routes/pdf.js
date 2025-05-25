const express = require('express');
const upload = require('../config/multer');
const pdfController = require('../controllers/pdfController');

const router = express.Router();

console.log('📋 Rotas PDF sendo carregadas...');

// Juntar PDFs
router.post('/merge', upload.array('pdfs', 10), pdfController.mergePDFs);

console.log('✅ Rota /merge configurada');

module.exports = router;
