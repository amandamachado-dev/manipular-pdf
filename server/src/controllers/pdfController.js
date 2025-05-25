const { PDFDocument } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

console.log('🎛️ Controlador PDF carregado');

exports.mergePDFs = async (req, res) => {
  try {
    console.log('📥 Requisição de merge recebida:', req.files?.length, 'arquivos');
    
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Pelo menos 2 arquivos PDF são necessários' });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      console.log('📄 Processando arquivo:', file.originalname);
      const pdfBytes = await fs.readFile(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
      
      await fs.remove(file.path);
    }

    const pdfBytes = await mergedPdf.save();
    
    console.log('✅ PDF criado com sucesso! Tamanho:', pdfBytes.length, 'bytes');
    
    // Headers corretos para PDF
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="merged-document.pdf"',
      'Content-Length': pdfBytes.length,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    
    // Enviar como Buffer
    res.end(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('❌ Erro ao juntar PDFs:', error);
    res.status(500).json({ error: 'Erro ao processar arquivos PDF: ' + error.message });
  }
};
